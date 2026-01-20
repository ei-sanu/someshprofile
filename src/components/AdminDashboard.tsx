import {
    Activity,
    CheckCircle,
    Clock,
    DollarSign,
    Loader2,
    TrendingUp,
    Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import type { DashboardStats, MonthlyEarnings } from '../types/payment';
import { getDashboardStats, getMonthlyEarnings, getPreviousMonthStats } from '../utils/paymentApi';
import { formatCurrency } from '../utils/paymentGateway';

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [monthlyData, setMonthlyData] = useState<MonthlyEarnings[]>([]);
    const [prevMonthStats, setPrevMonthStats] = useState<{ total_earnings: number; monthly_earnings: number } | null>(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    async function fetchDashboardData() {
        try {
            setLoading(true);
            const [statsData, monthlyEarningsData, prevStats] = await Promise.all([
                getDashboardStats(),
                getMonthlyEarnings(),
                getPreviousMonthStats(),
            ]);

            setStats(statsData);
            setMonthlyData(monthlyEarningsData);
            setPrevMonthStats(prevStats);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="text-center py-20">
                <p className="text-gray-400">Failed to load dashboard data</p>
            </div>
        );
    }

    // Calculate percentage changes
    const calculatePercentageChange = (current: number, previous: number): string => {
        if (previous === 0) {
            return current > 0 ? '+100%' : '0%';
        }
        const change = ((current - previous) / previous) * 100;
        return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
    };

    const totalEarningsChange = prevMonthStats 
        ? calculatePercentageChange(stats.total_earnings, prevMonthStats.total_earnings)
        : '+0%';
    
    const monthlyEarningsChange = prevMonthStats
        ? calculatePercentageChange(stats.monthly_earnings, prevMonthStats.monthly_earnings)
        : '+0%';

    const statCards = [
        {
            title: 'Total Earnings',
            value: formatCurrency(stats.total_earnings || 0, 'INR'),
            icon: DollarSign,
            color: 'from-green-500 to-emerald-500',
            change: totalEarningsChange,
        },
        {
            title: 'Monthly Earnings',
            value: formatCurrency(stats.monthly_earnings || 0, 'INR'),
            icon: TrendingUp,
            color: 'from-blue-500 to-cyan-500',
            change: monthlyEarningsChange,
        },
        {
            title: 'Completed Payments',
            value: (stats.completed_payments || 0).toString(),
            icon: CheckCircle,
            color: 'from-purple-500 to-pink-500',
            subtext: `of ${stats.total_payments || 0} total`,
        },
        {
            title: 'Pending Approvals',
            value: (stats.pending_payments || 0).toString(),
            icon: Clock,
            color: 'from-yellow-500 to-orange-500',
            subtext: 'requires action',
        },
    ];

    // Format monthly data for charts
    const chartData = monthlyData.map((item) => ({
        month: new Date(item.month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        earnings: item.earnings,
        transactions: item.transaction_count,
    }));

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-purple-500/50 transition-all"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div
                                className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                            >
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                            {stat.change && (
                                <span className={`text-sm font-medium ${
                                    stat.change.startsWith('+') ? 'text-green-400' : 
                                    stat.change.startsWith('-') ? 'text-red-400' : 
                                    'text-gray-400'
                                }`}>{stat.change}</span>
                            )}
                        </div>
                        <h3 className="text-gray-400 text-sm mb-1">{stat.title}</h3>
                        <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                        {stat.subtext && <p className="text-gray-500 text-xs">{stat.subtext}</p>}
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Earnings Chart */}
                <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-white">Monthly Earnings</h3>
                        <Activity className="w-5 h-5 text-purple-400" />
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis
                                dataKey="month"
                                stroke="#9CA3AF"
                                style={{ fontSize: '12px' }}
                            />
                            <YAxis
                                stroke="#9CA3AF"
                                style={{ fontSize: '12px' }}
                                tickFormatter={(value) => `₹${value}`}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1F2937',
                                    border: '1px solid #374151',
                                    borderRadius: '8px',
                                }}
                                labelStyle={{ color: '#F3F4F6' }}
                                formatter={(value: number) => [`₹${value}`, 'Earnings']}
                            />
                            <Line
                                type="monotone"
                                dataKey="earnings"
                                stroke="#A855F7"
                                strokeWidth={3}
                                dot={{ fill: '#A855F7', r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Transactions Chart */}
                <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-white">Transaction Volume</h3>
                        <Users className="w-5 h-5 text-cyan-400" />
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis
                                dataKey="month"
                                stroke="#9CA3AF"
                                style={{ fontSize: '12px' }}
                            />
                            <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1F2937',
                                    border: '1px solid #374151',
                                    borderRadius: '8px',
                                }}
                                labelStyle={{ color: '#F3F4F6' }}
                                formatter={(value: number) => [value, 'Transactions']}
                            />
                            <Bar dataKey="transactions" fill="#06B6D4" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Success Rate */}
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6">Transaction Success Rate</h3>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-400">Successful Transactions</span>
                            <span className="text-green-400 font-medium">
                                {stats.successful_transactions || 0} / {(stats.successful_transactions || 0) + (stats.failed_transactions || 0)}
                            </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-3">
                            <div
                                className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
                                style={{
                                    width: `${((stats.successful_transactions || 0) /
                                            ((stats.successful_transactions || 0) + (stats.failed_transactions || 0) || 1)) *
                                        100
                                        }%`,
                                }}
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-400">Failed Transactions</span>
                            <span className="text-red-400 font-medium">{stats.failed_transactions || 0}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-3">
                            <div
                                className="bg-gradient-to-r from-red-500 to-orange-500 h-3 rounded-full transition-all duration-500"
                                style={{
                                    width: `${((stats.failed_transactions || 0) /
                                            ((stats.successful_transactions || 0) + (stats.failed_transactions || 0) || 1)) *
                                        100
                                        }%`,
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
