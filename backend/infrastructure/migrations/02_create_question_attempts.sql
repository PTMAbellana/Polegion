-- ================================================================
-- MIGRATION: Question Attempts Tracking
-- Created: January 5, 2026
-- Purpose: Track question attempts to prevent infinite loops and ensure uniqueness
-- ================================================================

-- Enable UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================================
-- DROP EXISTING TABLES (Fresh start to avoid conflicts)
-- ================================================================
DROP TABLE IF EXISTS question_attempts CASCADE;
DROP TABLE IF EXISTS user_session_questions CASCADE;

-- ================================================================
-- Table: question_attempts
-- Tracks how many times a user has attempted each question
-- Prevents showing same question repeatedly, enables "try again" logic
-- ================================================================
CREATE TABLE question_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  
  -- Question identifier (can be parametric template ID or AI-generated question hash)
  question_id VARCHAR(255) NOT NULL,
  
  -- Topic context
  topic_id UUID,
  
  -- Attempt tracking
  attempts INTEGER DEFAULT 1,
  
  -- Success tracking
  is_correct BOOLEAN,
  answered_correctly_ever BOOLEAN DEFAULT FALSE,
  
  -- Session tracking (to differentiate same question in different sessions)
  session_id UUID,
  current_session_attempts INTEGER DEFAULT 1,
  
  -- Timestamps
  first_attempt_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_attempt_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Metadata (store question params, answer history, etc.)
  question_metadata JSONB,
  
  -- Constraints
  UNIQUE(user_id, question_id, session_id)
);

-- ================================================================
-- Table: user_session_questions (Session-level tracking)
-- Tracks all questions shown in current session to prevent immediate repeats
-- NOTE: Renamed from user_question_history to avoid conflict with existing table
-- ================================================================
CREATE TABLE user_session_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  topic_id UUID,
  
  -- Question details
  question_id VARCHAR(255) NOT NULL,
  question_type VARCHAR(100), -- e.g., "perimeter_rectangle", "area_triangle"
  difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),
  
  -- Result
  is_correct BOOLEAN,
  
  -- Session tracking
  session_id UUID,
  
  -- Timestamps
  shown_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Metadata (store full question for "similar question" generation)
  question_data JSONB
);

-- ================================================================
-- INDEXES
-- ================================================================
CREATE INDEX idx_question_attempts_user_id ON question_attempts(user_id);
CREATE INDEX idx_question_attempts_question_id ON question_attempts(question_id);
CREATE INDEX idx_question_attempts_topic_id ON question_attempts(topic_id);
CREATE INDEX idx_question_attempts_session ON question_attempts(user_id, session_id);
CREATE INDEX idx_question_attempts_last_attempt ON question_attempts(last_attempt_at);

-- ================================================================
-- INDEXES FOR user_session_questions
-- ================================================================
CREATE INDEX idx_user_session_questions_user_topic ON user_session_questions(user_id, topic_id);
CREATE INDEX idx_user_session_questions_session ON user_session_questions(session_id);
CREATE INDEX idx_user_session_questions_shown_at ON user_session_questions(shown_at);
CREATE INDEX idx_user_session_questions_question_type ON user_session_questions(user_id, topic_id, question_type);

-- ================================================================
-- FOREIGN KEY CONSTRAINTS
-- ================================================================
-- Add foreign key to users table for question_attempts
ALTER TABLE question_attempts 
ADD CONSTRAINT fk_question_attempts_user 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add foreign key to adaptive_learning_topics for question_attempts if it exists
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'adaptive_learning_topics') THEN
    ALTER TABLE question_attempts 
    ADD CONSTRAINT fk_question_attempts_topic 
    FOREIGN KEY (topic_id) REFERENCES adaptive_learning_topics(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add foreign key to users table for user_session_questions
ALTER TABLE user_session_questions 
ADD CONSTRAINT fk_user_session_questions_user 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add foreign key to adaptive_learning_topics for user_session_questions if it exists
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'adaptive_learning_topics') THEN
    ALTER TABLE user_session_questions 
    ADD CONSTRAINT fk_user_session_questions_topic 
    FOREIGN KEY (topic_id) REFERENCES adaptive_learning_topics(id) ON DELETE CASCADE;
  END IF;
END $$;

-- ================================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================================
ALTER TABLE question_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_session_questions ENABLE ROW LEVEL SECURITY;

-- Users can only see their own attempts
CREATE POLICY question_attempts_select_own 
  ON question_attempts 
  FOR SELECT 
  USING (auth.uid()::uuid = user_id);

CREATE POLICY question_attempts_insert_own 
  ON question_attempts 
  FOR INSERT 
  WITH CHECK (auth.uid()::uuid = user_id);

CREATE POLICY question_attempts_update_own 
  ON question_attempts 
  FOR UPDATE 
  USING (auth.uid()::uuid = user_id);

-- Users can only see their own session questions
CREATE POLICY user_session_questions_select_own 
  ON user_session_questions 
  FOR SELECT 
  USING (auth.uid()::uuid = user_id);

CREATE POLICY user_session_questions_insert_own 
  ON user_session_questions 
  FOR INSERT 
  WITH CHECK (auth.uid()::uuid = user_id);

-- ================================================================
-- TRIGGERS: Update timestamps
-- ================================================================
CREATE OR REPLACE FUNCTION update_question_attempts_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  NEW.last_attempt_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_question_attempts_updated_at
  BEFORE UPDATE ON question_attempts
  FOR EACH ROW
  EXECUTE FUNCTION update_question_attempts_timestamp();

-- ================================================================
-- FUNCTION: Clean old session data (for maintenance)
-- ================================================================
CREATE OR REPLACE FUNCTION cleanup_old_question_history()
RETURNS void AS $$
BEGIN
  -- Delete session questions older than 7 days
  DELETE FROM user_session_questions
  WHERE shown_at < NOW() - INTERVAL '7 days';
  
  -- Delete question attempts with no recent activity (30 days)
  DELETE FROM question_attempts
  WHERE last_attempt_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- ================================================================
-- COMMENTS
-- ================================================================
COMMENT ON TABLE question_attempts IS 'Tracks question attempts per user to prevent infinite retry loops';
COMMENT ON TABLE user_session_questions IS 'Session-level history to prevent immediate question repeats';
COMMENT ON COLUMN question_attempts.attempts IS 'Total number of times user has seen this question';
COMMENT ON COLUMN question_attempts.current_session_attempts IS 'Attempts in current session only';
COMMENT ON COLUMN user_session_questions.question_type IS 'Template type for similar question generation';
