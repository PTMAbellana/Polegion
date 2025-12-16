# Fix Assessment Submission Error

## Problem
Assessment submission fails with RLS policy error:
```
new row violates row-level security policy for table "user_assessment_results"
```

## Root Cause
The `user_assessment_results` table is missing an **UPDATE** policy. It only has SELECT and INSERT policies, but when users submit assessments, the backend sometimes needs to UPDATE existing records.

## Solution

### Run this SQL in Supabase Dashboard

1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Copy and run this SQL:

```sql
-- Add UPDATE policy for user_assessment_results
DROP POLICY IF EXISTS "Users can update their own assessment results" ON user_assessment_results;
CREATE POLICY "Users can update their own assessment results"
  ON user_assessment_results FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

### Verify the Fix

Run this query to confirm all policies are in place:

```sql
SELECT 
    policyname,
    cmd
FROM pg_policies 
WHERE tablename = 'user_assessment_results'
ORDER BY cmd;
```

**Expected output:**
- `Users can insert their own assessment results` | INSERT
- `Users can view their own assessment results` | SELECT
- `Users can update their own assessment results` | UPDATE

## After Running SQL

1. Try submitting the assessment again
2. The submission should now work without RLS errors

## Files Updated

- ✅ `docs/sql/FIX_ASSESSMENT_RLS_POLICY.sql` - Quick fix SQL file
- ✅ `docs/sql/DATABASE_COMPLETE_SCHEMA.sql` - Updated with UPDATE policy

For future database resets, the main schema file now includes the UPDATE policy.
