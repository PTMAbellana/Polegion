-- =====================================================
-- PROBLEM GRADING SYSTEM ENHANCEMENT
-- Adds problem types, grading rules, and public/private visibility
-- Date: December 15, 2025
-- =====================================================

-- Step 1: Add new columns to problems table
ALTER TABLE problems 
ADD COLUMN IF NOT EXISTS problem_type VARCHAR(50) DEFAULT 'general',
ADD COLUMN IF NOT EXISTS grading_rules JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS shape_constraint VARCHAR(50),
ADD COLUMN IF NOT EXISTS accepts_submissions BOOLEAN DEFAULT true;

-- Step 2: Change visibility field to use proper enum values
-- First, check what visibility values exist
-- Update ALL non-standard values to 'private' (safe default)
UPDATE problems 
SET visibility = 'private' 
WHERE visibility NOT IN ('public', 'private') 
   OR visibility IS NULL;

-- Add check constraint for visibility
ALTER TABLE problems 
DROP CONSTRAINT IF EXISTS problems_visibility_check;

ALTER TABLE problems
ADD CONSTRAINT problems_visibility_check 
CHECK (visibility IN ('public', 'private'));

-- Step 3: Add check constraint for problem_type
ALTER TABLE problems
ADD CONSTRAINT problems_problem_type_check
CHECK (problem_type IN (
  'general',
  'angle_complementary',
  'angle_supplementary',
  'angle_sum',
  'angle_interior',
  'angle_exterior',
  'perimeter',
  'area',
  'perimeter_square',
  'perimeter_rectangle',
  'perimeter_triangle',
  'perimeter_circle',
  'perimeter_quadrilateral',
  'area_square',
  'area_rectangle',
  'area_triangle',
  'area_circle',
  'area_quadrilateral',
  'line_length',
  'line_midpoint',
  'pythagorean_theorem',
  'volume',
  'surface_area'
));

-- Step 4: Add check constraint for shape_constraint
ALTER TABLE problems
ADD CONSTRAINT problems_shape_constraint_check
CHECK (shape_constraint IS NULL OR shape_constraint IN (
  'square',
  'rectangle',
  'triangle',
  'circle',
  'parallelogram',
  'trapezoid',
  'rhombus',
  'kite',
  'quadrilateral',
  'line',
  'line_segment',
  'angle',
  'polygon',
  'pentagon',
  'hexagon',
  'octagon'
));

-- Step 5: Create problem_leaderboards table
CREATE TABLE IF NOT EXISTS problem_leaderboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  problem_id UUID NOT NULL,
  user_id UUID NOT NULL,
  room_participant_id BIGINT NOT NULL,
  score NUMERIC(5,2) NOT NULL DEFAULT 0,
  time_taken INTEGER, -- in seconds
  attempt_count INTEGER DEFAULT 1,
  best_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  last_attempt_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT problem_leaderboards_problem_id_fkey FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE,
  CONSTRAINT problem_leaderboards_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT problem_leaderboards_room_participant_id_fkey FOREIGN KEY (room_participant_id) REFERENCES room_participants(id) ON DELETE CASCADE,
  UNIQUE(problem_id, user_id)
);

-- Step 6: Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_problems_visibility ON problems(visibility);
CREATE INDEX IF NOT EXISTS idx_problems_problem_type ON problems(problem_type);
CREATE INDEX IF NOT EXISTS idx_problems_room_id ON problems(room_id);
CREATE INDEX IF NOT EXISTS idx_problem_leaderboards_problem_id ON problem_leaderboards(problem_id);
CREATE INDEX IF NOT EXISTS idx_problem_leaderboards_score ON problem_leaderboards(problem_id, best_score DESC);

-- Step 7: Update problem_attempts table to store more grading details
ALTER TABLE problem_attempts
ADD COLUMN IF NOT EXISTS validation_details JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_correct BOOLEAN,
ADD COLUMN IF NOT EXISTS score NUMERIC(5,2);

-- Step 8: Create view for public problems with leaderboard stats
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
WHERE p.visibility = 'public' AND p.accepts_submissions = true
GROUP BY p.id, p.title, p.description, p.room_id, p.difficulty, 
         p.problem_type, p.expected_xp, p.max_attempts, p.created_at;

-- Step 9: Create function to update leaderboard after attempt
CREATE OR REPLACE FUNCTION update_problem_leaderboard()
RETURNS TRIGGER AS $$
BEGIN
  -- Only process if the problem is public and scored
  IF NEW.score IS NOT NULL THEN
    INSERT INTO problem_leaderboards (
      problem_id, 
      user_id, 
      room_participant_id,
      score,
      best_score,
      time_taken,
      attempt_count,
      last_attempt_at
    )
    SELECT 
      NEW.problem_id,
      rp.user_id,
      NEW.room_participant_id,
      NEW.score,
      NEW.score,
      EXTRACT(EPOCH FROM (NEW.attempted_at - p.created_at))::INTEGER,
      1,
      NEW.attempted_at
    FROM room_participants rp
    JOIN problems p ON p.id = NEW.problem_id
    WHERE rp.id = NEW.room_participant_id
    ON CONFLICT (problem_id, user_id) 
    DO UPDATE SET
      score = NEW.score,
      best_score = GREATEST(problem_leaderboards.best_score, NEW.score),
      attempt_count = problem_leaderboards.attempt_count + 1,
      last_attempt_at = NEW.attempted_at,
      time_taken = CASE 
        WHEN NEW.score > problem_leaderboards.best_score 
        THEN EXCLUDED.time_taken 
        ELSE problem_leaderboards.time_taken 
      END;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 10: Create trigger for leaderboard updates
DROP TRIGGER IF EXISTS trigger_update_leaderboard ON problem_attempts;
CREATE TRIGGER trigger_update_leaderboard
AFTER INSERT ON problem_attempts
FOR EACH ROW
EXECUTE FUNCTION update_problem_leaderboard();

-- Step 11: Add comments for documentation
COMMENT ON COLUMN problems.problem_type IS 'Type of problem: general, angle_complementary, perimeter, area, etc.';
COMMENT ON COLUMN problems.grading_rules IS 'JSON object containing validation rules and criteria';
COMMENT ON COLUMN problems.shape_constraint IS 'Required shape type for geometry problems';
COMMENT ON COLUMN problems.accepts_submissions IS 'Whether students can submit solutions';
COMMENT ON TABLE problem_leaderboards IS 'Tracks best scores and rankings for public problems';
COMMENT ON COLUMN problem_attempts.validation_details IS 'Detailed validation results from grading engine';

-- =====================================================
-- Example grading_rules JSON structures:
-- =====================================================

-- Example 1: Complementary angle problem
-- {
--   "property_to_check": "angle",
--   "validation_type": "complementary",
--   "tolerance": 0.1,
--   "expected_sum": 90
-- }

-- Example 2: Square perimeter problem
-- {
--   "property_to_check": "perimeter",
--   "shape_constraint": "square",
--   "validation_type": "exact",
--   "tolerance": 0.01,
--   "check_shape": true,
--   "required_properties": {
--     "all_sides_equal": true,
--     "right_angles": true
--   }
-- }

-- Example 3: Rectangle area problem
-- {
--   "property_to_check": "area",
--   "shape_constraint": "rectangle",
--   "validation_type": "exact",
--   "tolerance": 0.01,
--   "check_shape": true,
--   "required_properties": {
--     "opposite_sides_equal": true,
--     "right_angles": true
--   }
-- }

-- =====================================================
-- End of migration
-- =====================================================
