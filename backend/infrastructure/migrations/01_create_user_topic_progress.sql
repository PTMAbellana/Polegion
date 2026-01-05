-- ================================================================
-- MIGRATION: User Topic Progress (Topic Unlocking System)
-- Created: January 5, 2026
-- Purpose: Track topic unlock status and mastery progression
-- ================================================================

-- Enable UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================================
-- Table: user_topic_progress
-- Tracks which topics are unlocked/mastered for each user
-- ================================================================
CREATE TABLE IF NOT EXISTS user_topic_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  topic_id UUID NOT NULL,
  
  -- Unlock/Mastery Status
  unlocked BOOLEAN DEFAULT FALSE,
  mastered BOOLEAN DEFAULT FALSE,
  
  -- Mastery Level (0-5 scale for UI display)
  -- 0 = Not started, 1-2 = Beginner, 3 = Proficient (unlocks next), 4 = Advanced, 5 = Mastered
  mastery_level INTEGER DEFAULT 0 CHECK (mastery_level BETWEEN 0 AND 5),
  
  -- Mastery Percentage (0-100, from adaptive_learning_state)
  mastery_percentage DECIMAL(5,2) DEFAULT 0.00 CHECK (mastery_percentage BETWEEN 0 AND 100),
  
  -- Timestamps
  unlocked_at TIMESTAMP WITH TIME ZONE,
  mastered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(user_id, topic_id)
);

-- ================================================================
-- FOREIGN KEY CONSTRAINTS (Add these after ensuring tables exist)
-- ================================================================
-- Add foreign key to users table if it exists and constraint doesn't exist
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'users') 
     AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_user_topic_progress_user') THEN
    ALTER TABLE user_topic_progress 
    ADD CONSTRAINT fk_user_topic_progress_user 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add foreign key to adaptive_learning_topics table if it exists and constraint doesn't exist
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'adaptive_learning_topics') 
     AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_user_topic_progress_topic') THEN
    ALTER TABLE user_topic_progress 
    ADD CONSTRAINT fk_user_topic_progress_topic 
    FOREIGN KEY (topic_id) REFERENCES adaptive_learning_topics(id) ON DELETE CASCADE;
  END IF;
END $$;

-- ================================================================
-- INDEXES
-- ================================================================
CREATE INDEX IF NOT EXISTS idx_user_topic_progress_user_id ON user_topic_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_topic_progress_topic_id ON user_topic_progress(topic_id);
CREATE INDEX IF NOT EXISTS idx_user_topic_progress_unlocked ON user_topic_progress(user_id, unlocked);
CREATE INDEX IF NOT EXISTS idx_user_topic_progress_mastered ON user_topic_progress(user_id, mastered);

-- ================================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================================
ALTER TABLE user_topic_progress ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS user_topic_progress_select_own ON user_topic_progress;
DROP POLICY IF EXISTS user_topic_progress_insert_own ON user_topic_progress;
DROP POLICY IF EXISTS user_topic_progress_update_own ON user_topic_progress;

-- Users can only see their own progress
CREATE POLICY user_topic_progress_select_own 
  ON user_topic_progress 
  FOR SELECT 
  USING (auth.uid()::uuid = user_id);

-- Users can insert their own progress
CREATE POLICY user_topic_progress_insert_own 
  ON user_topic_progress 
  FOR INSERT 
  WITH CHECK (auth.uid()::uuid = user_id);

-- Users can update their own progress
CREATE POLICY user_topic_progress_update_own 
  ON user_topic_progress 
  FOR UPDATE 
  USING (auth.uid()::uuid = user_id);

-- ================================================================
-- TRIGGER: Update updated_at timestamp
-- ================================================================
DROP TRIGGER IF EXISTS update_user_topic_progress_updated_at ON user_topic_progress;

CREATE OR REPLACE FUNCTION update_user_topic_progress_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_topic_progress_updated_at
  BEFORE UPDATE ON user_topic_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_user_topic_progress_timestamp();

-- ================================================================
-- SEED DATA: Unlock Topic 1 for all existing users
-- ================================================================
-- This ensures new users start with Topic 1 unlocked
-- Will be handled by application logic, but included here for reference

-- INSERT INTO user_topic_progress (user_id, topic_id, unlocked, mastery_level)
-- SELECT 
--   u.id as user_id,
--   (SELECT id FROM adaptive_learning_topics WHERE topic_name = 'Points and Lines' LIMIT 1) as topic_id,
--   TRUE as unlocked,
--   0 as mastery_level
-- FROM users u
-- ON CONFLICT (user_id, topic_id) DO NOTHING;

-- ================================================================
-- COMMENTS
-- ================================================================
COMMENT ON TABLE user_topic_progress IS 'Tracks topic unlock status and mastery progression for adaptive learning';
COMMENT ON COLUMN user_topic_progress.unlocked IS 'Whether this topic is accessible to the user';
COMMENT ON COLUMN user_topic_progress.mastered IS 'Whether user has achieved mastery (mastery_level >= 5)';
COMMENT ON COLUMN user_topic_progress.mastery_level IS 'Integer mastery level (0-5) for UI display';
COMMENT ON COLUMN user_topic_progress.mastery_percentage IS 'Percentage mastery (0-100) from adaptive_learning_state';
