import { useUser } from '@clerk/clerk-react';
import {
    AlertCircle,
    CheckCircle,
    Clock,
    CreditCard,
    Download,
    FileCheck,
    Loader2,
    Wallet,
    XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Notification, PaymentWithTransaction } from '../types/payment';
import {
    clientAcceptPayment,
    getUserNotifications,
    getUserPaymentRequests,
    markNotificationAsRead,
    updatePaymentRequestStatus,
    updateTransaction,
} from '../utils/paymentApi';
import {
    formatCurrency,
    initiatePayUPayment,
    submitPayUPayment,
} from '../utils/paymentGateway';
import { syncUserToSupabase } from '../utils/userSync';

export default function Payments() {
    const { user } = useUser();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [payments, setPayments] = useState<PaymentWithTransaction[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [activeTab, setActiveTab] = useState<'payments' | 'verify' | 'transactions'>('payments');
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [demoMode, setDemoMode] = useState(false); // Toggle for demo payment mode

    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }

        initializeUser();
    }, [user]);

    async function initializeUser() {
        try {
            setLoading(true);

            // Sync user to Supabase
            const syncedUser = await syncUserToSupabase({
                id: user!.id,
                emailAddresses: user!.emailAddresses.map((e) => ({ emailAddress: e.emailAddress })),
                firstName: user!.firstName || undefined,
                lastName: user!.lastName || undefined,
                phoneNumbers: user!.phoneNumbers?.map((p) => ({ phoneNumber: p.phoneNumber })),
            });

            setCurrentUser(syncedUser);

            // Fetch payment requests
            const email = user!.emailAddresses[0]?.emailAddress;
            const phone = user!.phoneNumbers?.[0]?.phoneNumber;

            console.log('🔍 Fetching payments for:', { email, phone, userId: syncedUser?.id });

            const paymentRequests = await getUserPaymentRequests(
                syncedUser?.id,
                email,
                phone
            );

            console.log('📦 Received payments:', paymentRequests.length);
            setPayments(paymentRequests);

            // Fetch notifications
            if (syncedUser) {
                const userNotifications = await getUserNotifications(syncedUser.id);
                setNotifications(userNotifications);
            }
        } catch (error) {
            console.error('Error initializing user:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleAcceptPayment(paymentId: string) {
        try {
            await clientAcceptPayment(paymentId, currentUser?.id);
            await initializeUser(); // Refresh data
            alert('Payment accepted! You can now proceed to pay.');
        } catch (error) {
            console.error('Error accepting payment:', error);
            alert('Failed to accept payment');
        }
    }

    async function handleMakePayment(payment: PaymentWithTransaction) {
        try {
            if (!currentUser) return;

            if (demoMode) {
                // Demo Mode: Simulate payment locally
                const confirmPayment = window.confirm(
                    `Demo Payment\n\nAmount: ${formatCurrency(payment.amount)}\nDescription: ${payment.description}\n\nClick OK to simulate SUCCESS or Cancel to simulate FAILURE`
                );

                if (confirmPayment) {
                    // Simulate success
                    setTimeout(async () => {
                        try {
                            await updatePaymentRequestStatus(payment.id, 'completed');
                            if (payment.transaction_id) {
                                await updateTransaction(payment.transaction_id, {
                                    status: 'completed',
                                    payment_method: 'DEMO',
                                    gateway_transaction_id: `DEMO_${Date.now()}`,
                                });
                            }
                            alert('✅ Demo Payment Successful!');
                            await initializeUser();
                        } catch (error) {
                            console.error('Error updating payment:', error);
                            alert(`Error updating payment status: ${error instanceof Error ? error.message : 'Unknown error'}`);
                        }
                    }, 1000);
                } else {
                    // Simulate failure
                    alert('❌ Demo Payment Cancelled');
                }
                return;
            }

            // Real PayU Mode
            const paymentData = initiatePayUPayment({
                amount: payment.amount,
                productinfo: payment.description,
                firstname: user!.firstName || currentUser.first_name || 'Customer',
                email: user!.emailAddresses[0].emailAddress,
                phone: user!.phoneNumbers?.[0]?.phoneNumber || payment.client_phone || '0000000000',
                udf1: payment.id, // Store payment request ID
            });

            // Submit to PayU
            submitPayUPayment(paymentData);
        } catch (error) {
            console.error('Error initiating payment:', error);
            alert('Failed to initiate payment');
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending_client_review':
                return 'bg-yellow-500/20 text-yellow-400';
            case 'client_submitted':
                return 'bg-blue-500/20 text-blue-400';
            case 'admin_approved':
                return 'bg-purple-500/20 text-purple-400';
            case 'payment_pending':
                return 'bg-orange-500/20 text-orange-400';
            case 'completed':
                return 'bg-green-500/20 text-green-400';
            case 'cancelled':
                return 'bg-gray-500/20 text-gray-400';
            case 'failed':
            case 'admin_rejected':
                return 'bg-red-500/20 text-red-400';
            default:
                return 'bg-gray-500/20 text-gray-400';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="w-5 h-5" />;
            case 'cancelled':
                return <XCircle className="w-5 h-5" />;
            case 'failed':
            case 'admin_rejected':
                return <XCircle className="w-5 h-5" />;
            case 'pending_client_review':
            case 'client_submitted':
            case 'payment_pending':
                return <Clock className="w-5 h-5" />;
            default:
                return <AlertCircle className="w-5 h-5" />;
        }
    };

    const getStatusText = (status: string) => {
        return status
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    async function handleMarkNotificationAsRead(notificationId: string) {
        try {
            await markNotificationAsRead(notificationId);
            setNotifications((prev) =>
                prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
            );
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
                    <p className="text-gray-300">Loading your payments...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900 py-20 px-4">
            <div className="container mx-auto max-w-6xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
                            Payment Portal
                        </span>
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Manage your payments and view transaction history
                    </p>

                    {/* Demo Mode Toggle */}
                    <div className="mt-6 flex items-center justify-center gap-3">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={demoMode}
                                onChange={(e) => setDemoMode(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                            <span className="ms-3 text-sm font-medium text-gray-300">
                                {demoMode ? '🎮 Demo Mode (Local Testing)' : '💳 PayU Mode (Real Gateway)'}
                            </span>
                        </label>
                    </div>
                    {demoMode && (
                        <p className="text-yellow-400 text-sm mt-2">
                            ⚠️ Demo mode: Payments will be simulated locally without PayU
                        </p>
                    )}
                </div>

                {/* Notifications */}
                {notifications.filter((n) => !n.is_read).length > 0 && (
                    <div className="mb-8 space-y-3">
                        {notifications
                            .filter((n) => !n.is_read)
                            .slice(0, 3)
                            .map((notification) => (
                                <div
                                    key={notification.id}
                                    className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 flex items-start space-x-4"
                                >
                                    <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1">
                                        <h3 className="text-white font-medium">{notification.title}</h3>
                                        <p className="text-gray-400 text-sm mt-1">{notification.message}</p>
                                    </div>
                                    <button
                                        onClick={() => handleMarkNotificationAsRead(notification.id)}
                                        className="text-blue-400 hover:text-blue-300 text-sm"
                                    >
                                        Dismiss
                                    </button>
                                </div>
                            ))}
                    </div>
                )}

                {/* Tabs */}
                <div className="flex space-x-4 mb-8 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('payments')}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${activeTab === 'payments'
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                            : 'bg-white/5 text-gray-400 hover:text-white'
                            }`}
                    >
                        <Wallet className="w-5 h-5" />
                        <span>Make Payment</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('verify')}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${activeTab === 'verify'
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                            : 'bg-white/5 text-gray-400 hover:text-white'
                            }`}
                    >
                        <FileCheck className="w-5 h-5" />
                        <span>Verify & Download</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('transactions')}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${activeTab === 'transactions'
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                            : 'bg-white/5 text-gray-400 hover:text-white'
                            }`}
                    >
                        <CreditCard className="w-5 h-5" />
                        <span>Transaction History</span>
                    </button>
                </div>

                {/* Content */}
                {payments.length === 0 ? (
                    <div className="bg-white/5 backdrop-blur-lg rounded-xl p-12 text-center">
                        <Wallet className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                        <h3 className="text-xl text-gray-300 mb-2">No Payments Found</h3>
                        <p className="text-gray-500">
                            You don't have any payment requests at the moment.
                        </p>
                        <p className="text-gray-600 text-sm mt-2">
                            Check your email: {user?.emailAddresses[0]?.emailAddress}
                        </p>
                    </div>
                ) : activeTab === 'payments' ? (
                    <div className="space-y-6">
                        {payments
                            .filter((p) =>
                                p.status !== 'completed' &&
                                p.status !== 'admin_rejected' &&
                                p.status !== 'cancelled' &&
                                p.status !== 'failed'
                            )
                            .length === 0 ? (
                            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-12 text-center">
                                <Wallet className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                                <h3 className="text-xl text-gray-300 mb-2">No Pending Payments</h3>
                                <p className="text-gray-500">
                                    You don't have any pending payments at the moment.
                                </p>
                            </div>
                        ) : (
                            payments
                                .filter((p) =>
                                    p.status !== 'completed' &&
                                    p.status !== 'admin_rejected' &&
                                    p.status !== 'cancelled' &&
                                    p.status !== 'failed'
                                )
                                .map((payment) => (
                                    <div
                                        key={payment.id}
                                        className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-cyan-500/50 transition-all"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                            <div>
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <h3 className="text-xl font-semibold text-white">
                                                        {payment.payment_number}
                                                    </h3>
                                                    <span
                                                        className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${getStatusColor(
                                                            payment.status
                                                        )}`}
                                                    >
                                                        {getStatusIcon(payment.status)}
                                                        <span>{getStatusText(payment.status)}</span>
                                                    </span>
                                                </div>
                                                <p className="text-gray-400">{payment.description}</p>
                                            </div>
                                            <div className="mt-4 md:mt-0 text-right">
                                                <p className="text-3xl font-bold text-cyan-400">
                                                    {formatCurrency(payment.amount, payment.currency)}
                                                </p>
                                            </div>
                                        </div>

                                        {payment.remarks && (
                                            <div className="bg-blue-500/10 rounded-lg p-3 mb-4">
                                                <p className="text-sm text-blue-300">
                                                    <strong>Note:</strong> {payment.remarks}
                                                </p>
                                            </div>
                                        )}

                                        <div className="flex flex-wrap gap-4">
                                            {payment.status === 'pending_client_review' && !payment.client_accepted && (
                                                <button
                                                    onClick={() => handleAcceptPayment(payment.id)}
                                                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg font-medium transition-all"
                                                >
                                                    <CheckCircle className="w-5 h-5" />
                                                    <span>Accept & Proceed to Pay</span>
                                                </button>
                                            )}

                                            {payment.payment_enabled && payment.status === 'payment_pending' && (
                                                <button
                                                    onClick={() => handleMakePayment(payment)}
                                                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-green-500/30"
                                                >
                                                    <CreditCard className="w-5 h-5" />
                                                    <span>Pay Now</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                        )}
                    </div>
                ) : activeTab === 'verify' ? (
                    <div className="space-y-6">
                        {payments
                            .filter((p) => p.status === 'completed' || p.transactions?.some((t) => t.status === 'success'))
                            .map((payment) => {
                                const successTransaction = payment.transactions?.find(
                                    (t) => t.status === 'success'
                                );

                                return (
                                    <div
                                        key={payment.id}
                                        className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                            <div>
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <h3 className="text-xl font-semibold text-white">
                                                        {payment.payment_number}
                                                    </h3>
                                                    <span className="flex items-center space-x-1 px-3 py-1 rounded-full text-sm bg-green-500/20 text-green-400">
                                                        <CheckCircle className="w-4 h-4" />
                                                        <span>Completed</span>
                                                    </span>
                                                </div>
                                                <p className="text-gray-400">{payment.description}</p>
                                                {successTransaction && (
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        Transaction ID: {successTransaction.transaction_id}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="mt-4 md:mt-0 text-right">
                                                <p className="text-3xl font-bold text-green-400">
                                                    {formatCurrency(payment.amount, payment.currency)}
                                                </p>
                                            </div>
                                        </div>

                                        {successTransaction?.invoice_url && (
                                            <button
                                                onClick={() => window.open(successTransaction.invoice_url, '_blank')}
                                                className="flex items-center space-x-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-all"
                                            >
                                                <Download className="w-4 h-4" />
                                                <span>Download Invoice</span>
                                            </button>
                                        )}
                                    </div>
                                );
                            })}

                        {payments.filter((p) => p.status === 'completed').length === 0 && (
                            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-12 text-center">
                                <FileCheck className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                                <h3 className="text-xl text-gray-300 mb-2">No Completed Payments</h3>
                                <p className="text-gray-500">
                                    Your completed payments will appear here.
                                </p>
                            </div>
                        )}
                    </div>
                ) : activeTab === 'transactions' ? (
                    <div className="space-y-6">
                        {/* Transaction History */}
                        {payments.map((payment) => {
                            const getStatusIcon = () => {
                                switch (payment.status) {
                                    case 'completed':
                                        return <CheckCircle className="w-5 h-5 text-green-400" />;
                                    case 'failed':
                                        return <XCircle className="w-5 h-5 text-red-400" />;
                                    case 'payment_pending':
                                        return <Clock className="w-5 h-5 text-yellow-400" />;
                                    default:
                                        return <Clock className="w-5 h-5 text-gray-400" />;
                                }
                            };

                            const getStatusColor = () => {
                                switch (payment.status) {
                                    case 'completed':
                                        return 'bg-green-500/20 text-green-400';
                                    case 'failed':
                                        return 'bg-red-500/20 text-red-400';
                                    case 'payment_pending':
                                        return 'bg-yellow-500/20 text-yellow-400';
                                    default:
                                        return 'bg-gray-500/20 text-gray-400';
                                }
                            };

                            const getStatusLabel = () => {
                                switch (payment.status) {
                                    case 'completed':
                                        return 'Completed';
                                    case 'failed':
                                        return 'Failed';
                                    case 'payment_pending':
                                        return 'Pending';
                                    case 'pending_client_review':
                                        return 'Review Pending';
                                    default:
                                        return payment.status;
                                }
                            };

                            return (
                                <div key={payment.id} className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-4 flex-1">
                                            <div className="mt-1">{getStatusIcon()}</div>
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <h3 className="text-white font-semibold">{payment.payment_number}</h3>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
                                                        {getStatusLabel()}
                                                    </span>
                                                </div>
                                                <p className="text-gray-400 mb-2">{payment.description}</p>
                                                <div className="text-sm text-gray-500 space-y-1">
                                                    <p>Date: {new Date(payment.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                                                    {payment.transaction && payment.transaction.payu_transaction_id && (
                                                        <p className="font-mono">PayU ID: {payment.transaction.payu_transaction_id}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right ml-4">
                                            <p className="text-2xl font-bold text-white">
                                                {formatCurrency(payment.amount, payment.currency)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {payments.length === 0 && (
                            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-12 text-center">
                                <CreditCard className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                                <h3 className="text-xl text-gray-300 mb-2">No Transactions</h3>
                                <p className="text-gray-500">
                                    Your transaction history will appear here.
                                </p>
                            </div>
                        )}
                    </div>
                ) : null}
            </div>
        </div>
    );
}
