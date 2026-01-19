import { AlertCircle, CheckCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function SyncStatusBanner() {
    const [show, setShow] = useState(false);
    const [status, setStatus] = useState<'syncing' | 'success' | 'error' | null>(null);

    useEffect(() => {
        // Listen for sync status events
        const handleSyncStart = () => {
            setStatus('syncing');
            setShow(true);
        };

        const handleSyncSuccess = () => {
            setStatus('success');
            setShow(true);
            // Auto-hide success message after 3 seconds
            setTimeout(() => setShow(false), 3000);
        };

        const handleSyncError = () => {
            setStatus('error');
            setShow(true);
            // Keep error message visible
        };

        window.addEventListener('sync:start', handleSyncStart);
        window.addEventListener('sync:success', handleSyncSuccess);
        window.addEventListener('sync:error', handleSyncError);

        return () => {
            window.removeEventListener('sync:start', handleSyncStart);
            window.removeEventListener('sync:success', handleSyncSuccess);
            window.removeEventListener('sync:error', handleSyncError);
        };
    }, []);

    if (!show) return null;

    return (
        <div
            className={`fixed top-20 right-4 z-50 max-w-md rounded-lg shadow-lg p-4 ${status === 'error'
                    ? 'bg-red-900/90 border border-red-500'
                    : status === 'success'
                        ? 'bg-green-900/90 border border-green-500'
                        : 'bg-blue-900/90 border border-blue-500'
                } backdrop-blur-sm`}
        >
            <div className="flex items-start gap-3">
                {status === 'error' ? (
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                ) : status === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                ) : (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-400 border-t-transparent flex-shrink-0 mt-0.5" />
                )}

                <div className="flex-1">
                    <p className="text-white font-semibold text-sm">
                        {status === 'error'
                            ? 'Account Sync Failed'
                            : status === 'success'
                                ? 'Account Synced!'
                                : 'Syncing Account...'}
                    </p>
                    {status === 'error' && (
                        <p className="text-gray-300 text-xs mt-1">
                            Payment features may not work. Please run the database fix from{' '}
                            <code className="bg-red-800/50 px-1 rounded">supabase-rls-fix.sql</code>
                        </p>
                    )}
                </div>

                <button
                    onClick={() => setShow(false)}
                    className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
