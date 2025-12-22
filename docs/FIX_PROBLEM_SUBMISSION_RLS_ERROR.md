# Fix for Problem Submission RLS Error

## Problem
Students cannot submit answers for public problems due to RLS policy violations:
```
Error: new row violates row-level security policy for table "problem_leaderboards"
```

## Root Cause
The `problem_leaderboards` and `problem_attempts` tables have RLS enabled but missing proper policies that allow:
1. Students to insert their problem attempts
2. The database trigger to insert into leaderboards

## Solution
Run the SQL script: `docs/sql/FIX_PROBLEM_LEADERBOARDS_RLS.sql`

### How to Apply the Fix

**Option 1: Using Supabase Dashboard**
1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Open the file `docs/sql/FIX_PROBLEM_LEADERBOARDS_RLS.sql`
4. Copy the entire content
5. Paste it into the SQL Editor
6. Click "Run" to execute

**Option 2: Using Supabase CLI**
```bash
supabase db execute --file docs/sql/FIX_PROBLEM_LEADERBOARDS_RLS.sql
```

**Option 3: Using psql**
```bash
psql -h <your-db-host> -U postgres -d postgres -f docs/sql/FIX_PROBLEM_LEADERBOARDS_RLS.sql
```

## What the Fix Does

### For `problem_attempts` table:
- ✅ Allows students to INSERT their attempts (validates room participation)
- ✅ Allows students to SELECT their own attempts
- ✅ Allows teachers to SELECT attempts in their rooms

### For `problem_leaderboards` table:
- ✅ Allows anyone to SELECT leaderboard data (public display)
- ✅ Allows authenticated users to INSERT (needed for trigger)
- ✅ Allows users to UPDATE their own entries
- ✅ Grants necessary permissions to authenticated role

## Verification

After running the script, verify policies are active:

```sql
-- Check problem_attempts policies
SELECT policyname, cmd FROM pg_policies 
WHERE tablename = 'problem_attempts';

-- Check problem_leaderboards policies  
SELECT policyname, cmd FROM pg_policies
WHERE tablename = 'problem_leaderboards';
```

Expected output:
- `Allow students to insert attempts` (INSERT)
- `Allow users to view their attempts` (SELECT)
- `Allow public read access to leaderboards` (SELECT)
- `Allow insert for authenticated users` (INSERT)
- `Allow users to update own entries` (UPDATE)

## Testing

After applying the fix, test by:
1. Login as a student
2. Join a room with public problems
3. Attempt to solve a problem
4. Submit your answer
5. ✅ Should succeed without RLS errors

## Important Notes

- The trigger `update_problem_leaderboard()` runs in the user's security context
- The INSERT policy for leaderboards is permissive to allow trigger execution
- Students can only insert attempts for rooms they're participants in
- Teachers can view all attempts in their rooms
- Leaderboard data is publicly readable for display purposes
