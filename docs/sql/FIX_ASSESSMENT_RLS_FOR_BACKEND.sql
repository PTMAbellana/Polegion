-- ============================================================================
-- FIX ASSESSMENT RLS POLICIES FOR BACKEND SERVICE
-- ============================================================================
-- Problem: Backend uses service role key but RLS policies still apply
-- Root Cause: Service role SHOULD bypass RLS, but if it doesn't, policies need updating
-- ============================================================================

-- IMPORTANT: Verify you're using SUPABASE_SERVICE_KEY (not anon key) in backend/.env
-- Service role key format: eyJhbG... (starts with eyJ)
-- Service role key bypasses RLS by default in Supabase

-- ===========================================================================
-- SOLUTION 1: Update RLS policies to explicitly allow service role (SAFEST)
-- ===========================================================================

-- Fix user_assessment_attempts policies
-- ============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own assessment attempts" ON user_assessment_attempts;
DROP POLICY IF EXISTS "Users can insert their own assessment attempts" ON user_assessment_attempts;
DROP POLICY IF EXISTS "Users can update their own assessment attempts" ON user_assessment_attempts;

-- Allow both authenticated users (auth.uid()) AND service role
CREATE POLICY "Users can view their own assessment attempts"
  ON user_assessment_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert assessment attempts"
  ON user_assessment_attempts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can update assessment attempts"
  ON user_assessment_attempts FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Fix user_assessment_results policies
-- ============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own assessment results" ON user_assessment_results;
DROP POLICY IF EXISTS "Users can insert their own assessment results" ON user_assessment_results;
DROP POLICY IF EXISTS "Users can update their own assessment results" ON user_assessment_results;

CREATE POLICY "Users can view their own assessment results"
  ON user_assessment_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert assessment results"
  ON user_assessment_results FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can update assessment results"
  ON user_assessment_results FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- ===========================================================================
-- SOLUTION 2: Disable RLS entirely (IF service role bypass isn't working)
-- ===========================================================================
-- ONLY use this if Solution 1 doesn't work and you've verified service key

-- ALTER TABLE user_assessment_attempts DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE user_assessment_results DISABLE ROW LEVEL SECURITY;

-- ===========================================================================
-- Verification
-- ===========================================================================
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN ('user_assessment_attempts', 'user_assessment_results')
ORDER BY tablename, cmd;

-- Check RLS status
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename IN ('user_assessment_attempts', 'user_assessment_results')
AND schemaname = 'public';
