import {
    AlertCircle,
    Ban,
    CheckCircle,
    Clock,
    Edit,
    Eye,
    Loader2,
    Plus,
    Search,
    XCircle
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CreatePaymentRequest, PaymentWithTransaction } from '../types/payment';
import {
    adminApprovePayment,
    adminRejectPayment,
    cancelPaymentRequest,
    createPaymentRequest,
    getAllPaymentRequests,
    getPaymentHistory
} from '../utils/paymentApi';
import { formatCurrency } from '../utils/paymentGateway';

interface Props {
    currentUser: { id: string; email: string; is_admin: boolean };
}

export default function AdminPaymentManager({ currentUser }: Props) {
    const [payments, setPayments] = useState<PaymentWithTransaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<PaymentWithTransaction | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [paymentHistory, setPaymentHistory] = useState<Array<{ action: string; created_at: string }>>([]);

    useEffect(() => {
        fetchPayments();
    }, [fetchPayments]);

    const fetchPayments = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getAllPaymentRequests();
            setPayments(data);
        } catch (error) {
            console.error('Error fetching payments:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleCreatePayment = useCallback(async (data: CreatePaymentRequest) => {
        try {
            await createPaymentRequest(data, currentUser.id);
            await fetchPayments();
            setShowCreateModal(false);
        } catch (error) {
            console.error('Error creating payment:', error);
            alert('Failed to create payment');
        }
    }, [currentUser.id, fetchPayments]);

    const handleApprove = useCallback(async (payment: PaymentWithTransaction, updates?: Record<string, unknown>) => {
        try {
            await adminApprovePayment(payment.id, currentUser.id, updates);
            await fetchPayments();
            setShowDetailsModal(false);
        } catch (error) {
            console.error('Error approving payment:', error);
            alert('Failed to approve payment');
        }
    }, [currentUser.id, fetchPayments]);

    const handleReject = useCallback(async (paymentId: string, reason: string) => {
        try {
            await adminRejectPayment(paymentId, currentUser.id, reason);
            await fetchPayments();
            setShowDetailsModal(false);
        } catch (error) {
            console.error('Error rejecting payment:', error);
            alert('Failed to reject payment');
        }
    }, [currentUser.id, fetchPayments]);

    const handleCancel = useCallback(async (paymentId: string) => {
        const reason = prompt('Enter reason for cancellation (optional):');
        if (reason === null) return; // User clicked cancel

        try {
            await cancelPaymentRequest(paymentId, currentUser.id, reason || undefined);
            await fetchPayments();
            setShowDetailsModal(false);
        } catch (error) {
            console.error('Error cancelling payment:', error);
            alert('Failed to cancel payment');
        }
    }, [currentUser.id, fetchPayments]);

    const showPaymentDetails = useCallback(async (payment: PaymentWithTransaction) => {
        setSelectedPayment(payment);
        const history = await getPaymentHistory(payment.id);
        setPaymentHistory(history);
        setShowDetailsModal(true);
    }, []);

    const filteredPayments = useMemo(() => payments.filter((payment) => {
        const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
        const matchesSearch =
            searchQuery === '' ||
            payment.payment_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
            payment.client_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            payment.client_name?.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesStatus && matchesSearch;
    }), [payments, filterStatus, searchQuery]);

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
            case 'admin_rejected':
            case 'failed':
                return 'bg-red-500/20 text-red-400';
            default:
                return 'bg-gray-500/20 text-gray-400';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all"
                >
                    <Plus className="w-5 h-5" />
                    <span>Create Payment</span>
                </button>

                <div className="flex gap-4 w-full sm:w-auto">
                    {/* Search */}
                    <div className="relative flex-1 sm:flex-initial">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search payments..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                        />
                    </div>

                    {/* Filter */}
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    >
                        <option value="all">All Status</option>
                        <option value="pending_client_review">Pending Review</option>
                        <option value="client_submitted">Client Submitted</option>
                        <option value="admin_approved">Approved</option>
                        <option value="payment_pending">Payment Pending</option>
                        <option value="completed">Completed</option>
                        <option value="admin_rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Payments Table */}
            <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-white/5">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Payment #</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Client</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Amount</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Date</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {filteredPayments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="text-purple-400 font-mono text-sm">{payment.payment_number}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="text-white font-medium">{payment.client_name || 'N/A'}</p>
                                            <p className="text-gray-400 text-sm">{payment.client_email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-white font-semibold">
                                            {formatCurrency(payment.amount, payment.currency)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(payment.status)}`}>
                                            {payment.status.replace(/_/g, ' ').toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 text-sm">
                                        {new Date(payment.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => showPaymentDetails(payment)}
                                                className="p-2 text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            {/* Cancel button for active payments */}
                                            {(payment.status === 'pending_client_review' ||
                                                payment.status === 'client_submitted' ||
                                                payment.status === 'payment_pending') && (
                                                    <button
                                                        onClick={() => handleCancel(payment.id)}
                                                        className="p-2 text-orange-400 hover:bg-orange-500/10 rounded-lg transition-colors"
                                                        title="Cancel Payment"
                                                    >
                                                        <Ban className="w-4 h-4" />
                                                    </button>
                                                )}
                                            {payment.status === 'client_submitted' && (
                                                <>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedPayment(payment);
                                                            setShowDetailsModal(true);
                                                        }}
                                                        className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                                                        title="Approve"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            const reason = prompt('Enter rejection reason:');
                                                            if (reason) handleReject(payment.id, reason);
                                                        }}
                                                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                        title="Reject"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredPayments.length === 0 && (
                        <div className="text-center py-12">
                            <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                            <p className="text-gray-400">No payments found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Payment Modal */}
            {showCreateModal && (
                <CreatePaymentModal
                    onClose={() => setShowCreateModal(false)}
                    onSubmit={handleCreatePayment}
                />
            )}

            {/* Payment Details Modal */}
            {showDetailsModal && selectedPayment && (
                <PaymentDetailsModal
                    payment={selectedPayment}
                    history={paymentHistory}
                    onClose={() => {
                        setShowDetailsModal(false);
                        setSelectedPayment(null);
                    }}
                    onApprove={handleApprove}
                    onReject={handleReject}
                />
            )}
        </div>
    );
}

// Create Payment Modal Component
function CreatePaymentModal({
    onClose,
    onSubmit,
}: {
    onClose: () => void;
    onSubmit: (data: CreatePaymentRequest) => void;
}) {
    const [formData, setFormData] = useState<CreatePaymentRequest>({
        client_email: '',
        client_phone: '',
        client_name: '',
        amount: 0,
        currency: 'INR',
        description: '',
        remarks: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
                <div className="p-6 border-b border-white/10">
                    <h2 className="text-2xl font-bold text-white">Create Payment Request</h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Client Email <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="email"
                                required
                                value={formData.client_email}
                                onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Client Phone</label>
                            <input
                                type="tel"
                                value={formData.client_phone}
                                onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Client Name</label>
                        <input
                            type="text"
                            value={formData.client_name}
                            onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Amount <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                step="0.01"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Currency</label>
                            <select
                                value={formData.currency}
                                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            >
                                <option value="INR">INR (₹)</option>
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Description <span className="text-red-400">*</span>
                        </label>
                        <textarea
                            required
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            placeholder="What is this payment for?"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Remarks (Optional)</label>
                        <textarea
                            rows={2}
                            value={formData.remarks}
                            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            placeholder="Additional notes..."
                        />
                    </div>

                    <div className="flex space-x-4 pt-4">
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all"
                        >
                            Create Payment
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Payment Details Modal Component
function PaymentDetailsModal({
    payment,
    history,
    onClose,
    onApprove,
    onReject,
}: {
    payment: PaymentWithTransaction;
    history: any[];
    onClose: () => void;
    onApprove: (payment: PaymentWithTransaction, updates?: any) => void;
    onReject: (paymentId: string, reason: string) => void;
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedAmount, setEditedAmount] = useState(payment.amount);
    const [editedDescription, setEditedDescription] = useState(payment.description);
    const [editedRemarks, setEditedRemarks] = useState(payment.remarks || '');

    const handleApprove = () => {
        if (isEditing) {
            onApprove(payment, {
                amount: editedAmount,
                description: editedDescription,
                remarks: editedRemarks,
            });
        } else {
            onApprove(payment);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1">Payment Details</h2>
                        <p className="text-purple-400 font-mono">{payment.payment_number}</p>
                    </div>
                    {payment.status === 'client_submitted' && (
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
                        >
                            <Edit className="w-4 h-4" />
                            <span>{isEditing ? 'Cancel Edit' : 'Edit'}</span>
                        </button>
                    )}
                </div>

                <div className="p-6 space-y-6">
                    {/* Payment Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-gray-400">Client Name</label>
                            <p className="text-white font-medium">{payment.client_name || 'N/A'}</p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-400">Client Email</label>
                            <p className="text-white font-medium">{payment.client_email}</p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-400">Amount</label>
                            {isEditing ? (
                                <input
                                    type="number"
                                    value={editedAmount}
                                    onChange={(e) => setEditedAmount(parseFloat(e.target.value))}
                                    className="w-full px-3 py-1 bg-white/5 border border-white/10 rounded text-white"
                                />
                            ) : (
                                <p className="text-cyan-400 font-bold text-xl">
                                    {formatCurrency(payment.amount, payment.currency)}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="text-sm text-gray-400">Status</label>
                            <p className="text-white font-medium">{payment.status.replace(/_/g, ' ')}</p>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-sm text-gray-400">Description</label>
                        {isEditing ? (
                            <textarea
                                value={editedDescription}
                                onChange={(e) => setEditedDescription(e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white mt-1"
                            />
                        ) : (
                            <p className="text-white mt-1">{payment.description}</p>
                        )}
                    </div>

                    {/* Remarks */}
                    <div>
                        <label className="text-sm text-gray-400">Remarks</label>
                        {isEditing ? (
                            <textarea
                                value={editedRemarks}
                                onChange={(e) => setEditedRemarks(e.target.value)}
                                rows={2}
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white mt-1"
                            />
                        ) : (
                            <p className="text-white mt-1">{payment.remarks || 'No remarks'}</p>
                        )}
                    </div>

                    {/* History */}
                    {history.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-3">Activity History</h3>
                            <div className="space-y-2">
                                {history.map((item, index) => (
                                    <div key={index} className="flex items-start space-x-3 text-sm">
                                        <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-white">{item.action.replace(/_/g, ' ')}</p>
                                            <p className="text-gray-500 text-xs">
                                                {new Date(item.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    {payment.status === 'client_submitted' && (
                        <div className="flex space-x-4 pt-4 border-t border-white/10">
                            <button
                                onClick={handleApprove}
                                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-medium transition-all"
                            >
                                <CheckCircle className="w-5 h-5" />
                                <span>Approve{isEditing && ' with Changes'}</span>
                            </button>
                            <button
                                onClick={() => {
                                    const reason = prompt('Enter rejection reason:');
                                    if (reason) onReject(payment.id, reason);
                                }}
                                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white rounded-lg font-medium transition-all"
                            >
                                <XCircle className="w-5 h-5" />
                                <span>Reject</span>
                            </button>
                        </div>
                    )}

                    <button
                        onClick={onClose}
                        className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-all"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
