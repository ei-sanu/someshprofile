import { useUser } from '@clerk/clerk-react';
import { AlertCircle, Loader2, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from '../components/AdminDashboard';
import AdminPaymentManager from '../components/AdminPaymentManager';
import { isUserAdmin, syncUserToSupabase } from '../utils/userSync';

export default function AdminPanel() {
    const { user } = useUser();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [activeTab, setActiveTab] = useState<'dashboard' | 'payments'>('dashboard');
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }

        checkAdminAccess();
    }, [user]);

    async function checkAdminAccess() {
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

            // Check admin status
            const adminStatus = await isUserAdmin(user!.id);

            if (!adminStatus) {
                navigate('/');
                return;
            }

            setIsAdmin(true);
        } catch (error) {
            console.error('Error checking admin access:', error);
            navigate('/');
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
                    <p className="text-gray-300">Verifying admin access...</p>
                </div>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <h2 className="text-2xl text-white font-bold mb-2">Access Denied</h2>
                    <p className="text-gray-400">You don't have permission to access this page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 py-20 px-4">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-3 mb-2">
                        <Shield className="w-8 h-8 text-purple-400" />
                        <h1 className="text-4xl md:text-5xl font-bold">
                            <span className="bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
                                Admin Panel
                            </span>
                        </h1>
                    </div>
                    <p className="text-gray-400 text-lg">
                        Manage payments, verify transactions, and monitor earnings
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex space-x-4 mb-8 border-b border-white/10">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`px-6 py-3 font-medium transition-all border-b-2 ${activeTab === 'dashboard'
                                ? 'border-purple-500 text-purple-400'
                                : 'border-transparent text-gray-400 hover:text-white'
                            }`}
                    >
                        Dashboard
                    </button>
                    <button
                        onClick={() => setActiveTab('payments')}
                        className={`px-6 py-3 font-medium transition-all border-b-2 ${activeTab === 'payments'
                                ? 'border-purple-500 text-purple-400'
                                : 'border-transparent text-gray-400 hover:text-white'
                            }`}
                    >
                        Payment Management
                    </button>
                </div>

                {/* Content */}
                {activeTab === 'dashboard' ? (
                    <AdminDashboard />
                ) : (
                    <AdminPaymentManager currentUser={currentUser} />
                )}
            </div>
        </div>
    );
}
