import { CheckCircle, Download, Home, Loader2, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getPaymentRequest, updatePaymentRequestStatus, updateTransaction } from '../utils/paymentApi';
import { formatCurrency, handlePaymentFailure, handlePaymentSuccess } from '../utils/paymentGateway';

export default function PaymentResult() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState<any>(null);
    const [payment, setPayment] = useState<any>(null); const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        processPaymentResponse();
    }, []);

    // Auto redirect after success
    useEffect(() => {
        if (!loading && result?.success && countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (!loading && result?.success && countdown === 0) {
            navigate('/payments');
        }
    }, [loading, result, countdown, navigate]);
    useEffect(() => {
        processPaymentResponse();
    }, []);

    async function processPaymentResponse() {
        try {
            const isSuccess = window.location.pathname.includes('success');

            // Get all query parameters
            const params: any = {};
            searchParams.forEach((value, key) => {
                params[key] = value;
            });

            console.log('💳 Processing payment response:');
            console.log('📍 Path:', window.location.pathname);
            console.log('✅ Is Success Path:', isSuccess);
            console.log('📊 All Params:', JSON.stringify(params, null, 2));
            console.log('🔑 Status from PayU:', params.status);

            let paymentResult;
            if (isSuccess) {
                console.log('🟢 Processing as SUCCESS');
                paymentResult = handlePaymentSuccess(params);
            } else {
                console.log('🔴 Processing as FAILURE');
                paymentResult = handlePaymentFailure(params);
            }

            console.log('📦 Payment Result:', JSON.stringify(paymentResult, null, 2));
            setResult(paymentResult);

            // Get payment request ID from udf1
            const paymentRequestId = params.udf1;

            if (paymentRequestId) {
                try {
                    // Fetch payment details
                    const paymentData = await getPaymentRequest(paymentRequestId);
                    setPayment(paymentData);

                    // Update transaction in database if transaction exists
                    if (paymentData?.transaction_id) {
                        await updateTransaction(paymentData.transaction_id, {
                            status: paymentResult.success ? 'completed' : 'failed',
                            payu_transaction_id: paymentResult.payuTransactionId,
                            payment_method: paymentResult.paymentMode || 'PayU',
                            gateway_response: params,
                            error_message: paymentResult.error,
                        });
                    }

                    // Update payment request status
                    await updatePaymentRequestStatus(
                        paymentRequestId,
                        paymentResult.success ? 'completed' : 'failed'
                    );

                    console.log('✅ Database updated successfully');
                } catch (dbError) {
                    console.error('❌ Error updating database:', dbError);
                }
            }
        } catch (error) {
            console.error('Error processing payment:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-16 h-16 text-cyan-400 animate-spin mx-auto mb-4" />
                    <p className="text-gray-300 text-lg">Processing your payment...</p>
                </div>
            </div>
        );
    }

    const isSuccess = result?.success;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900 flex items-center justify-center px-4 py-20">
            <div className="max-w-2xl w-full">
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 md:p-12 border border-white/10 text-center">
                    {/* Success Animation */}
                    {isSuccess ? (
                        <div className="mb-6">
                            {/* Animated Success Circle */}
                            <div className="relative w-32 h-32 mx-auto mb-6">
                                {/* Outer ring animation */}
                                <div className="absolute inset-0 rounded-full border-4 border-green-400 animate-ping opacity-20"></div>
                                <div className="absolute inset-0 rounded-full border-4 border-green-400/30 animate-pulse"></div>
                                {/* Inner circle with checkmark */}
                                <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/50 animate-scale-in">
                                    <CheckCircle className="w-16 h-16 text-white animate-check-in" strokeWidth={2.5} />
                                </div>
                            </div>

                            {/* Confetti Effect */}
                            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                {[...Array(20)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="absolute w-2 h-2 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full animate-confetti"
                                        style={{
                                            left: `${Math.random() * 100}%`,
                                            top: '-10px',
                                            animationDelay: `${Math.random() * 0.5}s`,
                                            animationDuration: `${2 + Math.random() * 2}s`
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="mb-6">
                            <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto border-4 border-red-400/30">
                                <XCircle className="w-12 h-12 text-red-400" />
                            </div>
                        </div>
                    )}

                    {/* Title */}
                    <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${isSuccess ? 'text-green-400' : 'text-red-400'}`}>
                        {isSuccess ? '🎉 Payment Successful!' : 'Payment Failed'}
                    </h1>

                    {/* Description */}
                    <p className="text-gray-300 text-lg mb-8">
                        {isSuccess
                            ? 'Your payment has been processed successfully. Thank you for your payment!'
                            : result?.error || 'Unfortunately, your payment could not be processed. Please try again.'}
                    </p>

                    {/* Auto-redirect countdown for success */}
                    {isSuccess && countdown > 0 && (
                        <div className="mb-6 text-cyan-400 text-sm animate-pulse">
                            Redirecting to payments page in {countdown} seconds...
                        </div>
                    )}

                    {/* Payment Details */}
                    {payment && (
                        <div className="bg-white/5 rounded-xl p-6 mb-8 text-left border border-white/10">
                            <h3 className="text-white font-semibold mb-4 flex items-center">
                                <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></span>
                                Payment Details
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                    <span className="text-gray-400">Payment Number:</span>
                                    <span className="text-white font-medium">{payment.payment_number}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                    <span className="text-gray-400">Amount:</span>
                                    <span className="text-green-400 font-bold text-lg">
                                        {formatCurrency(result.amount || payment.amount, payment.currency)}
                                    </span>
                                </div>
                                {result.transactionId && (
                                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                                        <span className="text-gray-400">Transaction ID:</span>
                                        <span className="text-white font-mono text-xs">{result.transactionId}</span>
                                    </div>
                                )}
                                {result.payuTransactionId && (
                                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                                        <span className="text-gray-400">PayU Transaction ID:</span>
                                        <span className="text-white font-mono text-xs">{result.payuTransactionId}</span>
                                    </div>
                                )}
                                {result.paymentMode && (
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-gray-400">Payment Method:</span>
                                        <span className="text-white">{result.paymentMode}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {isSuccess && result.invoiceUrl && (
                            <button
                                onClick={() => window.open(result.invoiceUrl, '_blank')}
                                className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-cyan-500/30"
                            >
                                <Download className="w-5 h-5" />
                                <span>Download Invoice</span>
                            </button>
                        )}
                        <button
                            onClick={() => navigate('/payments')}
                            className="flex items-center justify-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-all border border-white/20 hover:border-white/30"
                        >
                            <Home className="w-5 h-5" />
                            <span>Back to Payments</span>
                        </button>
                        {!isSuccess && (
                            <button
                                onClick={() => navigate('/payments')}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-500/30"
                            >
                                Try Again
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Custom CSS for animations */}
            <style>{`
                @keyframes scale-in {
                    0% {
                        transform: scale(0);
                        opacity: 0;
                    }
                    50% {
                        transform: scale(1.1);
                    }
                    100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }

                @keyframes check-in {
                    0% {
                        transform: scale(0) rotate(-45deg);
                        opacity: 0;
                    }
                    50% {
                        transform: scale(1.2) rotate(0deg);
                    }
                    100% {
                        transform: scale(1) rotate(0deg);
                        opacity: 1;
                    }
                }

                @keyframes confetti {
                    0% {
                        transform: translateY(0) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100vh) rotate(720deg);
                        opacity: 0;
                    }
                }

                .animate-scale-in {
                    animation: scale-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }

                .animate-check-in {
                    animation: check-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s forwards;
                }

                .animate-confetti {
                    animation: confetti linear forwards;
                }
            `}</style>
        </div>
    );
}
