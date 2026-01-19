import { useUser } from '@clerk/clerk-react';
import { useEffect, useRef } from 'react';
import { syncUserToSupabase } from '../utils/userSync';

export default function AuthSync({ children }: { children: React.ReactNode }) {
    const { user, isSignedIn, isLoaded } = useUser();
    const syncAttempted = useRef(false);

    useEffect(() => {
        async function syncUser() {
            if (isLoaded && isSignedIn && user && !syncAttempted.current) {
                syncAttempted.current = true;

                // Sync in background without blocking the app
                try {
                    console.log('🚀 AuthSync: Starting background sync for user:', user.id);
                    await syncUserToSupabase({
                        id: user.id,
                        emailAddresses: user.emailAddresses.map((e) => ({
                            emailAddress: e.emailAddress,
                        })),
                        firstName: user.firstName || undefined,
                        lastName: user.lastName || undefined,
                        phoneNumbers: user.phoneNumbers?.map((p) => ({
                            phoneNumber: p.phoneNumber,
                        })),
                    });
                    console.log('✅ AuthSync: User synced successfully');
                } catch (error) {
                    console.error('❌ AuthSync: Failed to sync user:', error);
                    console.error('⚠️ The app will continue to load, but payment features may not work.');
                    console.error('💡 Solution: Run the SQL fix from supabase-rls-fix.sql in your Supabase dashboard');
                }
            }
        }

        syncUser();
    }, [isLoaded, isSignedIn, user]);

    // Always render children - sync happens in background
    return <>{children}</>;
}
