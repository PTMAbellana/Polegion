-- Add time tracking columns to user_assessment_results table
-- Migration: Add started_at, ended_at, and duration_seconds

ALTER TABLE user_assessment_results
ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS ended_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS duration_seconds INTEGER DEFAULT 0;

-- Add index for time-based queries
CREATE INDEX IF NOT EXISTS idx_user_assessment_results_started_at 
ON user_assessment_results(started_at);

CREATE INDEX IF NOT EXISTS idx_user_assessment_results_duration 
ON user_assessment_results(duration_seconds);

-- Add comment for documentation
COMMENT ON COLUMN user_assessment_results.started_at IS 'Timestamp when user started the assessment';
COMMENT ON COLUMN user_assessment_results.ended_at IS 'Timestamp when user completed the assessment';
COMMENT ON COLUMN user_assessment_results.duration_seconds IS 'Total time taken to complete assessment in seconds';
