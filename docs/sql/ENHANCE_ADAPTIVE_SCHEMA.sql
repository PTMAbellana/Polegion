-- Enhancement: Add Pedagogical Strategy Tracking
-- Run this AFTER ADAPTIVE_LEARNING_SCHEMA.sql
-- Adds columns for teaching strategies, representations, and misconception detection

-- ================================================================
-- Add Enhanced Columns to student_difficulty_levels
-- ================================================================
ALTER TABLE student_difficulty_levels 
ADD COLUMN IF NOT EXISTS mastery_bucket VARCHAR(20) DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS current_topic VARCHAR(100),
ADD COLUMN IF NOT EXISTS current_representation VARCHAR(20) DEFAULT 'text',
ADD COLUMN IF NOT EXISTS teaching_strategy VARCHAR(50),
ADD COLUMN IF NOT EXISTS misconception_pattern JSONB DEFAULT '{}'::jsonb;

COMMENT ON COLUMN student_difficulty_levels.mastery_bucket IS 'Discretized mastery: very_low, low, medium, high';
COMMENT ON COLUMN student_difficulty_levels.current_topic IS 'Current geometry topic: points, lines, perimeter, area, etc.';
COMMENT ON COLUMN student_difficulty_levels.current_representation IS 'Question format: text, visual, real_world';
COMMENT ON COLUMN student_difficulty_levels.teaching_strategy IS 'Last pedagogical action taken';
COMMENT ON COLUMN student_difficulty_levels.misconception_pattern IS 'JSON tracking repeated error types';

-- ================================================================
-- Add Enhanced Columns to mdp_state_transitions
-- ================================================================
ALTER TABLE mdp_state_transitions
ADD COLUMN IF NOT EXISTS pedagogical_strategy VARCHAR(100),
ADD COLUMN IF NOT EXISTS representation_type VARCHAR(20),
ADD COLUMN IF NOT EXISTS misconception_detected VARCHAR(100);

COMMENT ON COLUMN mdp_state_transitions.pedagogical_strategy IS 'Teaching approach: visual, real_world, hint, review, etc.';
COMMENT ON COLUMN mdp_state_transitions.representation_type IS 'Question representation used';
COMMENT ON COLUMN mdp_state_transitions.misconception_detected IS 'Detected error pattern if any';

-- ================================================================
-- Function: Bucket Mastery Level
-- ================================================================
CREATE OR REPLACE FUNCTION bucket_mastery(mastery DECIMAL) 
RETURNS VARCHAR AS $$
BEGIN
  IF mastery < 25 THEN RETURN 'very_low';
  ELSIF mastery < 50 THEN RETURN 'low';
  ELSIF mastery < 75 THEN RETURN 'medium';
  ELSE RETURN 'high';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- ================================================================
-- Update Existing Records with Buckets
-- ================================================================
UPDATE student_difficulty_levels
SET mastery_bucket = bucket_mastery(mastery_level)
WHERE mastery_bucket IS NULL OR mastery_bucket = 'medium';

-- ================================================================
-- Success Message
-- ================================================================
DO $$
BEGIN
  RAISE NOTICE '✅ Enhanced Adaptive Learning Schema Applied!';
  RAISE NOTICE '📚 Added pedagogical strategy tracking';
  RAISE NOTICE '🎨 Added representation type (text/visual/real-world)';
  RAISE NOTICE '🔍 Added misconception pattern detection';
  RAISE NOTICE '📊 Added mastery bucketing function';
END $$;
