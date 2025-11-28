-- =====================================================
-- FIX: Update castle XP tracking trigger
-- =====================================================
-- This migration updates the trigger function to properly
-- track XP earned in user_castle_progress table
-- NOTE: The column is named "total_xp_earned" not "xp_earned"
-- =====================================================

-- Drop the old trigger first
DROP TRIGGER IF EXISTS trigger_update_castle_completion ON user_chapter_progress;

-- Update the function to include XP tracking
CREATE OR REPLACE FUNCTION update_castle_completion()
RETURNS TRIGGER AS $$
DECLARE
  total_chapters INTEGER;
  completed_chapters INTEGER;
  total_xp INTEGER;
  castle_id_val UUID;
BEGIN
  -- Get the castle_id from the chapter
  SELECT c.castle_id INTO castle_id_val
  FROM chapters c
  WHERE c.id = NEW.chapter_id;

  -- Count total chapters for this castle
  SELECT COUNT(*) INTO total_chapters
  FROM chapters
  WHERE castle_id = castle_id_val;

  -- Count completed chapters
  SELECT COUNT(*) INTO completed_chapters
  FROM user_chapter_progress ucp
  JOIN chapters c ON ucp.chapter_id = c.id
  WHERE c.castle_id = castle_id_val
    AND ucp.user_id = NEW.user_id
    AND ucp.completed = true;

  -- Sum total XP earned from all chapters in this castle
  SELECT COALESCE(SUM(ucp.xp_earned), 0) INTO total_xp
  FROM user_chapter_progress ucp
  JOIN chapters c ON ucp.chapter_id = c.id
  WHERE c.castle_id = castle_id_val
    AND ucp.user_id = NEW.user_id;

  -- Update castle progress
  UPDATE user_castle_progress
  SET 
    completion_percentage = CASE 
      WHEN total_chapters > 0 THEN (completed_chapters * 100 / total_chapters)
      ELSE 0
    END,
    completed = (completed_chapters = total_chapters),
    total_xp_earned = total_xp,
    updated_at = NOW()
  WHERE user_id = NEW.user_id
    AND castle_id = castle_id_val;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
CREATE TRIGGER trigger_update_castle_completion
  AFTER INSERT OR UPDATE ON user_chapter_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_castle_completion();

-- =====================================================
-- Backfill existing castle progress XP
-- =====================================================
-- This updates all existing castle progress records to have
-- the correct XP sum from their chapters
-- =====================================================

UPDATE user_castle_progress ucp
SET total_xp_earned = (
  SELECT COALESCE(SUM(ch_progress.xp_earned), 0)
  FROM user_chapter_progress ch_progress
  JOIN chapters c ON ch_progress.chapter_id = c.id
  WHERE c.castle_id = ucp.castle_id
    AND ch_progress.user_id = ucp.user_id
);

-- Verify the update
SELECT 
  u.email,
  ca.name as castle_name,
  ucp.total_xp_earned as castle_xp,
  ucp.completion_percentage,
  ucp.completed,
  (
    SELECT COALESCE(SUM(ch_progress.xp_earned), 0)
    FROM user_chapter_progress ch_progress
    JOIN chapters c ON ch_progress.chapter_id = c.id
    WHERE c.castle_id = ucp.castle_id
      AND ch_progress.user_id = ucp.user_id
  ) as calculated_xp
FROM user_castle_progress ucp
JOIN auth.users u ON ucp.user_id = u.id
JOIN castles ca ON ucp.castle_id = ca.id
ORDER BY u.email, ca.unlock_order;
