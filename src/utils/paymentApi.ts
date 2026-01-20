// API utilities for payment system
import {
    CreatePaymentRequest,
    DashboardStats,
    MonthlyEarnings,
    Notification,
    PaymentWithTransaction,
    Transaction,
    UpdatePaymentRequest
} from '../types/payment';
import { supabase } from './userSync';

// ============= Payment Requests API =============

/**
 * Create a new payment request (Admin only)
 */
export async function createPaymentRequest(
    data: CreatePaymentRequest,
    adminId: string
) {
    try {
        // Generate payment number
        const { data: paymentNumber } = await supabase.rpc('generate_payment_number');

        const { data: payment, error } = await supabase
            .from('payment_requests')
            .insert({
                ...data,
                payment_number: paymentNumber,
                created_by_admin_id: adminId,
                status: 'pending_client_review',
            })
            .select()
            .single();

        if (error) throw error;

        // Create notification for user
        await createNotification({
            payment_request_id: payment.id,
            title: 'New Payment Request',
            message: `You have a new payment request for ${data.currency || 'INR'} ${data.amount}`,
            type: 'payment_pending',
            client_email: data.client_email,
        });

        // Log action
        await logPaymentHistory(payment.id, 'created', adminId);

        return payment;
    } catch (error) {
        console.error('Error creating payment request:', error);
        throw error;
    }
}

/**
 * Get all payment requests for a user
 */
export async function getUserPaymentRequests(
    userId?: string,
    email?: string,
    phone?: string
) {
    try {
        let query = supabase
            .from('payment_requests')
            .select('*, transactions(*)')
            .order('created_at', { ascending: false });

        // Build query to match by email, phone, or user_id
        const conditions = [];

        if (email) {
            conditions.push(`client_email.eq.${email}`);
        }
        if (phone) {
            conditions.push(`client_phone.eq.${phone}`);
        }
        if (userId) {
            conditions.push(`user_id.eq.${userId}`);
        }

        if (conditions.length > 0) {
            query = query.or(conditions.join(','));
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching user payment requests:', error);
            throw error;
        }

        console.log(`✅ Found ${data?.length || 0} payment requests for user`);
        return data as PaymentWithTransaction[];
    } catch (error) {
        console.error('Error fetching user payment requests:', error);
        return [];
    }
}

/**
 * Get all payment requests (Admin only)
 */
export async function getAllPaymentRequests() {
    try {
        const { data, error } = await supabase
            .from('payment_requests')
            .select('*, transactions(*)')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as PaymentWithTransaction[];
    } catch (error) {
        console.error('Error fetching all payment requests:', error);
        return [];
    }
}

/**
 * Get a single payment request by ID
 */
export async function getPaymentRequest(id: string) {
    try {
        const { data, error } = await supabase
            .from('payment_requests')
            .select('*, transactions(*)')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data as PaymentWithTransaction;
    } catch (error) {
        console.error('Error fetching payment request:', error);
        return null;
    }
}

/**
 * Update payment request
 */
export async function updatePaymentRequest(
    id: string,
    updates: UpdatePaymentRequest,
    userId?: string
) {
    try {
        const { data, error } = await supabase
            .from('payment_requests')
            .update({
                ...updates,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        // Log action
        if (userId) {
            await logPaymentHistory(id, 'edited', userId, undefined, updates);
        }

        return data;
    } catch (error) {
        console.error('Error updating payment request:', error);
        throw error;
    }
}

/**
 * Update payment request status (simplified)
 */
export async function updatePaymentRequestStatus(
    id: string,
    status: 'completed' | 'failed'
) {
    try {
        const { data, error } = await supabase
            .from('payment_requests')
            .update({
                status,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        console.log(`✅ Payment request ${id} status updated to:`, status);
        return data;
    } catch (error) {
        console.error('Error updating payment request status:', error);
        throw error;
    }
}

/**
 * Client submits payment request
 */
export async function clientSubmitPayment(id: string, userId?: string) {
    try {
        const { data, error } = await supabase
            .from('payment_requests')
            .update({
                status: 'client_submitted',
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        // Create notification for admin
        await createAdminNotification({
            payment_request_id: id,
            title: 'Payment Request Submitted',
            message: `A client has submitted a payment request ${data.payment_number} for review`,
            type: 'info',
        });

        // Log action
        if (userId) {
            await logPaymentHistory(id, 'client_submitted', userId);
        }

        return data;
    } catch (error) {
        console.error('Error submitting payment request:', error);
        throw error;
    }
}

/**
 * Admin approves payment request
 */
export async function adminApprovePayment(
    id: string,
    adminId: string,
    updates?: UpdatePaymentRequest
) {
    try {
        const { data, error } = await supabase
            .from('payment_requests')
            .update({
                ...updates,
                status: 'admin_approved',
                admin_approved: true,
                admin_approval_date: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        // Create notification for client
        const { data: payment } = await supabase
            .from('payment_requests')
            .select('client_email')
            .eq('id', id)
            .single();

        if (payment) {
            await createNotification({
                payment_request_id: id,
                title: 'Payment Request Approved',
                message: `Your payment request has been approved. Please review and accept to proceed with payment.`,
                type: 'payment_approved',
                client_email: payment.client_email,
            });
        }

        // Log action
        await logPaymentHistory(id, 'admin_approved', adminId);

        return data;
    } catch (error) {
        console.error('Error approving payment request:', error);
        throw error;
    }
}

/**
 * Admin rejects payment request
 */
export async function adminRejectPayment(
    id: string,
    adminId: string,
    reason?: string
) {
    try {
        const { data, error } = await supabase
            .from('payment_requests')
            .update({
                status: 'admin_rejected',
                remarks: reason,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        // Create notification for client
        const { data: payment } = await supabase
            .from('payment_requests')
            .select('client_email')
            .eq('id', id)
            .single();

        if (payment) {
            await createNotification({
                payment_request_id: id,
                title: 'Payment Request Rejected',
                message: reason || 'Your payment request has been rejected.',
                type: 'error',
                client_email: payment.client_email,
            });
        }

        // Log action
        await logPaymentHistory(id, 'admin_rejected', adminId, undefined, { reason });

        return data;
    } catch (error) {
        console.error('Error rejecting payment request:', error);
        throw error;
    }
}

/**
 * Client accepts payment request (goes directly to payment pending)
 */
export async function clientAcceptPayment(id: string, userId?: string) {
    try {
        const { data, error } = await supabase
            .from('payment_requests')
            .update({
                client_accepted: true,
                client_acceptance_date: new Date().toISOString(),
                admin_approved: true, // Auto-approve when client accepts
                admin_approval_date: new Date().toISOString(),
                payment_enabled: true,
                status: 'payment_pending',
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        // Log action
        if (userId) {
            await logPaymentHistory(id, 'client_accepted', userId, null, {
                message: 'Client accepted payment request and is ready to pay'
            });
        }

        return data;
    } catch (error) {
        console.error('Error accepting payment request:', error);
        throw error;
    }
}

/**
 * Admin cancels payment request
 */
export async function cancelPaymentRequest(id: string, adminId: string, reason?: string) {
    try {
        const { data, error } = await supabase
            .from('payment_requests')
            .update({
                status: 'cancelled',
                remarks: reason || 'Payment request cancelled by admin',
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        // Log action
        await logPaymentHistory(id, 'admin_cancelled', adminId, null, {
            message: reason || 'Payment request cancelled'
        });

        // Notify client
        const payment = await getPaymentRequest(id);
        if (payment) {
            await createNotification({
                payment_request_id: id,
                title: 'Payment Request Cancelled',
                message: `Your payment request ${payment.payment_number} has been cancelled. ${reason || ''}`,
                type: 'error',
                client_email: payment.client_email,
            });
        }

        return data;
    } catch (error) {
        console.error('Error cancelling payment request:', error);
        throw error;
    }
}

// ============= Transactions API =============

/**
 * Create a transaction
 */
export async function createTransaction(
    paymentRequestId: string,
    userId: string,
    amount: number,
    transactionId: string
) {
    try {
        const { data, error } = await supabase
            .from('transactions')
            .insert({
                payment_request_id: paymentRequestId,
                user_id: userId,
                transaction_id: transactionId,
                amount,
                status: 'initiated',
                currency: 'INR',
            })
            .select()
            .single();

        if (error) throw error;

        // Log action
        await logPaymentHistory(paymentRequestId, 'payment_initiated', userId);

        return data;
    } catch (error) {
        console.error('Error creating transaction:', error);
        throw error;
    }
}

/**
 * Update transaction status
 */
export async function updateTransaction(
    id: string,
    updates: Partial<Transaction>
) {
    try {
        const { data, error } = await supabase
            .from('transactions')
            .update({
                ...updates,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        // Update payment request status based on transaction
        if (updates.status === 'success') {
            const { data: transaction } = await supabase
                .from('transactions')
                .select('payment_request_id, user_id')
                .eq('id', id)
                .single();

            if (transaction) {
                await supabase
                    .from('payment_requests')
                    .update({ status: 'completed' })
                    .eq('id', transaction.payment_request_id);

                await logPaymentHistory(
                    transaction.payment_request_id,
                    'payment_completed',
                    transaction.user_id
                );

                // Notify admin
                await createAdminNotification({
                    payment_request_id: transaction.payment_request_id,
                    title: 'Payment Completed',
                    message: `Payment has been successfully completed`,
                    type: 'success',
                });
            }
        } else if (updates.status === 'failed') {
            const { data: transaction } = await supabase
                .from('transactions')
                .select('payment_request_id, user_id')
                .eq('id', id)
                .single();

            if (transaction) {
                await logPaymentHistory(
                    transaction.payment_request_id,
                    'payment_failed',
                    transaction.user_id
                );
            }
        }

        return data;
    } catch (error) {
        console.error('Error updating transaction:', error);
        throw error;
    }
}

/**
 * Get transactions for a payment request
 */
export async function getPaymentTransactions(paymentRequestId: string) {
    try {
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('payment_request_id', paymentRequestId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Transaction[];
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return [];
    }
}

/**
 * Get all transactions for a user
 */
export async function getUserTransactions(userId: string) {
    try {
        const { data, error } = await supabase
            .from('transactions')
            .select('*, payment_requests(*)')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching user transactions:', error);
        return [];
    }
}

// ============= Notifications API =============

/**
 * Create notification for user
 */
async function createNotification(params: {
    payment_request_id?: string;
    title: string;
    message: string;
    type: string;
    client_email: string;
}) {
    try {
        // Find user by email
        const { data: user } = await supabase
            .from('users')
            .select('id')
            .eq('email', params.client_email)
            .single();

        if (!user) return;

        const { error } = await supabase.from('notifications').insert({
            user_id: user.id,
            payment_request_id: params.payment_request_id,
            title: params.title,
            message: params.message,
            type: params.type,
        });

        if (error) throw error;
    } catch (error) {
        console.error('Error creating notification:', error);
    }
}

/**
 * Create notification for admin
 */
async function createAdminNotification(params: {
    payment_request_id?: string;
    title: string;
    message: string;
    type: string;
}) {
    try {
        // Find admin users
        const { data: admins } = await supabase
            .from('users')
            .select('id')
            .eq('is_admin', true);

        if (!admins || admins.length === 0) return;

        const notifications = admins.map((admin) => ({
            user_id: admin.id,
            payment_request_id: params.payment_request_id,
            title: params.title,
            message: params.message,
            type: params.type,
        }));

        const { error } = await supabase.from('notifications').insert(notifications);

        if (error) throw error;
    } catch (error) {
        console.error('Error creating admin notification:', error);
    }
}

/**
 * Get user notifications
 */
export async function getUserNotifications(userId: string) {
    try {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Notification[];
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return [];
    }
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(id: string) {
    try {
        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', id);

        if (error) throw error;
    } catch (error) {
        console.error('Error marking notification as read:', error);
    }
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllNotificationsAsRead(userId: string) {
    try {
        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', userId)
            .eq('is_read', false);

        if (error) throw error;
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        throw error;
    }
}

/**
 * Get unread notification count
 */
export async function getUnreadNotificationCount(userId: string) {
    try {
        const { count, error } = await supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('is_read', false);

        if (error) throw error;
        return count || 0;
    } catch (error) {
        console.error('Error fetching unread notification count:', error);
        return 0;
    }
}

// ============= Payment History API =============

/**
 * Log payment history
 */
async function logPaymentHistory(
    paymentRequestId: string,
    action: string,
    userId?: string,
    oldData?: any,
    newData?: any
) {
    try {
        const { error } = await supabase.from('payment_history').insert({
            payment_request_id: paymentRequestId,
            action,
            performed_by_user_id: userId,
            old_data: oldData,
            new_data: newData,
        });

        if (error) throw error;
    } catch (error) {
        console.error('Error logging payment history:', error);
    }
}

/**
 * Get payment history
 */
export async function getPaymentHistory(paymentRequestId: string) {
    try {
        const { data, error } = await supabase
            .from('payment_history')
            .select('*, users(*)')
            .eq('payment_request_id', paymentRequestId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching payment history:', error);
        return [];
    }
}

// ============= Admin Dashboard API =============

/**
 * Get dashboard statistics
 */
export async function getDashboardStats() {
    try {
        const { data, error } = await supabase
            .from('admin_dashboard_stats')
            .select('*')
            .single();

        if (error) throw error;
        return data as DashboardStats;
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return null;
    }
}

/**
 * Get monthly earnings data for chart
 */
export async function getMonthlyEarnings() {
    try {
        const { data, error } = await supabase
            .from('monthly_earnings_chart')
            .select('*')
            .order('month', { ascending: true });

        if (error) throw error;
        return data as MonthlyEarnings[];
    } catch (error) {
        console.error('Error fetching monthly earnings:', error);
        return [];
    }
}

/**
 * Get previous month statistics for comparison
 */
export async function getPreviousMonthStats() {
    try {
        // Try to use the database function first
        const { data, error } = await supabase.rpc('get_previous_month_stats').single();

        if (!error && data) {
            return {
                total_earnings: Number(data.total_earnings) || 0,
                monthly_earnings: Number(data.monthly_earnings) || 0
            };
        }

        // Fallback: calculate manually if RPC fails
        console.log('Using fallback calculation for previous month stats');

        const { data: prevTransactions } = await supabase
            .from('transactions')
            .select('amount, status, created_at')
            .eq('status', 'success')
            .gte('created_at', new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString())
            .lt('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

        const prevMonthEarnings = prevTransactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;

        const { data: allPrevTransactions } = await supabase
            .from('transactions')
            .select('amount')
            .eq('status', 'success')
            .lt('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

        const totalPrevEarnings = allPrevTransactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;

        return {
            total_earnings: totalPrevEarnings,
            monthly_earnings: prevMonthEarnings
        };
    } catch (error) {
        console.error('Error fetching previous month stats:', error);
        return {
            total_earnings: 0,
            monthly_earnings: 0
        };
    }
}
