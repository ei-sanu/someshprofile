# 🚀 Quick Start Guide

## Get Your Payment System Running in 15 Minutes!

### Step 1: Install Dependencies (1 min)
```bash
npm install
```

### Step 2: Set Up Supabase (5 min)

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be ready
3. Go to SQL Editor
4. Copy-paste everything from `supabase-schema.sql`
5. Click "Run" to execute
6. Go to Settings → API and copy:
   - Project URL
   - anon/public key

### Step 3: Set Up Clerk (3 min)

1. Go to [clerk.com](https://clerk.com) and create an account
2. Create a new application
3. Go to API Keys
4. Copy the Publishable Key

### Step 4: Configure Environment (2 min)

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your keys:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   VITE_PAYU_MERCHANT_KEY=your_payu_key
   VITE_PAYU_MERCHANT_SALT=your_payu_salt
   VITE_PAYU_CLIENT_ID=your_payu_client_id
   VITE_PAYU_MODE=test
   ```

### Step 5: Start the Server (1 min)

```bash
npm run dev
```

Visit: `http://localhost:5173`

### Step 6: Set Up Admin Access (3 min)

1. Open the app and click "Sign In"
2. Create an account using **someshranjanbiswal13678@gmail.com**
3. After signing in, go to your Clerk Dashboard
4. Copy your User ID (starts with `user_`)
5. Go to Supabase SQL Editor and run:
   ```sql
   UPDATE users
   SET clerk_id = 'YOUR_CLERK_USER_ID',
       is_admin = TRUE
   WHERE email = 'someshranjanbiswal13678@gmail.com';
   ```
6. Sign out and sign back in to activate admin access

## ✅ You're Done!

Now you can:
- ✅ Click "Admin Panel" to create payments
- ✅ Create a test payment for another email
- ✅ Sign in as that email to test client flow
- ✅ View the dashboard analytics

## 🎯 Quick Test Workflow

1. **As Admin:**
   - Click "Admin Panel"
   - Click "Create Payment"
   - Enter test client email (use a different email)
   - Amount: 1000
   - Description: "Test Payment"
   - Click "Create Payment"

2. **As Client:**
   - Sign out
   - Sign in with the test client email
   - Click "Make/Verify Payment"
   - See the payment request
   - Click "Submit for Approval"

3. **Back as Admin:**
   - Sign out and sign back in as admin
   - Go to Admin Panel → Payment Management
   - See the submitted payment
   - Click "View Details" → "Approve"

4. **As Client Again:**
   - Sign in as client
   - Go to payments
   - Click "Accept & Continue"
   - Click "Pay Now" (use test payment mode)

## 🔧 For PayU Test Mode

Use these test credentials when PayU payment page opens:
```
Card: 5123 4567 8901 2346
Expiry: 05/29
CVV: 123
```

## 🆘 Quick Troubleshooting

**Issue:** Admin Panel not showing
**Fix:** Make sure you updated the clerk_id in Supabase and signed out/in

**Issue:** Payments not showing for user
**Fix:** Email in payment request must match your Clerk sign-in email

**Issue:** Environment variables not working
**Fix:** Restart dev server after editing .env

**Issue:** Database errors
**Fix:** Make sure you ran the complete supabase-schema.sql file

## 📚 More Help

- Full setup guide: `PAYMENT_SETUP.md`
- Implementation details: `IMPLEMENTATION_SUMMARY.md`
- Database schema: `supabase-schema.sql`

## 🎉 Features to Explore

- 📊 Dashboard with earnings charts
- 💳 Complete payment workflow
- 🔔 Real-time notifications
- 📥 Invoice downloads
- 🔍 Search and filter payments
- ✏️ Edit payments before approval
- 📜 Payment history/audit log
- 📈 Analytics and reports

Enjoy your new payment system! 🚀
