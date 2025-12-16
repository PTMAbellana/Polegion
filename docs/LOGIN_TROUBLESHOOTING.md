# Login Troubleshooting Guide

## Fixed Login Issue

### Problem
Login was failing due to axios interceptor incorrectly processing auth requests.

### Root Cause
The request interceptor was checking for `/auth/login` (with leading slash) but the URL pattern wasn't matching correctly, causing the interceptor to try token validation on login requests.

### Fix Applied
Updated `frontend/api/axios.js`:
- ✅ Changed URL pattern matching to use `.includes()` instead of `.startsWith()`
- ✅ Check for both `/auth/login` and `auth/login` patterns
- ✅ Added better logging for debugging
- ✅ Grouped auth endpoint checks for clarity

## How to Test Login

### 1. Open Browser Console
- Press F12
- Go to Console tab
- Clear console

### 2. Try to Login
You should see these logs:
```
📤 Request: POST /auth/login
✅ Auth/public endpoint detected, skipping token check
🔐 Attempting login for: your@email.com
✅ Login response received: {message: "...", data: {...}}
```

### 3. Check for Errors

#### If you see "❌ Login error":
Check the error details in console

#### Common Error: "Network Error"
- Backend is not running
- Wrong API_URL
- **Fix:** Verify backend is running on port 5000

#### Common Error: "CORS blocked"
- Backend CORS not configured
- **Fix:** Check `backend/server.js` CORS settings

#### Common Error: "Invalid credentials"
- Wrong email/password
- **Fix:** Check credentials or register new account

#### Common Error: "Timeout"
- Backend is slow to respond
- **Fix:** Check backend logs, verify database connection

## Debug Steps

### 1. Verify Backend is Running
```bash
# Check health endpoint
curl http://localhost:5000/health

# Should return:
# {"status":"ok","timestamp":"...","uptime":123}
```

### 2. Test Login Endpoint Directly
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

### 3. Check Network Tab
- Open DevTools → Network tab
- Try to login
- Find the `login` request
- Check:
  - Status code (should be 200)
  - Response body (should have data and session)
  - Request headers (should NOT have Authorization on login)

### 4. Check Console Logs
Look for these patterns:

#### Good Pattern ✅
```
📤 Request: POST /auth/login
✅ Auth/public endpoint detected, skipping token check
🔐 Attempting login for: user@email.com
✅ Login response received: {message: "Login successful", data: {...}}
💾 Saving auth data: {accessToken: "✅ Present", ...}
```

#### Bad Pattern ❌
```
📤 Request: POST /auth/login
⚠️ No access token found for request: /auth/login  ← Should NOT see this!
❌ Login error: {message: "..."}
```

If you see "No access token found" for login request, the interceptor is not working correctly.

## Code Changes Made

### File: `frontend/api/axios.js`
**Before:**
```javascript
if (config.url?.includes('/auth/login') || 
    config.url?.includes('/auth/register')) {
  // ...
}
```

**After:**
```javascript
const isAuthEndpoint = 
    config.url?.includes('auth/login') ||   // Works with or without /
    config.url?.includes('auth/register') ||
    config.url?.includes('auth/logout');

if (isAuthEndpoint || isPublicEndpoint) {
  console.log('✅ Auth/public endpoint detected, skipping token check');
  // ...
}
```

### File: `frontend/api/auth.js`
Added detailed logging:
```javascript
console.log('🔐 Attempting login for:', email);
console.log('✅ Login response received:', response.data);
console.error('❌ Login error:', error);
```

## Still Having Issues?

### Clear Browser Data
1. Open DevTools (F12)
2. Go to Application tab
3. Click "Clear storage"
4. Click "Clear site data"
5. Refresh page
6. Try login again

### Restart Both Servers
```bash
# Stop both servers (Ctrl+C)

# Start backend
cd backend
npm run dev

# Start frontend (in new terminal)
cd frontend
npm run dev
```

### Check Environment Variables
```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Backend (.env)
PORT=5000
SUPABASE_URL=https://...
SUPABASE_SERVICE_KEY=eyJ...
JWT_SECRET=your_secret
```

## Contact Points for Support

If login still fails after these steps, provide:
1. **Console logs** (screenshot or copy)
2. **Network tab** (screenshot of failed request)
3. **Backend logs** (terminal output)
4. **Error message** (exact text)
5. **Steps to reproduce**
