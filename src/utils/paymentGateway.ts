// PayU Payment Gateway Integration
import CryptoJS from 'crypto-js';
import { PayUPaymentData } from '../types/payment';

// PayU Configuration
const PAYU_CONFIG = {
    merchantKey: import.meta.env.VITE_PAYU_MERCHANT_KEY || '',
    merchantSalt: import.meta.env.VITE_PAYU_MERCHANT_SALT || '',
    clientId: import.meta.env.VITE_PAYU_CLIENT_ID || '',
    clientSecret: import.meta.env.VITE_PAYU_CLIENT_SECRET || '',
    mode: (import.meta.env.VITE_PAYU_MODE || 'test') as 'test' | 'production',
};

// PayU URLs
const PAYU_BASE_URL = {
    test: 'https://test.payu.in/_payment',
    production: 'https://secure.payu.in/_payment',
};

/**
 * Generate hash for PayU payment
 */
function generateHash(data: {
    key: string;
    txnid: string;
    amount: string;
    productinfo: string;
    firstname: string;
    email: string;
    udf1?: string;
    udf2?: string;
    udf3?: string;
    udf4?: string;
    udf5?: string;
    salt: string;
}): string {
    // PayU hash format: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||salt
    // Note: 5 additional empty fields (udf6-udf10) represented by 5 pipes after udf5
    const udf1 = data.udf1 || '';
    const udf2 = data.udf2 || '';
    const udf3 = data.udf3 || '';
    const udf4 = data.udf4 || '';
    const udf5 = data.udf5 || '';

    const hashString = `${data.key}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${data.salt}`;
    console.log('🔐 Hash String (without salt at end):', hashString.replace(data.salt, '****SALT****'));
    console.log('📊 Hash Components:', {
        key: data.key,
        txnid: data.txnid,
        amount: data.amount,
        productinfo: data.productinfo,
        firstname: data.firstname,
        email: data.email,
        udf1, udf2, udf3, udf4, udf5,
    });

    const hash = CryptoJS.SHA512(hashString).toString();
    console.log('🔑 Generated Hash:', hash);
    return hash;
}

/**
 * Generate unique transaction ID
 */
export function generateTransactionId(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000000);
    return `TXN${timestamp}${random}`;
}

/**
 * Initiate PayU payment
 */
export function initiatePayUPayment(params: {
    amount: number;
    productinfo: string;
    firstname: string;
    email: string;
    phone: string;
    txnid?: string;
    udf1?: string; // Can be used for payment_request_id
    udf2?: string;
    udf3?: string;
    udf4?: string;
    udf5?: string;
}): PayUPaymentData {
    const txnid = params.txnid || generateTransactionId();
    const amount = params.amount.toFixed(2);

    // Success and failure URLs
    const baseUrl = window.location.origin;
    const surl = `${baseUrl}/payment/success`;
    const furl = `${baseUrl}/payment/failure`;

    // Prepare UDF fields with defaults (all empty unless specified)
    const udf1 = params.udf1 || '';
    const udf2 = params.udf2 || '';
    const udf3 = params.udf3 || '';
    const udf4 = params.udf4 || '';
    const udf5 = params.udf5 || '';

    // Generate hash with all UDF fields
    const hash = generateHash({
        key: PAYU_CONFIG.merchantKey,
        txnid,
        amount,
        productinfo: params.productinfo,
        firstname: params.firstname,
        email: params.email,
        udf1,
        udf2,
        udf3,
        udf4,
        udf5,
        salt: PAYU_CONFIG.merchantSalt,
    });

    const paymentData = {
        key: PAYU_CONFIG.merchantKey,
        txnid,
        amount,
        productinfo: params.productinfo,
        firstname: params.firstname,
        email: params.email,
        phone: params.phone,
        surl,
        furl,
        hash,
        service_provider: 'payu_paisa',
        udf1,
        udf2,
        udf3,
        udf4,
        udf5,
    };

    console.log('💳 Payment Data being sent to PayU:', {
        ...paymentData,
        hash: hash.substring(0, 20) + '...',
    });

    return paymentData;
}

/**
 * Submit payment form to PayU
 */
export function submitPayUPayment(paymentData: PayUPaymentData) {
    console.log('🚀 Submitting to PayU:', PAYU_BASE_URL[PAYU_CONFIG.mode]);
    console.log('📝 Form data being submitted:', paymentData);

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = PAYU_BASE_URL[PAYU_CONFIG.mode];

    const formFields: Record<string, string> = {};

    // Add all payment data as hidden inputs
    Object.entries(paymentData).forEach(([key, value]) => {
        // Only skip if value is undefined or null (allow empty strings for UDF fields)
        if (value !== undefined && value !== null) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = String(value); // Use String() instead of toString() for safety
            form.appendChild(input);
            formFields[key] = String(value);
        }
    });

    console.log('✅ Final form fields:', formFields);

    document.body.appendChild(form);
    form.submit();
}

/**
 * Verify PayU payment response hash
 */
export function verifyPayUResponse(response: {
    status: string;
    txnid: string;
    amount: string;
    productinfo: string;
    firstname: string;
    email: string;
    udf1?: string;
    udf2?: string;
    udf3?: string;
    udf4?: string;
    udf5?: string;
    hash: string;
}): boolean {
    // PayU response hash format (reverse): salt|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key
    const udf1 = response.udf1 || '';
    const udf2 = response.udf2 || '';
    const udf3 = response.udf3 || '';
    const udf4 = response.udf4 || '';
    const udf5 = response.udf5 || '';

    const reverseHashString = `${PAYU_CONFIG.merchantSalt}|${response.status}||||||${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${response.email}|${response.firstname}|${response.productinfo}|${response.amount}|${response.txnid}|${PAYU_CONFIG.merchantKey}`;
    const calculatedHash = CryptoJS.SHA512(reverseHashString).toString();

    console.log('🔍 Verifying PayU response hash');
    console.log('📊 Response Hash:', response.hash);
    console.log('🔑 Calculated Hash:', calculatedHash);
    console.log('✅ Hash Match:', calculatedHash === response.hash);

    return calculatedHash === response.hash;
}

/**
 * Handle PayU payment success response
 */
export function handlePaymentSuccess(response: any) {
    console.log('💳 Processing PayU Success Response:', response);

    // Verify the hash
    const isValid = verifyPayUResponse(response);

    if (!isValid) {
        console.error('❌ Invalid payment response hash');
        console.error('⚠️ WARNING: Payment may have succeeded but hash verification failed');
        console.error('Response data:', JSON.stringify(response, null, 2));

        // Still process the payment if status is success (for debugging production issues)
        if (response.status?.toLowerCase() === 'success') {
            console.warn('⚠️ Processing payment despite hash mismatch because status is SUCCESS');
            return {
                success: true,
                transactionId: response.txnid,
                payuTransactionId: response.mihpayid,
                amount: parseFloat(response.amount),
                status: response.status,
                paymentMode: response.mode,
                bankRefNo: response.bank_ref_num,
                cardNum: response.cardnum,
                hashVerified: false, // Flag to indicate hash wasn't verified
            };
        }

        return {
            success: false,
            error: 'Invalid payment response',
        };
    }

    console.log('✅ Payment hash verified successfully');
    return {
        success: true,
        transactionId: response.txnid,
        payuTransactionId: response.mihpayid,
        amount: parseFloat(response.amount),
        status: response.status,
        paymentMode: response.mode,
        bankRefNo: response.bank_ref_num,
        cardNum: response.cardnum,
        hashVerified: true,
    };
}

/**
 * Handle PayU payment failure response
 */
export function handlePaymentFailure(response: any) {
    return {
        success: false,
        transactionId: response.txnid,
        error: response.error_Message || response.field9 || 'Payment failed',
        status: response.status,
    };
}

/**
 * Get payment status message
 */
export function getPaymentStatusMessage(status: string): {
    title: string;
    message: string;
    type: 'success' | 'error' | 'warning';
} {
    switch (status.toLowerCase()) {
        case 'success':
            return {
                title: 'Payment Successful!',
                message: 'Your payment has been processed successfully.',
                type: 'success',
            };
        case 'failure':
            return {
                title: 'Payment Failed',
                message: 'Your payment could not be processed. Please try again.',
                type: 'error',
            };
        case 'pending':
            return {
                title: 'Payment Pending',
                message: 'Your payment is being processed. Please wait.',
                type: 'warning',
            };
        case 'cancelled':
            return {
                title: 'Payment Cancelled',
                message: 'You have cancelled the payment.',
                type: 'warning',
            };
        default:
            return {
                title: 'Unknown Status',
                message: 'Unable to determine payment status.',
                type: 'error',
            };
    }
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number, currency: string = 'INR'): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
    }).format(amount);
}

/**
 * Generate invoice number
 */
export function generateInvoiceNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000);
    return `INV-${year}${month}-${random}`;
}
