// Clerk to Supabase User Sync Utility
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase credentials. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
    console.warn('Supabase features will be disabled until credentials are provided.');
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key'
);

/**
 * Sync user from Clerk to Supabase
 * Call this function after user signs in with Clerk
 */
export async function syncUserToSupabase(clerkUser: {
    id: string;
    emailAddresses: Array<{ emailAddress: string }>;
    firstName?: string;
    lastName?: string;
    phoneNumbers?: Array<{ phoneNumber: string }>;
}) {
    try {
        console.log('🔄 Starting user sync for:', clerkUser.id);

        const email = clerkUser.emailAddresses[0]?.emailAddress;
        if (!email) {
            console.error('❌ No email address found for user');
            throw new Error('No email address found for user');
        }

        console.log('📧 Email:', email);
        const phone = clerkUser.phoneNumbers?.[0]?.phoneNumber;
        const isAdmin = email === 'someshranjanbiswal13678@gmail.com';

        // First, check if user exists by email (primary check)
        console.log('🔍 Checking if user exists by email...');
        const { data: userByEmail, error: emailError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .maybeSingle();

        if (emailError && emailError.code !== 'PGRST116') {
            console.error('❌ Error fetching user by email:', emailError);
            // If RLS is blocking, try to continue anyway
            if (emailError.code !== 'PGRST301' && emailError.code !== '406') {
                throw emailError;
            }
        }

        if (userByEmail) {
            console.log('✏️ User exists with this email, updating clerk_id...');
            // User exists but might have wrong clerk_id - update it
            const { data, error } = await supabase
                .from('users')
                .update({
                    clerk_id: clerkUser.id,
                    first_name: clerkUser.firstName,
                    last_name: clerkUser.lastName,
                    phone_number: phone,
                    is_admin: isAdmin || userByEmail.is_admin,
                    updated_at: new Date().toISOString(),
                })
                .eq('email', email)
                .select()
                .single();

            if (error) {
                console.error('❌ Error updating user:', error);
                // If RLS is blocking update, return existing user
                if (error.code === 'PGRST301' || error.code === '42501') {
                    console.warn('⚠️ RLS blocking update, but user exists');
                    return userByEmail;
                }
                throw error;
            }
            console.log('✅ User updated successfully:', data);
            return data;
        }

        // Check by clerk_id as fallback
        console.log('🔍 Checking if user exists by clerk_id...');
        const { data: userByClerkId, error: clerkError } = await supabase
            .from('users')
            .select('*')
            .eq('clerk_id', clerkUser.id)
            .maybeSingle();

        if (clerkError && clerkError.code !== 'PGRST116') {
            console.error('❌ Error fetching user by clerk_id:', clerkError);
        }

        if (userByClerkId) {
            console.log('✏️ User exists, updating...');
            const { data, error } = await supabase
                .from('users')
                .update({
                    email,
                    first_name: clerkUser.firstName,
                    last_name: clerkUser.lastName,
                    phone_number: phone,
                    is_admin: isAdmin || userByClerkId.is_admin,
                    updated_at: new Date().toISOString(),
                })
                .eq('clerk_id', clerkUser.id)
                .select()
                .single();

            if (error) {
                console.error('❌ Error updating user:', error);
                if (error.code === 'PGRST301' || error.code === '42501') {
                    return userByClerkId;
                }
                throw error;
            }
            console.log('✅ User updated successfully:', data);
            return data;
        }

        console.log('➕ User does not exist, creating...');
        // Create new user
        const { data, error } = await supabase
            .from('users')
            .insert({
                clerk_id: clerkUser.id,
                email,
                first_name: clerkUser.firstName,
                last_name: clerkUser.lastName,
                phone_number: phone,
                is_admin: isAdmin,
            })
            .select()
            .single();

        if (error) {
            console.error('❌ Error creating user:', error);
            console.error('Error code:', error.code);
            console.error('Error message:', error.message);

            // If it's a duplicate email error, the user was just created by another process
            if (error.code === '23505') {
                console.log('⚠️ User was just created, fetching...');
                const { data: fetchedUser } = await supabase
                    .from('users')
                    .select('*')
                    .eq('email', email)
                    .single();
                if (fetchedUser) {
                    console.log('✅ Fetched existing user:', fetchedUser);
                    return fetchedUser;
                }
            }

            throw error;
        }
        console.log('✅ User created successfully:', data);
        return data;
    } catch (error) {
        console.error('Error syncing user to Supabase:', error);
        throw error;
    }
}

/**
 * Get current user from Supabase by Clerk ID
 */
export async function getCurrentUser(clerkId: string) {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('clerk_id', clerkId)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching current user:', error);
        return null;
    }
}

/**
 * Check if user is admin
 */
export async function isUserAdmin(clerkId: string): Promise<boolean> {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('is_admin')
            .eq('clerk_id', clerkId)
            .single();

        if (error) throw error;
        return data?.is_admin || false;
    } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
    }
}

/**
 * Get user by email or phone
 */
export async function getUserByEmailOrPhone(
    email?: string,
    phone?: string
) {
    try {
        let query = supabase.from('users').select('*');

        if (email && phone) {
            query = query.or(`email.eq.${email},phone_number.eq.${phone}`);
        } else if (email) {
            query = query.eq('email', email);
        } else if (phone) {
            query = query.eq('phone_number', phone);
        } else {
            return null;
        }

        const { data, error } = await query.single();

        if (error && error.code !== 'PGRST116') {
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Error fetching user by email/phone:', error);
        return null;
    }
}
