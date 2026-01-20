# 🔒 FIX: Supabase RLS Policies for New User Initialization

## Problem
New users cannot start the worldmap because Castle 0 auto-initialization fails with:
```
Error code: 42501
Message: new row violates row-level security policy for table "user_castle_progress"
```

## Root Cause
The `user_castle_progress` table has Row Level Security (RLS) enabled, but lacks the necessary policies to allow users to create their own progress records.

## Solution: Add RLS Policy in Supabase Dashboard

### Step 1: Navigate to Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Select your project: **Polegion**
3. Go to **Authentication** → **Policies**
4. Find the `user_castle_progress` table

### Step 2: Add INSERT Policy

Click **"New Policy"** and add:

**Policy Name:** `Users can insert their own castle progress`

**Policy Command:** `INSERT`

**Target Roles:** `authenticated`

**USING expression (CHECK):**
```sql
auth.uid() = user_id
```

**WITH CHECK expression:**
```sql
auth.uid() = user_id
```

### Step 3: Verify Existing Policies

Ensure these policies also exist:

#### SELECT Policy
**Policy Name:** `Users can view their own castle progress`
```sql
-- USING expression:
auth.uid() = user_id
```

#### UPDATE Policy
**Policy Name:** `Users can update their own castle progress`
```sql
-- USING expression:
auth.uid() = user_id

-- WITH CHECK expression:
auth.uid() = user_id
```

## Alternative: SQL Script

Run this SQL in **SQL Editor**:

```sql
-- Enable RLS (if not already enabled)
ALTER TABLE user_castle_progress ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (optional - only if recreating)
DROP POLICY IF EXISTS "Users can insert their own castle progress" ON user_castle_progress;
DROP POLICY IF EXISTS "Users can view their own castle progress" ON user_castle_progress;
DROP POLICY IF EXISTS "Users can update their own castle progress" ON user_castle_progress;

-- CREATE: Allow users to insert their own progress
CREATE POLICY "Users can insert their own castle progress"
ON user_castle_progress
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- READ: Allow users to view their own progress
CREATE POLICY "Users can view their own castle progress"
ON user_castle_progress
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- UPDATE: Allow users to update their own progress
CREATE POLICY "Users can update their own castle progress"
ON user_castle_progress
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

## Testing After Fix

1. Create a new test account
2. Login and navigate to worldmap
3. Verify Castle 0 (Pretest) is unlocked
4. Verify no RLS errors in backend logs

## Expected Behavior After Fix

✅ New users automatically have Castle 0 unlocked  
✅ No "42501" RLS policy errors in logs  
✅ Worldmap loads correctly for all users  
✅ Learning statistics display properly  

## Related Files Modified

- `backend/infrastructure/repository/world/UserCastleProgressRepo.js` - Added RLS error handling
- `backend/application/services/world/CastleService.js` - Graceful RLS error handling
- `backend/infrastructure/repository/adaptive/TopicProgressRepo.js` - Removed non-existent `notes` column

## Notes

- The backend uses **service_role key in development** (bypasses RLS)
- The backend uses **anon key in production** (respects RLS)
- Current error indicates production or RLS is enabled even in dev
- Verify `.env` has correct `SUPABASE_SERVICE_KEY` (not anon key)

---

## Quick Verification Command

Check your Supabase key role in terminal:
```bash
cd backend
node -e "console.log(JSON.parse(Buffer.from(process.env.SUPABASE_SERVICE_KEY.split('.')[1], 'base64').toString()).role)"
```

Should output: `service_role`  
If it outputs: `anon` → You're using the wrong key in development
