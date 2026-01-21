import { CheckCircle, FileText, X } from 'lucide-react';
import { useState } from 'react';

interface PaymentAcceptanceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAccept: () => void;
    payment: {
        payment_number: string;
        amount: number;
        currency: string;
        description: string;
    };
}

export default function PaymentAcceptanceModal({
    isOpen,
    onClose,
    onAccept,
    payment,
}: PaymentAcceptanceModalProps) {
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    if (!isOpen) return null;

    const handleAccept = async () => {
        if (!agreedToTerms) {
            alert('Please agree to the terms and conditions to proceed.');
            return;
        }

        setIsProcessing(true);
        try {
            await onAccept();
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-cyan-500/20">
                {/* Header */}
                <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <CheckCircle className="w-8 h-8 text-white" />
                        <h2 className="text-2xl font-bold text-white">Payment Verification</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                    {/* Payment Details */}
                    <div className="bg-white/5 rounded-xl p-5 mb-6 border border-white/10">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                            <FileText className="w-5 h-5 mr-2 text-cyan-400" />
                            Payment Details
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Payment ID:</span>
                                <span className="text-white font-medium">{payment.payment_number}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Description:</span>
                                <span className="text-white font-medium">{payment.description}</span>
                            </div>
                            <div className="border-t border-white/10 pt-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-lg">Amount to Pay:</span>
                                    <span className="text-cyan-400 text-2xl font-bold">
                                        {payment.currency} {payment.amount.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="bg-white/5 rounded-xl p-5 mb-6 border border-white/10">
                        <h3 className="text-lg font-semibold text-white mb-4">Terms and Conditions</h3>
                        <div className="space-y-3 text-sm text-gray-300 max-h-60 overflow-y-auto custom-scrollbar">
                            <div>
                                <h4 className="font-semibold text-white mb-2">1. Payment Authorization</h4>
                                <p className="text-gray-400">
                                    By clicking "Accept & Verify", you authorize the payment of the specified amount 
                                    for the services/products described. This payment is non-refundable unless 
                                    otherwise specified in the service agreement.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-white mb-2">2. Payment Processing</h4>
                                <p className="text-gray-400">
                                    Your payment will be processed through a secure payment gateway. All transactions 
                                    are encrypted and secure. You will be redirected to the payment gateway to complete 
                                    the transaction.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-white mb-2">3. Transaction Security</h4>
                                <p className="text-gray-400">
                                    We use industry-standard SSL encryption to protect your payment information. 
                                    Your card details are never stored on our servers and are processed directly 
                                    by our payment partners.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-white mb-2">4. Service Delivery</h4>
                                <p className="text-gray-400">
                                    Upon successful payment, you will receive a confirmation email with transaction 
                                    details and receipt. Services will be delivered as per the agreed timeline.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-white mb-2">5. Dispute Resolution</h4>
                                <p className="text-gray-400">
                                    In case of any payment disputes or issues, please contact our support team 
                                    within 7 days of the transaction. We will investigate and resolve the matter 
                                    in accordance with our refund policy.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-white mb-2">6. Privacy Policy</h4>
                                <p className="text-gray-400">
                                    Your personal and payment information will be handled in accordance with our 
                                    privacy policy. We do not share your information with third parties except as 
                                    required for payment processing.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-white mb-2">7. Acknowledgment</h4>
                                <p className="text-gray-400">
                                    By proceeding with this payment, you acknowledge that you have read, understood, 
                                    and agree to be bound by these terms and conditions.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Agreement Checkbox */}
                    <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 mb-6">
                        <label className="flex items-start cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={agreedToTerms}
                                onChange={(e) => setAgreedToTerms(e.target.checked)}
                                className="mt-1 w-5 h-5 rounded border-2 border-cyan-500 bg-transparent checked:bg-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-offset-0 cursor-pointer"
                            />
                            <span className="ml-3 text-white group-hover:text-cyan-400 transition-colors">
                                I have read and agree to the terms and conditions, and I authorize this payment
                            </span>
                        </label>
                    </div>

                    {/* Important Notice */}
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
                        <p className="text-yellow-400 text-sm">
                            <strong>Important:</strong> Once you accept and proceed to payment, you will be redirected 
                            to our secure payment gateway. Please complete the payment process there.
                        </p>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="bg-white/5 border-t border-white/10 p-6 flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        disabled={isProcessing}
                        className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleAccept}
                        disabled={!agreedToTerms || isProcessing}
                        className={`px-8 py-3 rounded-lg font-medium transition-all shadow-lg flex items-center space-x-2 ${
                            agreedToTerms && !isProcessing
                                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-cyan-500/30'
                                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                        {isProcessing ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Processing...</span>
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-5 h-5" />
                                <span>Accept & Verify</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(6, 182, 212, 0.5);
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(6, 182, 212, 0.7);
                }
            `}</style>
        </div>
    );
}
