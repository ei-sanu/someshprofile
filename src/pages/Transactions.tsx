import { useUser } from '@clerk/clerk-react';
import { ArrowDownLeft, ArrowUpRight, CheckCircle, Clock, CreditCard, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getUserPaymentRequests } from '../utils/paymentApi';
import { formatCurrency } from '../utils/paymentGateway';

interface Transaction {
    id: string;
    payment_number: string;
    amount: number;
    currency: string;
    description: string;
    status: string;
    created_at: string;
    updated_at: string;
    payu_transaction_id?: string;
}

export default function Transactions() {
    const { user } = useUser();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'completed' | 'failed' | 'pending'>('all');

    useEffect(() => {
        if (user) {
            loadTransactions();
        }
    }, [user]);

    async function loadTransactions() {
        try {
            setLoading(true);
            const email = user?.emailAddresses[0]?.emailAddress || '';
            const phone = user?.phoneNumbers?.[0]?.phoneNumber || '';
            const userId = user?.id || '';

            console.log('📊 Loading transactions for:', { email, phone, userId });

            const payments = await getUserPaymentRequests(email, phone, userId);
            console.log('📦 Loaded transactions:', payments);

            setTransactions(payments || []);
        } catch (error) {
            console.error('Error loading transactions:', error);
        } finally {
            setLoading(false);
        }
    }

    const filteredTransactions = transactions.filter(t => {
        if (filter === 'all') return true;
        return t.status === filter;
    });

    const getStatusIcon = (status: string) => {
        switch (status) {
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'text-green-400 bg-green-400/10';
            case 'failed':
                return 'text-red-400 bg-red-400/10';
            case 'payment_pending':
                return 'text-yellow-400 bg-yellow-400/10';
            default:
                return 'text-gray-400 bg-gray-400/10';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'completed':
                return 'Completed';
            case 'failed':
                return 'Failed';
            case 'payment_pending':
                return 'Pending';
            case 'pending_client_review':
                return 'Review Pending';
            default:
                return status;
        }
    };

    const stats = {
        total: transactions.length,
        completed: transactions.filter(t => t.status === 'completed').length,
        pending: transactions.filter(t => t.status === 'payment_pending').length,
        failed: transactions.filter(t => t.status === 'failed').length,
        totalAmount: transactions
            .filter(t => t.status === 'completed')
            .reduce((sum, t) => sum + t.amount, 0),
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900 pt-20 pb-16 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Transaction History</h1>
                    <p className="text-gray-400">View all your payment transactions</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-400 text-sm">Total Transactions</span>
                            <CreditCard className="w-5 h-5 text-cyan-400" />
                        </div>
                        <p className="text-3xl font-bold text-white">{stats.total}</p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-400 text-sm">Completed</span>
                            <CheckCircle className="w-5 h-5 text-green-400" />
                        </div>
                        <p className="text-3xl font-bold text-green-400">{stats.completed}</p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-400 text-sm">Pending</span>
                            <Clock className="w-5 h-5 text-yellow-400" />
                        </div>
                        <p className="text-3xl font-bold text-yellow-400">{stats.pending}</p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-400 text-sm">Total Paid</span>
                            <ArrowUpRight className="w-5 h-5 text-cyan-400" />
                        </div>
                        <p className="text-3xl font-bold text-white">
                            {formatCurrency(stats.totalAmount, 'INR')}
                        </p>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex space-x-2 mb-6 overflow-x-auto">
                    {[
                        { key: 'all', label: 'All' },
                        { key: 'completed', label: 'Completed' },
                        { key: 'pending', label: 'Pending' },
                        { key: 'failed', label: 'Failed' },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setFilter(tab.key as any)}
                            className={`px-6 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${filter === tab.key
                                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Transactions List */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400" />
                        <p className="text-gray-400 mt-4">Loading transactions...</p>
                    </div>
                ) : filteredTransactions.length === 0 ? (
                    <div className="text-center py-12">
                        <CreditCard className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg">No transactions found</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredTransactions.map((transaction) => (
                            <div
                                key={transaction.id}
                                className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-cyan-500/30 transition-all"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-4 flex-1">
                                        <div className="mt-1">
                                            {getStatusIcon(transaction.status)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h3 className="text-white font-semibold truncate">
                                                    {transaction.description || 'Payment'}
                                                </h3>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                        transaction.status
                                                    )}`}
                                                >
                                                    {getStatusLabel(transaction.status)}
                                                </span>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-gray-400 text-sm">
                                                    Payment ID: {transaction.payment_number}
                                                </p>
                                                <p className="text-gray-400 text-sm">
                                                    Date:{' '}
                                                    {new Date(transaction.created_at).toLocaleString('en-IN', {
                                                        dateStyle: 'medium',
                                                        timeStyle: 'short',
                                                    })}
                                                </p>
                                                {transaction.payu_transaction_id && (
                                                    <p className="text-gray-400 text-sm font-mono">
                                                        Txn: {transaction.payu_transaction_id}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right ml-4">
                                        <p className="text-2xl font-bold text-white">
                                            {formatCurrency(transaction.amount, transaction.currency)}
                                        </p>
                                        {transaction.status === 'completed' && (
                                            <div className="flex items-center justify-end text-green-400 text-sm mt-1">
                                                <ArrowDownLeft className="w-4 h-4 mr-1" />
                                                <span>Paid</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
