// Payment System Types

export interface User {
    id: string;
    clerk_id: string;
    email: string;
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    is_admin: boolean;
    created_at: string;
    updated_at: string;
}

export type PaymentStatus =
    | 'pending_client_review'
    | 'client_submitted'
    | 'admin_approved'
    | 'admin_rejected'
    | 'payment_pending'
    | 'completed'
    | 'failed';

export interface PaymentRequest {
    id: string;
    payment_number: string;
    user_id?: string;
    created_by_admin_id?: string;
    client_email: string;
    client_phone?: string;
    client_name?: string;
    amount: number;
    currency: string;
    description: string;
    remarks?: string;
    status: PaymentStatus;
    admin_approved: boolean;
    admin_approval_date?: string;
    client_accepted: boolean;
    client_acceptance_date?: string;
    payment_enabled: boolean;
    created_at: string;
    updated_at: string;
}

export type TransactionStatus =
    | 'initiated'
    | 'processing'
    | 'success'
    | 'failed'
    | 'refunded';

export interface Transaction {
    id: string;
    payment_request_id: string;
    user_id?: string;
    transaction_id?: string;
    payu_transaction_id?: string;
    amount: number;
    currency: string;
    status: TransactionStatus;
    payment_method?: string;
    payment_gateway: string;
    gateway_response?: Record<string, any>;
    invoice_url?: string;
    invoice_number?: string;
    error_message?: string;
    created_at: string;
    updated_at: string;
}

export type PaymentHistoryAction =
    | 'created'
    | 'client_viewed'
    | 'client_submitted'
    | 'admin_approved'
    | 'admin_rejected'
    | 'payment_initiated'
    | 'payment_completed'
    | 'payment_failed'
    | 'edited';

export interface PaymentHistory {
    id: string;
    payment_request_id: string;
    action: PaymentHistoryAction;
    performed_by_user_id?: string;
    old_data?: Record<string, any>;
    new_data?: Record<string, any>;
    notes?: string;
    created_at: string;
}

export type NotificationType =
    | 'info'
    | 'success'
    | 'warning'
    | 'error'
    | 'payment_pending'
    | 'payment_approved';

export interface Notification {
    id: string;
    user_id: string;
    payment_request_id?: string;
    title: string;
    message: string;
    type: NotificationType;
    is_read: boolean;
    created_at: string;
}

export interface CreatePaymentRequest {
    client_email: string;
    client_phone?: string;
    client_name?: string;
    amount: number;
    currency?: string;
    description: string;
    remarks?: string;
}

export interface UpdatePaymentRequest {
    amount?: number;
    description?: string;
    remarks?: string;
    status?: PaymentStatus;
    admin_approved?: boolean;
    client_accepted?: boolean;
    payment_enabled?: boolean;
}

export interface PayUConfig {
    merchant_key: string;
    merchant_salt: string;
    client_id: string;
    client_secret: string;
    mode: 'test' | 'production';
    success_url: string;
    failure_url: string;
}

export interface PayUPaymentData {
    key: string;
    txnid: string;
    amount: string;
    productinfo: string;
    firstname: string;
    email: string;
    phone: string;
    surl: string;
    furl: string;
    hash: string;
    service_provider?: string;
    udf1?: string;
    udf2?: string;
    udf3?: string;
    udf4?: string;
    udf5?: string;
}

export interface DashboardStats {
    total_payments: number;
    completed_payments: number;
    pending_payments: number;
    approved_payments: number;
    total_earnings: number;
    monthly_earnings: number;
    successful_transactions: number;
    failed_transactions: number;
}

export interface MonthlyEarnings {
    month: string;
    earnings: number;
    transaction_count: number;
}

export interface PaymentWithTransaction extends PaymentRequest {
    transactions?: Transaction[];
    latest_transaction?: Transaction;
}
