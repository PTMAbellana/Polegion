-- Adaptive Learning Database Schema
-- For MDP-based difficulty adjustment research
-- Created: December 23, 2025

-- ================================================================
-- Table 1: Student Difficulty Levels
-- Tracks current difficulty level per student per chapter
-- ================================================================
CREATE TABLE IF NOT EXISTS student_difficulty_levels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  difficulty_level INTEGER DEFAULT 3 CHECK (difficulty_level BETWEEN 1 AND 5),
  mastery_level DECIMAL(5,2) DEFAULT 0.00 CHECK (mastery_level BETWEEN 0 AND 100),
  correct_streak INTEGER DEFAULT 0,
  wrong_streak INTEGER DEFAULT 0,
  total_attempts INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, chapter_id)
);

-- ================================================================
-- Table 2: MDP State Transitions
-- Logs every decision made by the adaptive system for research analysis
-- ================================================================
CREATE TABLE IF NOT EXISTS mdp_state_transitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES chapters(id),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- State BEFORE action
  prev_mastery_level DECIMAL(5,2),
  prev_difficulty INTEGER,
  prev_correct_streak INTEGER,
  prev_wrong_streak INTEGER,
  prev_total_attempts INTEGER,
  
  -- Action taken by system
  action VARCHAR(50) NOT NULL,
  action_reason TEXT,
  
  -- State AFTER action
  new_mastery_level DECIMAL(5,2),
  new_difficulty INTEGER,
  new_correct_streak INTEGER,
  new_wrong_streak INTEGER,
  new_total_attempts INTEGER,
  
  -- Reward calculation
  reward DECIMAL(5,2),
  
  -- Question details
  question_id UUID,
  was_correct BOOLEAN,
  time_spent_seconds INTEGER,
  
  -- Metadata
  session_id UUID,
  metadata JSONB
);

-- ================================================================
-- Add difficulty_level to questions table
-- ================================================================
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS difficulty_level INTEGER DEFAULT 3 CHECK (difficulty_level BETWEEN 1 AND 5);

-- ================================================================
-- Add difficulty_level to chapter_quiz_questions table
-- ================================================================
ALTER TABLE chapter_quiz_questions 
ADD COLUMN IF NOT EXISTS difficulty_level INTEGER DEFAULT 3 CHECK (difficulty_level BETWEEN 1 AND 5);

-- ================================================================
-- Performance Indexes
-- ================================================================
CREATE INDEX IF NOT EXISTS idx_student_difficulty_user_chapter 
ON student_difficulty_levels(user_id, chapter_id);

CREATE INDEX IF NOT EXISTS idx_student_difficulty_updated 
ON student_difficulty_levels(updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_mdp_transitions_user 
ON mdp_state_transitions(user_id, timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_mdp_transitions_chapter 
ON mdp_state_transitions(chapter_id, timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_mdp_transitions_action 
ON mdp_state_transitions(action);

CREATE INDEX IF NOT EXISTS idx_questions_difficulty 
ON questions(chapter_id, difficulty_level);

CREATE INDEX IF NOT EXISTS idx_quiz_questions_difficulty 
ON chapter_quiz_questions(chapter_quiz_id, difficulty_level);

-- ================================================================
-- Seed Initial Difficulty Levels for Existing Questions
-- ================================================================
-- Randomly assign difficulty levels 1-5 to existing questions
-- You can update this manually based on actual question difficulty
UPDATE questions 
SET difficulty_level = (FLOOR(RANDOM() * 5) + 1)::INTEGER
WHERE difficulty_level IS NULL;

UPDATE chapter_quiz_questions 
SET difficulty_level = (FLOOR(RANDOM() * 5) + 1)::INTEGER
WHERE difficulty_level IS NULL;

-- ================================================================
-- Helper View: Current Student Performance
-- ================================================================
CREATE OR REPLACE VIEW student_performance_summary AS
SELECT 
  sdl.user_id,
  sdl.chapter_id,
  u.email as student_email,
  c.title as chapter_title,
  sdl.difficulty_level,
  sdl.mastery_level,
  sdl.correct_streak,
  sdl.wrong_streak,
  sdl.total_attempts,
  sdl.correct_answers,
  CASE 
    WHEN sdl.total_attempts > 0 THEN (sdl.correct_answers::DECIMAL / sdl.total_attempts * 100)
    ELSE 0 
  END as accuracy_percentage,
  sdl.updated_at as last_activity
FROM student_difficulty_levels sdl
JOIN users u ON sdl.user_id = u.id
JOIN chapters c ON sdl.chapter_id = c.id
ORDER BY sdl.updated_at DESC;

-- ================================================================
-- Helper Function: Calculate Mastery Level
-- ================================================================
CREATE OR REPLACE FUNCTION calculate_mastery_level(
  p_correct_answers INTEGER,
  p_total_attempts INTEGER,
  p_correct_streak INTEGER,
  p_wrong_streak INTEGER
) RETURNS DECIMAL AS $$
DECLARE
  base_mastery DECIMAL;
  streak_bonus DECIMAL;
  streak_penalty DECIMAL;
BEGIN
  -- Base mastery from accuracy
  IF p_total_attempts = 0 THEN
    RETURN 0;
  END IF;
  
  base_mastery := (p_correct_answers::DECIMAL / p_total_attempts) * 100;
  
  -- Bonus for correct streak (up to +15)
  streak_bonus := LEAST(p_correct_streak * 3, 15);
  
  -- Penalty for wrong streak (up to -15)
  streak_penalty := LEAST(p_wrong_streak * 3, 15);
  
  -- Combined mastery
  RETURN GREATEST(0, LEAST(100, base_mastery + streak_bonus - streak_penalty));
END;
$$ LANGUAGE plpgsql;

-- ================================================================
-- Success Message
-- ================================================================
DO $$
BEGIN
  RAISE NOTICE '✅ Adaptive Learning Schema Created Successfully!';
  RAISE NOTICE '📊 Tables: student_difficulty_levels, mdp_state_transitions';
  RAISE NOTICE '🔍 View: student_performance_summary';
  RAISE NOTICE '⚡ Function: calculate_mastery_level()';
  RAISE NOTICE '📈 Indexes created for performance';
  RAISE NOTICE '🎯 Questions seeded with random difficulty levels';
END $$;
