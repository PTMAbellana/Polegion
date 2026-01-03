-- Fix RLS Policy for user_assessment_results table
-- The table is missing UPDATE policy which prevents users from updating their assessment results

-- Add UPDATE policy for user_assessment_results
DROP POLICY IF EXISTS "Users can update their own assessment results" ON user_assessment_results;
CREATE POLICY "Users can update their own assessment results"
  ON user_assessment_results FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Verify policies are in place
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'user_assessment_results'
ORDER BY cmd;

-- Expected output should show:
-- INSERT policy: "Users can insert their own assessment results"
-- SELECT policy: "Users can view their own assessment results"  
-- UPDATE policy: "Users can update their own assessment results" (NEW)
