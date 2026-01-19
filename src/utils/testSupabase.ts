import { createClient } from '@supabase/supabase-js';

// Test Supabase connection
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;


console.log('🔍 Testing Supabase Connection...');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseAnonKey ? '✓ Present' : '✗ Missing');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
    try {
        // Test 1: Check if users table exists
        console.log('\n📋 Test 1: Checking users table...');
        const { data, error } = await supabase
            .from('users')
            .select('count')
            .limit(1);

        if (error) {
            console.error('❌ Error accessing users table:', error);
            console.error('Error code:', error.code);
            console.error('Error details:', error.details);
            console.error('Error hint:', error.hint);
            console.error('Error message:', error.message);
        } else {
            console.log('✅ Users table exists and is accessible');
        }

        // Test 2: Try to insert a test user
        console.log('\n📋 Test 2: Testing user insert...');
        const testUser = {
            clerk_id: 'test_' + Date.now(),
            email: 'test_' + Date.now() + '@example.com',
            first_name: 'Test',
            last_name: 'User'
        };

        const { data: insertData, error: insertError } = await supabase
            .from('users')
            .insert(testUser)
            .select()
            .single();

        if (insertError) {
            console.error('❌ Error inserting user:', insertError);
            console.error('Error code:', insertError.code);
            console.error('Error message:', insertError.message);

            if (insertError.code === '42501') {
                console.error('\n🔒 RLS POLICY ISSUE DETECTED!');
                console.error('The Row Level Security policy is blocking inserts.');
                console.error('\n💡 SOLUTION: Run this SQL in Supabase:');
                console.error('ALTER TABLE users DISABLE ROW LEVEL SECURITY;');
            }
        } else {
            console.log('✅ User inserted successfully:', insertData);

            // Clean up test user
            await supabase
                .from('users')
                .delete()
                .eq('clerk_id', testUser.clerk_id);
            console.log('✅ Test user cleaned up');
        }

        // Test 3: Check RLS status
        console.log('\n📋 Test 3: Checking RLS policies...');
        const { data: policies, error: policyError } = await supabase
            .rpc('pg_policies', {});

        if (policyError) {
            console.log('⚠️ Could not check RLS policies (this is normal)');
        }

    } catch (err) {
        console.error('❌ Unexpected error:', err);
    }
}

// Run test when this file is imported
testConnection();

export { testConnection };
