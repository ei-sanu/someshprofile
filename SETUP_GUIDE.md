# 🚀 Setup Guide - Fixing Blank White Screen

## Problem Fixed ✅
The blank white screen issue was caused by missing environment variables throwing errors that crashed the entire app on reload.

## What Was Changed

### 1. **Error Handling in userSync.ts**
- Changed `throw new Error()` to `console.error()` for missing Supabase credentials
- Added placeholder values to prevent crashes
- App now loads even without credentials (with warnings in console)

### 2. **Error Boundary Component**
- Added `ErrorBoundary.tsx` component to catch runtime errors gracefully
- Shows user-friendly error message instead of blank screen
- Provides reload and home navigation buttons

### 3. **App.tsx Improvements**
- Wrapped app in ErrorBoundary for better error handling
- Added error state management
- Better error recovery UI

## Setup Your Environment Variables

1. **Check if .env file exists:**
   ```bash
   ls -la /Users/somesh/Projects/sanupt2/.env
   ```

2. **If missing, create from example:**
   ```bash
   cd /Users/somesh/Projects/sanupt2
   cp .env.example .env
   ```

3. **Add your credentials to .env:**
   ```env
   # Clerk Authentication
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key_here

   # Supabase
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

   # PayU Payment Gateway
   VITE_PAYU_MERCHANT_KEY=your_payu_key_here
   VITE_PAYU_MERCHANT_SALT=your_payu_salt_here
   VITE_PAYU_CLIENT_ID=your_payu_client_id_here
   VITE_PAYU_CLIENT_SECRET=your_payu_client_secret_here
   VITE_PAYU_MODE=test
   ```

4. **Restart the dev server:**
   ```bash
   npm run dev
   ```

## Current Status

✅ **App is now running at:** http://localhost:5173/
✅ **No build errors**
✅ **Graceful error handling**
✅ **No more blank white screens**

## How to Get Your Credentials

### Clerk (Authentication)
1. Go to https://dashboard.clerk.com/
2. Select your application
3. Copy the Publishable Key from the API Keys section

### Supabase (Database)
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to Settings > API
4. Copy the Project URL and anon/public key

### PayU (Payment Gateway)
1. Log in to your PayU merchant account
2. Go to Settings > Integration
3. Copy your Merchant Key and Salt

## Testing

1. **Without credentials:** App loads with console warnings but no crash
2. **With credentials:** Full functionality enabled
3. **On error:** User sees friendly error message with reload option

## Need Help?

If you see errors in the browser console:
1. Press F12 to open DevTools
2. Check the Console tab
3. Look for red error messages
4. The app will show a user-friendly error screen instead of going blank

Your app is now crash-resistant! 🎉
