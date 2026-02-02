# Cloudflare Turnstile Setup Guide
## Bot Protection for Registration

## What Was Implemented

✅ **Frontend** - Registration form now includes Turnstile widget
✅ **Backend** - Token verification before registration completes
✅ **Test mode** - Uses dummy key for development, real key needed for production

## Setup Steps (10 minutes)

### Step 1: Get Turnstile Keys from Cloudflare

1. Go to https://dash.cloudflare.com/
2. Sign in (or create free account)
3. Click **Turnstile** in left sidebar
4. Click **Add Site**
5. Configure:
   - **Site name**: Polegion Production
   - **Domain**: `polegion.vercel.app` (add your domain)
   - **Widget Mode**: Managed (recommended)
6. Click **Create**
7. Copy both keys:
   - **Site Key** (public) - starts with `0x4...`
   - **Secret Key** (private) - starts with `0x4...`

### Step 2: Add Frontend Environment Variable (Vercel)

1. Go to https://vercel.com/dashboard
2. Select **Polegion** project
3. Click **Settings** → **Environment Variables**
4. Add new variable:
   - **Name**: `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
   - **Value**: Paste your Site Key from Step 1
   - **Environments**: Production, Preview, Development
5. Click **Save**
6. **Redeploy** frontend for changes to take effect

### Step 3: Add Backend Environment Variable (Railway)

1. Go to Railway dashboard
2. Select your **backend service**
3. Click **Variables** tab
4. Add new variable:
   - **Name**: `TURNSTILE_SECRET_KEY`
   - **Value**: Paste your Secret Key from Step 1
5. Click **Add**
6. Railway will auto-redeploy

### Step 4: Verify It Works

**Test in Production:**
1. Go to https://polegion.vercel.app/auth/register
2. Fill out registration form
3. You should see the Turnstile widget appear
4. Complete verification
5. Submit form - should work!

**Check Backend Logs:**
Look for: `[Turnstile] ✅ Verification passed`

## Testing Locally (Development)

The code uses a **test key** that always passes verification:
- Site Key: `1x00000000000000000000AA` (already in code as fallback)

For local testing:
```bash
# Frontend - No .env needed, test key is built-in

# Backend - Add to backend/.env
TURNSTILE_SECRET_KEY=1x00000000000000000000BB
```

Then test at http://localhost:3000/student/auth/register

## What Happens If Turnstile Fails

**No Secret Key Configured:**
- ⚠️ Backend logs warning but allows registration
- Protection is disabled (graceful degradation)

**Verification Fails:**
- ❌ Frontend shows: "Bot verification failed"
- ❌ Registration blocked with 403 error
- User can retry by refreshing the widget

## Security Features

✅ **IP validation** - Backend checks user IP matches token
✅ **Token expiration** - Tokens expire after 5 minutes
✅ **One-time use** - Each token can only be used once
✅ **Fail closed** - Denies registration if verification errors occur

## Current Status

| Component | Status | Action Needed |
|-----------|--------|---------------|
| Frontend Code | ✅ Deployed | Add NEXT_PUBLIC_TURNSTILE_SITE_KEY to Vercel |
| Backend Code | ✅ Deployed | Add TURNSTILE_SECRET_KEY to Railway |
| Cloudflare Account | ⏳ Pending | Create Turnstile site |
| Production Keys | ⏳ Pending | Get from Cloudflare dashboard |

## Files Changed

- ✅ `frontend/components/auth/RegisterForm.tsx` - Added Turnstile widget
- ✅ `frontend/store/authStore.ts` - Pass token to backend
- ✅ `backend/presentation/controllers/auth/AuthController.js` - Verify token

## Emergency Disable (if needed)

**To disable Turnstile without redeploying:**
1. Railway → Backend variables
2. **Delete** `TURNSTILE_SECRET_KEY` variable
3. Backend will skip verification and allow all registrations

## Tomorrow's Test

For tomorrow's 50-user test:
- **Option A**: Set up real Turnstile keys (recommended, 10 minutes)
- **Option B**: Leave disabled, system works without it (protection off)

Turnstile is **non-blocking** - if not configured, registrations proceed normally.
