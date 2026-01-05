-- ================================================================
-- MIGRATION: Pending Question Tracking
-- Created: January 9, 2026
-- Purpose: Enable question persistence across page refreshes
-- Fixes: "Question changes on every refresh" UX bug
-- ================================================================

-- Add columns to user_topic_progress for pending question tracking
ALTER TABLE user_topic_progress
  ADD COLUMN IF NOT EXISTS pending_question_id VARCHAR(255),
  ADD COLUMN IF NOT EXISTS pending_question_data JSONB,
  ADD COLUMN IF NOT EXISTS attempt_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS hint_shown BOOLEAN DEFAULT FALSE;

-- Create index for faster pending question lookups
CREATE INDEX IF NOT EXISTS idx_user_topic_progress_pending 
  ON user_topic_progress(user_id, topic_id, pending_question_id)
  WHERE pending_question_id IS NOT NULL;

-- Add comment to document purpose
COMMENT ON COLUMN user_topic_progress.pending_question_id IS 
  'ID of the question currently being attempted (null if no pending question)';
  
COMMENT ON COLUMN user_topic_progress.pending_question_data IS 
  'Full question object (question_text, options, correct_answer, etc.) stored as JSONB';
  
COMMENT ON COLUMN user_topic_progress.attempt_count IS 
  'Number of wrong attempts on current pending question (0 = not attempted, 1 = first wrong, 2+ = multiple wrongs)';
  
COMMENT ON COLUMN user_topic_progress.hint_shown IS 
  'Whether a hint has been shown for the current pending question (reset when question changes)';
