-- Migration: Add longest correct streak tracking
-- This allows us to track the best performance a student has achieved for each topic

-- Add longest_correct_streak column to user_topic_progress
ALTER TABLE user_topic_progress
ADD COLUMN IF NOT EXISTS longest_correct_streak INTEGER DEFAULT 0;

-- Update existing records to set longest_correct_streak to current correct_streak
UPDATE user_topic_progress
SET longest_correct_streak = correct_streak
WHERE longest_correct_streak IS NULL OR longest_correct_streak < correct_streak;

-- Add index for performance when querying top streaks
CREATE INDEX IF NOT EXISTS idx_user_topic_longest_streak 
ON user_topic_progress(user_id, longest_correct_streak DESC);

-- Add comment
COMMENT ON COLUMN user_topic_progress.longest_correct_streak IS 
'The longest correct answer streak the user has achieved for this topic';
