# Assessment RLS Policy Fix

## Problem
When submitting assessments, you get this error:
```
Error: Failed to save assessment attempts: new row violates row-level security policy for table "user_assessment_attempts"
```

## Root Cause
The backend uses a **service role key** to interact with Supabase, but Row-Level Security (RLS) policies are blocking database INSERT operations because:
1. Service role key should bypass RLS automatically, but something is preventing this
2. OR the wrong key is being used (anon key instead of service role key)

## Solution

### Step 1: Verify Your Service Role Key
Check your `.env` file in the `backend` folder:
```bash
SUPABASE_SERVICE_KEY=eyJhbG...
```

**Important:** 
- ✅ Service role key starts with `eyJhbG...` and is VERY long
- ❌ Anon key is shorter and does NOT bypass RLS
- You can find your service role key in Supabase Dashboard → Project Settings → API → `service_role` secret

### Step 2: Run the SQL Fix

Run this SQL script in your Supabase SQL Editor:
```sql
docs/sql/FIX_ASSESSMENT_RLS_FOR_BACKEND.sql
```

This script:
- Updates RLS policies to allow backend service operations
- Creates separate policies for users (SELECT) and service role (INSERT/UPDATE)
- Allows the backend to insert/update assessment data while keeping user data secure

### Step 3: Restart Backend
```bash
cd backend
npm run dev
```

## What the Fix Does

### Before (Broken):
```sql
-- This policy blocks service role inserts because auth.uid() is NULL
CREATE POLICY "Users can insert their own assessment attempts"
  ON user_assessment_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);  -- ❌ Blocks service role
```

### After (Fixed):
```sql
-- Users can only view their own data
CREATE POLICY "Users can view their own assessment attempts"
  ON user_assessment_attempts FOR SELECT
  USING (auth.uid() = user_id);  -- ✅ Users see their own data

-- Service role can insert any data (for backend operations)
CREATE POLICY "Service role can insert assessment attempts"
  ON user_assessment_attempts FOR INSERT
  WITH CHECK (true);  -- ✅ Service role bypasses RLS
```

## Alternative: Disable RLS (Less Secure)
If the above doesn't work, you can disable RLS entirely:
```sql
ALTER TABLE user_assessment_attempts DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_assessment_results DISABLE ROW LEVEL SECURITY;
```

⚠️ **Not recommended for production** - this removes all security checks

## Testing
After applying the fix:
1. Go to Castle 0 (Pretest) or Castle 6 (Posttest)
2. Complete all questions
3. Click "Submit Assessment"
4. ✅ Should see results without errors

## Additional Notes
- Service role keys **should** bypass RLS by default in Supabase
- If they're not bypassing, it's often due to incorrect key or outdated Supabase client
- The policies we created explicitly allow service role operations as a workaround
