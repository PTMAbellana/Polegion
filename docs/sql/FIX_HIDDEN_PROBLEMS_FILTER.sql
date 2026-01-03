-- =====================================================
-- FIX: Filter hidden problems from student view
-- =====================================================
-- Run this in Supabase SQL Editor
-- 
-- This fix ensures that problems with visibility='hide' 
-- do not appear in the public problems view shown to students.
-- 
-- The view will now include:
-- - Problems with visibility = 'show' (default)
-- - Problems with visibility = 'public'
-- 
-- The view will exclude:
-- - Problems with visibility = 'hide'
-- =====================================================

-- Drop and recreate the view with correct filtering
CREATE OR REPLACE VIEW public_problems_with_stats AS
SELECT 
  p.id,
  p.title,
  p.description,
  p.room_id,
  p.difficulty,
  p.problem_type,
  p.expected_xp,
  p.max_attempts,
  p.created_at,
  COUNT(DISTINCT pa.id) as total_attempts,
  COUNT(DISTINCT pa.room_participant_id) as unique_solvers,
  AVG(pl.best_score) as average_score,
  MAX(pl.best_score) as highest_score
FROM problems p
LEFT JOIN problem_attempts pa ON p.id = pa.problem_id
LEFT JOIN problem_leaderboards pl ON p.id = pl.problem_id
WHERE p.visibility IN ('show', 'public') 
  AND p.accepts_submissions = true
GROUP BY p.id, p.title, p.description, p.room_id, p.difficulty, 
         p.problem_type, p.expected_xp, p.max_attempts, p.created_at;

-- Add comment to document the visibility filtering
COMMENT ON VIEW public_problems_with_stats IS 'Public problems visible to students. Excludes problems with visibility=hide. Includes problems with visibility=show or public.';

-- Verify the fix by checking problem counts
-- Run this to see how many problems are visible vs hidden:
-- SELECT 
--   visibility,
--   accepts_submissions,
--   COUNT(*) as count
-- FROM problems
-- GROUP BY visibility, accepts_submissions
-- ORDER BY visibility, accepts_submissions;
