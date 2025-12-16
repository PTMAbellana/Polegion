# Deployment Environment Variables

## Frontend (Vercel)

Set these in Vercel Dashboard → Your Project → Settings → Environment Variables:

```
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Backend (Railway)

Set these in Railway Dashboard → Your Service → Variables:

```
PORT=5000
NODE_ENV=production

# Supabase (CRITICAL: Use SERVICE ROLE KEY, not anon key!)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key_here

# JWT
JWT_SECRET=your_jwt_secret_minimum_32_characters

# CORS
FRONTEND_URL=https://your-app.vercel.app

# Optional: For health check keep-alive
BACKEND_URL=https://your-backend.railway.app

# Google OAuth (if using)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://your-backend.railway.app/api/auth/google/callback

# Email (if using)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## How to Get Service Role Key

1. Go to Supabase Dashboard
2. Select your project
3. Go to Settings → API
4. Copy the `service_role` secret (NOT the anon key!)
5. This key bypasses RLS and should only be used in backend

## Important Notes

- ✅ Backend uses **SERVICE ROLE KEY** (starts with `eyJ...` and is very long)
- ❌ Backend should NEVER use anon key
- ✅ Frontend uses **ANON KEY** (also starts with `eyJ...` but different)
- ✅ All `NEXT_PUBLIC_*` variables are exposed to browser
- ❌ Never put service role key in frontend
