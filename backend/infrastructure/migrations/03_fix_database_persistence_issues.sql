-- ================================================================
-- MIGRATION: Database Persistence Fixes (Critical Issues)
-- Created: January 6, 2026
-- Purpose: Fix race conditions, add indexes, add constraints
-- Addresses: Audit findings from AUDIT_DATABASE_PERSISTENCE.js
-- ================================================================

-- ================================================================
-- FIX #1: Add composite index for fast pending question lookups
-- Impact: Prevents full table scan on getPendingQuestion()
-- ================================================================
CREATE INDEX IF NOT EXISTS idx_user_topic_progress_user_topic 
  ON user_topic_progress(user_id, topic_id);

-- ================================================================
-- FIX #2: Add attempt_count upper limit (prevent infinite loops)
-- Impact: Prevents bugs from corrupting analytics
-- ================================================================
ALTER TABLE user_topic_progress
  DROP CONSTRAINT IF EXISTS check_attempt_count_limit;

ALTER TABLE user_topic_progress
  ADD CONSTRAINT check_attempt_count_limit 
  CHECK (attempt_count >= 0 AND attempt_count <= 10);

-- ================================================================
-- FIX #3: Add pending_question_data size limit (prevent DoS)
-- Impact: Prevents malicious clients from storing huge JSONB objects
-- ================================================================
ALTER TABLE user_topic_progress
  DROP CONSTRAINT IF EXISTS check_pending_question_size;

ALTER TABLE user_topic_progress
  ADD CONSTRAINT check_pending_question_size 
  CHECK (
    pending_question_data IS NULL OR 
    length(pending_question_data::text) < 50000
  );

-- ================================================================
-- FIX #4: Add submission tracking for idempotency
-- Impact: Prevents double-processing of answers
-- ================================================================
-- Add submission tracking columns to adaptive_learning_state
ALTER TABLE adaptive_learning_state
  ADD COLUMN IF NOT EXISTS last_submission_id VARCHAR(255),
  ADD COLUMN IF NOT EXISTS last_submission_at TIMESTAMP WITH TIME ZONE;

-- Create index for fast submission deduplication
CREATE INDEX IF NOT EXISTS idx_adaptive_learning_state_submission
  ON adaptive_learning_state(user_id, topic_id, last_submission_id);

-- ================================================================
-- FIX #5: Create atomic increment function (fixes race condition)
-- Impact: Makes incrementAttemptCount() thread-safe
-- ================================================================
CREATE OR REPLACE FUNCTION increment_attempt_count_atomic(
  p_user_id UUID,
  p_topic_id UUID
)
RETURNS TABLE (
  new_attempt_count INTEGER,
  pending_question_id VARCHAR(255),
  pending_question_data JSONB
) AS $$
DECLARE
  v_new_count INTEGER;
BEGIN
  -- Atomic increment using UPDATE...RETURNING
  UPDATE user_topic_progress
  SET 
    attempt_count = LEAST(attempt_count + 1, 10), -- Cap at 10
    updated_at = NOW()
  WHERE user_id = p_user_id 
    AND topic_id = p_topic_id
  RETURNING 
    attempt_count,
    user_topic_progress.pending_question_id,
    user_topic_progress.pending_question_data
  INTO 
    v_new_count,
    pending_question_id,
    pending_question_data;
  
  -- If no row found, create one with attempt_count = 1
  IF NOT FOUND THEN
    INSERT INTO user_topic_progress (user_id, topic_id, attempt_count, unlocked)
    VALUES (p_user_id, p_topic_id, 1, TRUE)
    RETURNING 
      attempt_count,
      user_topic_progress.pending_question_id,
      user_topic_progress.pending_question_data
    INTO 
      v_new_count,
      pending_question_id,
      pending_question_data;
  END IF;
  
  new_attempt_count := v_new_count;
  RETURN NEXT;
END;
$$ LANGUAGE plpgsql;

-- ================================================================
-- FIX #6: Create idempotent answer processing function
-- Impact: Prevents duplicate answer processing
-- ================================================================
CREATE OR REPLACE FUNCTION check_submission_duplicate(
  p_user_id UUID,
  p_topic_id UUID,
  p_submission_id VARCHAR(255)
)
RETURNS BOOLEAN AS $$
DECLARE
  v_last_id VARCHAR(255);
  v_last_time TIMESTAMP WITH TIME ZONE;
BEGIN
  SELECT last_submission_id, last_submission_at
  INTO v_last_id, v_last_time
  FROM adaptive_learning_state
  WHERE user_id = p_user_id AND topic_id = p_topic_id;
  
  -- If submission_id matches AND was within last 5 seconds, it's a duplicate
  IF v_last_id = p_submission_id AND v_last_time > NOW() - INTERVAL '5 seconds' THEN
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- ================================================================
-- FIX #7: Create function to clear pending on topic switch
-- Impact: Prevents wrong attempt_count on topic re-entry
-- ================================================================
CREATE OR REPLACE FUNCTION clear_all_pending_except(
  p_user_id UUID,
  p_keep_topic_id UUID
)
RETURNS INTEGER AS $$
DECLARE
  v_cleared_count INTEGER;
BEGIN
  UPDATE user_topic_progress
  SET 
    pending_question_id = NULL,
    pending_question_data = NULL,
    attempt_count = 0,
    hint_shown = FALSE,
    updated_at = NOW()
  WHERE user_id = p_user_id 
    AND topic_id != p_keep_topic_id
    AND pending_question_id IS NOT NULL;
  
  GET DIAGNOSTICS v_cleared_count = ROW_COUNT;
  RETURN v_cleared_count;
END;
$$ LANGUAGE plpgsql;

-- ================================================================
-- FIX #8: Add hint_shown timestamp for analytics
-- Impact: Enables tracking of hint effectiveness
-- ================================================================
ALTER TABLE user_topic_progress
  ADD COLUMN IF NOT EXISTS hint_shown_at TIMESTAMP WITH TIME ZONE;

-- ================================================================
-- FIX #9: Create cleanup function for orphaned pending questions
-- Impact: Removes pending questions older than 24 hours
-- ================================================================
CREATE OR REPLACE FUNCTION cleanup_orphaned_pending_questions()
RETURNS INTEGER AS $$
DECLARE
  v_cleaned_count INTEGER;
BEGIN
  UPDATE user_topic_progress
  SET 
    pending_question_id = NULL,
    pending_question_data = NULL,
    attempt_count = 0,
    hint_shown = FALSE,
    updated_at = NOW()
  WHERE pending_question_id IS NOT NULL
    AND updated_at < NOW() - INTERVAL '24 hours';
  
  GET DIAGNOSTICS v_cleaned_count = ROW_COUNT;
  RETURN v_cleaned_count;
END;
$$ LANGUAGE plpgsql;

-- ================================================================
-- FIX #10: Add monitoring view for stuck students
-- Impact: Teachers can see where students are struggling
-- ================================================================
CREATE OR REPLACE VIEW stuck_students_analysis AS
SELECT 
  utp.user_id,
  utp.topic_id,
  alt.topic_name,
  utp.attempt_count,
  utp.hint_shown,
  utp.hint_shown_at,
  utp.pending_question_data->>'questionType' as question_type,
  utp.pending_question_data->>'difficultyLevel' as difficulty_level,
  utp.updated_at as last_activity,
  EXTRACT(EPOCH FROM (NOW() - utp.updated_at)) / 60 as minutes_stuck
FROM user_topic_progress utp
JOIN adaptive_learning_topics alt ON utp.topic_id = alt.id
WHERE utp.pending_question_id IS NOT NULL
  AND utp.attempt_count >= 1
ORDER BY utp.attempt_count DESC, utp.updated_at ASC;

-- ================================================================
-- COMMENTS
-- ================================================================
COMMENT ON FUNCTION increment_attempt_count_atomic IS 'Thread-safe atomic increment of attempt_count (fixes race condition)';
COMMENT ON FUNCTION check_submission_duplicate IS 'Detects duplicate answer submissions within 5 seconds (idempotency)';
COMMENT ON FUNCTION clear_all_pending_except IS 'Clears pending questions for all topics except current (prevents stale state)';
COMMENT ON FUNCTION cleanup_orphaned_pending_questions IS 'Removes pending questions older than 24 hours (maintenance)';
COMMENT ON VIEW stuck_students_analysis IS 'Teacher dashboard: students stuck on questions with retry count and duration';
