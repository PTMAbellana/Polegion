-- ============================================================================
-- ALTERNATIVE: DISABLE RLS FOR ASSESSMENT TABLES (SIMPLER)
-- ============================================================================
-- Problem: Backend uses service role key but RLS policies block operations
-- Solution: Service role keys SHOULD bypass RLS entirely
-- Note: This is the standard and recommended approach for backend operations
-- ============================================================================

-- Disable RLS for assessment tables when using service role
-- The service role key automatically bypasses RLS when RLS is disabled
-- Or we can keep RLS enabled but make policies service-role friendly

-- Option 1: Keep RLS enabled but make policies work (RECOMMENDED)
-- ============================================================================
-- Run FIX_ASSESSMENT_RLS_FOR_BACKEND.sql instead

-- Option 2: Disable RLS entirely (SIMPLER but less secure for frontend)
-- ============================================================================
-- This will allow service role to operate freely
-- But frontend will also bypass RLS if it uses service key

-- Uncomment below to disable RLS (NOT RECOMMENDED for production)
-- ALTER TABLE user_assessment_attempts DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE user_assessment_results DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE assessment_questions DISABLE ROW LEVEL SECURITY;

-- Option 3: Use service role bypass in Supabase client (BEST APPROACH)
-- ============================================================================
-- Configure the Supabase client in backend to properly bypass RLS
-- This is done in code, not SQL - see backend/config/supabase.js

-- Verify current RLS status
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename IN ('user_assessment_attempts', 'user_assessment_results', 'assessment_questions')
AND schemaname = 'public';

-- Check if RLS is enabled:
-- rowsecurity = true means RLS is enabled
-- rowsecurity = false means RLS is disabled
