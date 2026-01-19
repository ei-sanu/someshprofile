-- Supabase Database Schema for Payment System
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (synced from Clerk)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    clerk_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone_number VARCHAR(20),
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Payment requests table
CREATE TABLE IF NOT EXISTS payment_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    payment_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES users (id) ON DELETE CASCADE,
    created_by_admin_id UUID REFERENCES users (id),
    client_email VARCHAR(255) NOT NULL,
    client_phone VARCHAR(20),
    client_name VARCHAR(200),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    description TEXT NOT NULL,
    remarks TEXT,
    status VARCHAR(50) DEFAULT 'pending_client_review',
    -- Status flow: pending_client_review -> payment_pending -> completed/failed/cancelled
    -- Client accepts payment directly, no admin approval needed
    -- Admin can cancel at any time before completion
    admin_approved BOOLEAN DEFAULT FALSE,
    admin_approval_date TIMESTAMP
    WITH
        TIME ZONE,
        client_accepted BOOLEAN DEFAULT FALSE,
        client_acceptance_date TIMESTAMP
    WITH
        TIME ZONE,
        payment_enabled BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    payment_request_id UUID REFERENCES payment_requests (id) ON DELETE CASCADE,
    user_id UUID REFERENCES users (id),
    transaction_id VARCHAR(255) UNIQUE,
    payu_transaction_id VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    status VARCHAR(50) DEFAULT 'initiated',
    -- Status: initiated, processing, success, failed, refunded
    payment_method VARCHAR(50),
    payment_gateway VARCHAR(50) DEFAULT 'payu',
    gateway_response JSONB,
    invoice_url TEXT,
    invoice_number VARCHAR(100),
    error_message TEXT,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Payment history/audit log
CREATE TABLE IF NOT EXISTS payment_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    payment_request_id UUID REFERENCES payment_requests (id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    -- Actions: created, client_viewed, client_submitted, admin_approved, admin_rejected, payment_initiated, payment_completed, payment_failed
    performed_by_user_id UUID REFERENCES users (id),
    old_data JSONB,
    new_data JSONB,
    notes TEXT,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    user_id UUID REFERENCES users (id) ON DELETE CASCADE,
    payment_request_id UUID REFERENCES payment_requests (id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    -- Types: info, success, warning, error, payment_pending, payment_approved
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_users_clerk_id ON users (clerk_id);

CREATE INDEX idx_users_email ON users (email);

CREATE INDEX idx_payment_requests_user_id ON payment_requests (user_id);

CREATE INDEX idx_payment_requests_client_email ON payment_requests (client_email);

CREATE INDEX idx_payment_requests_status ON payment_requests (status);

CREATE INDEX idx_transactions_payment_request_id ON transactions (payment_request_id);

CREATE INDEX idx_transactions_user_id ON transactions (user_id);

CREATE INDEX idx_transactions_status ON transactions (status);

CREATE INDEX idx_notifications_user_id ON notifications (user_id);

CREATE INDEX idx_notifications_is_read ON notifications (is_read);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to auto-update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_requests_updated_at BEFORE UPDATE ON payment_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate unique payment number
CREATE OR REPLACE FUNCTION generate_payment_number()
RETURNS TEXT AS $$
DECLARE
    new_number TEXT;
    counter INT := 0;
BEGIN
    LOOP
        new_number := 'PAY-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
        EXIT WHEN NOT EXISTS (SELECT 1 FROM payment_requests WHERE payment_number = new_number);
        counter := counter + 1;
        IF counter > 100 THEN
            RAISE EXCEPTION 'Could not generate unique payment number';
        END IF;
    END LOOP;
    RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) - DISABLED for easier development
-- To enable RLS with proper policies, see the bottom of this file
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

ALTER TABLE payment_requests DISABLE ROW LEVEL SECURITY;

ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;

ALTER TABLE payment_history DISABLE ROW LEVEL SECURITY;

ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;

-- Note: RLS is disabled to allow the application to work immediately.
-- In production, you should enable RLS and use proper policies or service role keys.
-- The policies below are commented out but can be enabled if needed.

/*
-- OPTIONAL: Uncomment these if you want to enable RLS with policies

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY users_select_own ON users
FOR SELECT USING (clerk_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Admin can read all users
CREATE POLICY users_select_admin ON users
FOR SELECT USING (
EXISTS (
SELECT 1 FROM users
WHERE clerk_id = current_setting('request.jwt.claims', true)::json->>'sub'
AND is_admin = TRUE
)
);

-- Allow users to insert their own records during registration
CREATE POLICY users_insert_self ON users FOR INSERT WITH CHECK (true);

-- Allow users to update their own records
CREATE POLICY users_update_own ON users FOR UPDATE USING (
clerk_id = current_setting('request.jwt.claims', true)::json->>'sub'
);

-- Payment requests policies
CREATE POLICY payment_requests_select_own ON payment_requests
FOR SELECT USING (
user_id IN (SELECT id FROM users WHERE clerk_id = current_setting('request.jwt.claims', true)::json->>'sub')
OR client_email IN (SELECT email FROM users WHERE clerk_id = current_setting('request.jwt.claims', true)::json->>'sub')
);

CREATE POLICY payment_requests_select_admin ON payment_requests
FOR SELECT USING (
EXISTS (
SELECT 1 FROM users
WHERE clerk_id = current_setting('request.jwt.claims', true)::json->>'sub'
AND is_admin = TRUE
)
);

CREATE POLICY payment_requests_insert_admin ON payment_requests FOR INSERT WITH CHECK (
EXISTS (
SELECT 1 FROM users
WHERE clerk_id = current_setting('request.jwt.claims', true)::json->>'sub'
AND is_admin = TRUE
)
);

CREATE POLICY payment_requests_update_admin ON payment_requests FOR UPDATE USING (
EXISTS (
SELECT 1 FROM users
WHERE clerk_id = current_setting('request.jwt.claims', true)::json->>'sub'
AND is_admin = TRUE
)
);

CREATE POLICY payment_requests_update_own ON payment_requests FOR UPDATE USING (
user_id IN (SELECT id FROM users WHERE clerk_id = current_setting('request.jwt.claims', true)::json->>'sub')
OR client_email IN (SELECT email FROM users WHERE clerk_id = current_setting('request.jwt.claims', true)::json->>'sub')
);

-- Transactions policies (users can view their own, admins can view all)
CREATE POLICY transactions_select_own ON transactions
FOR SELECT USING (
user_id IN (SELECT id FROM users WHERE clerk_id = current_setting('request.jwt.claims', true)::json->>'sub')
);

CREATE POLICY transactions_select_admin ON transactions
FOR SELECT USING (
EXISTS (
SELECT 1 FROM users
WHERE clerk_id = current_setting('request.jwt.claims', true)::json->>'sub'
AND is_admin = TRUE
)
);

CREATE POLICY transactions_insert_own ON transactions FOR INSERT WITH CHECK (
user_id IN (SELECT id FROM users WHERE clerk_id = current_setting('request.jwt.claims', true)::json->>'sub')
);

-- Payment history policies
CREATE POLICY payment_history_insert_all ON payment_history FOR INSERT WITH CHECK (true);

CREATE POLICY payment_history_select_own ON payment_history FOR SELECT USING (
performed_by_user_id IN (SELECT id FROM users WHERE clerk_id = current_setting('request.jwt.claims', true)::json->>'sub')
OR payment_request_id IN (
SELECT id FROM payment_requests
WHERE user_id IN (SELECT id FROM users WHERE clerk_id = current_setting('request.jwt.claims', true)::json->>'sub')
OR client_email IN (SELECT email FROM users WHERE clerk_id = current_setting('request.jwt.claims', true)::json->>'sub')
)
);

CREATE POLICY payment_history_select_admin ON payment_history FOR SELECT USING (
EXISTS (
SELECT 1 FROM users
WHERE clerk_id = current_setting('request.jwt.claims', true)::json->>'sub'
AND is_admin = TRUE
)
);

-- Notifications policies
CREATE POLICY notifications_select_own ON notifications
FOR SELECT USING (
user_id IN (SELECT id FROM users WHERE clerk_id = current_setting('request.jwt.claims', true)::json->>'sub')
);

CREATE POLICY notifications_insert_all ON notifications FOR INSERT WITH CHECK (true);

CREATE POLICY notifications_update_own ON notifications FOR UPDATE USING (
user_id IN (SELECT id FROM users WHERE clerk_id = current_setting('request.jwt.claims', true)::json->>'sub')
);
*/

-- Note: Admin user setup
-- After you sign in for the first time with someshranjanbiswal13678@gmail.com,
-- the application will automatically create your user record.
-- No manual INSERT needed!

-- Views for analytics
CREATE OR REPLACE VIEW admin_dashboard_stats AS
SELECT
    COUNT(DISTINCT pr.id) as total_payments,
    COUNT(
        DISTINCT CASE
            WHEN pr.status = 'completed' THEN pr.id
        END
    ) as completed_payments,
    COUNT(
        DISTINCT CASE
            WHEN pr.status = 'pending_client_review' THEN pr.id
        END
    ) as pending_payments,
    COUNT(
        DISTINCT CASE
            WHEN pr.status = 'admin_approved' THEN pr.id
        END
    ) as approved_payments,
    COALESCE(
        SUM(
            CASE
                WHEN t.status = 'success' THEN t.amount
            END
        ),
        0
    ) as total_earnings,
    COALESCE(
        SUM(
            CASE
                WHEN t.status = 'success'
                AND t.created_at >= CURRENT_DATE - INTERVAL '30 days' THEN t.amount
            END
        ),
        0
    ) as monthly_earnings,
    COUNT(
        DISTINCT CASE
            WHEN t.status = 'success' THEN t.id
        END
    ) as successful_transactions,
    COUNT(
        DISTINCT CASE
            WHEN t.status = 'failed' THEN t.id
        END
    ) as failed_transactions
FROM
    payment_requests pr
    LEFT JOIN transactions t ON pr.id = t.payment_request_id;

-- View for monthly earnings chart
CREATE OR REPLACE VIEW monthly_earnings_chart AS
SELECT
    DATE_TRUNC ('month', t.created_at) as month,
    COALESCE(SUM(t.amount), 0) as earnings,
    COUNT(t.id) as transaction_count
FROM transactions t
WHERE
    t.status = 'success'
    AND t.created_at >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY
    DATE_TRUNC ('month', t.created_at)
ORDER BY month DESC;
