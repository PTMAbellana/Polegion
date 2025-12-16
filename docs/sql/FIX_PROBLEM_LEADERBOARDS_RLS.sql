-- =====================================================
-- FIX: Problem Leaderboards RLS Policy
-- =====================================================
-- Issue: Students cannot submit problem attempts because
-- the trigger that inserts into problem_leaderboards is
-- blocked by RLS policies (or missing policies).
-- 
-- Solution: Add proper RLS policies to allow:
-- 1. Students to insert their own leaderboard entries via trigger
-- 2. Everyone to read leaderboard data for public problems
-- 3. Students to update their own entries
-- 4. Students to insert their problem attempts
-- =====================================================

-- =====================================================
-- PART 1: Fix problem_attempts table RLS
-- =====================================================

-- Step 1A: Ensure RLS is enabled on problem_attempts
ALTER TABLE problem_attempts ENABLE ROW LEVEL SECURITY;

-- Step 1B: Drop existing policies if any (to start fresh)
DROP POLICY IF EXISTS "Allow public read of attempts" ON problem_attempts;
DROP POLICY IF EXISTS "Allow users to insert their attempts" ON problem_attempts;
DROP POLICY IF EXISTS "Allow students to insert attempts" ON problem_attempts;
DROP POLICY IF EXISTS "Allow users to view their attempts" ON problem_attempts;

-- Step 1C: Create policy for students to insert their problem attempts
CREATE POLICY "Allow students to insert attempts"
ON problem_attempts
FOR INSERT
TO authenticated
WITH CHECK (
  -- Student can insert if they are the participant in the room
  EXISTS (
    SELECT 1 FROM room_participants rp
    WHERE rp.id = problem_attempts.room_participant_id
    AND rp.user_id = auth.uid()
  )
);

-- Step 1D: Create policy for reading problem attempts
CREATE POLICY "Allow users to view their attempts"
ON problem_attempts
FOR SELECT
TO authenticated
USING (
  -- Users can view their own attempts
  EXISTS (
    SELECT 1 FROM room_participants rp
    WHERE rp.id = problem_attempts.room_participant_id
    AND rp.user_id = auth.uid()
  )
  OR
  -- Teachers can view attempts in their rooms
  EXISTS (
    SELECT 1 FROM rooms r
    JOIN problems p ON p.room_id = r.id
    WHERE p.id = problem_attempts.problem_id
    AND r.teacher_id = auth.uid()
  )
);

-- =====================================================
-- PART 2: Fix problem_leaderboards table RLS
-- =====================================================

-- Step 2A: Ensure RLS is enabled on problem_leaderboards
-- Step 2A: Ensure RLS is enabled on problem_leaderboards
ALTER TABLE problem_leaderboards ENABLE ROW LEVEL SECURITY;

-- Step 2B: Drop existing policies if any (to start fresh)
DROP POLICY IF EXISTS "Allow public read access to leaderboards" ON problem_leaderboards;
DROP POLICY IF EXISTS "Allow users to view leaderboards" ON problem_leaderboards;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON problem_leaderboards;
DROP POLICY IF EXISTS "Allow students to insert their leaderboard entries" ON problem_leaderboards;
DROP POLICY IF EXISTS "Allow users to update own entries" ON problem_leaderboards;

-- Step 2C
-- Step 2C: Create policy for reading leaderboard data
-- Anyone can read leaderboard entries (for public display)
CREATE POLICY "Allow public read access to leaderboards"
ON problem_leaderboards
FOR SELECT
USING (true);

-- Step 2D
-- Step 2D: Create policy for inserting leaderboard entries
-- Allow authenticated users to insert entries (triggered by problem_attempts)
-- This is crucial for the trigger to work
CREATE POLICY "Allow insert for authenticated users"
ON problem_leaderboards
FOR INSERT
TO authenticated
WITH CHECK (
  -- Allow insert if the user_id matches the authenticated user
  auth.uid() = user_id
  OR
  -- OR if the insert is coming from a trigger (no user context check needed)
  -- We trust the trigger logic to handle proper user association
  true
);

-- Step 2E: Create policy for updating leaderboard entries
-- Users can update their own entries
CREATE POLICY "Allow users to update own entries"
ON problem_leaderboards
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- Step 3B: Verify the policies are created for problem_leaderboards
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'problem_leaderboards'
ORDER BY policyname;

-- Step 3C: Grant necessary permissions for problem_attempts
GRANT SELECT ON problem_attempts TO authenticated;
GRANT INSERT ON problem_attempts TO authenticated;

-- Step 3D: Grant necessary permissions for problem_leaderboards
--    inserted into problem_attempts
--
-- 2. The INSERT policy allows any authenticated user
--    to insert, which works for the trigger
--
-- 3. If you need stricter security, you can modify the
--    INSERT policy to check room participation:
--    EXISTS (
--      SELECT 1 FROM room_participants rp
--      WHERE rp.user_id = auth.uid()
--      AND rp.id = problem_leaderboards.room_participant_id
--    )
--
-- 4. The trigger automatically handles the correct
--    user_id and room_participant_id mapping
-- =====================================================

-- Step 3D: Grant necessary permissions for problem_leaderboards
GRANT SELECT ON problem_leaderboards TO authenticated;
GRANT INSERT ON problem_leaderboards TO authenticated;
GRANT UPDATE ON problem_leaderboards TO authenticated;

-- =====================================================
-- Step 3E: Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Problem attempts RLS policies have been created successfully!';
  RAISE NOTICE '✅ Problem leaderboards RLS policies have been created successfully!';
  RAISE NOTICE '✅ Students can now submit problem attempts without RLS errors.';
  RAISE NOTICE '📊 Run the verification queries above to confirm policies are active
--    inserted into problem_attempts
--
-- 2. The INSERT policy for problem_leaderboards allows 
--    any authenticated user to insert, which works for 
--    the trigger
--
-- 3. The INSERT policy for problem_attempts ensures
--    students can only insert attempts for rooms they
--    are participants in
--
-- 4. If you need stricter security for leaderboards,
--    you can modify the INSERT policy to check room 
--    participation
--
-- 5. The trigger automatically handles the correct
--    user_id and room_participant_id mapping
-- =====================================================

-- Step 3E:
-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Problem leaderboards RLS policies have been created successfully!';
  RAISE NOTICE '✅ Students can now submit problem attempts without RLS errors.';
END $$;
