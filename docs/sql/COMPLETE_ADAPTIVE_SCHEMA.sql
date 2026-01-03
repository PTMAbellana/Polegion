-- ================================================================
-- COMPLETE ADAPTIVE LEARNING SCHEMA (Standalone)
-- Creates everything needed from scratch
-- Run this ENTIRE script in Supabase SQL Editor
-- ================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================================
-- CORE TABLES (Minimal for Adaptive Learning Demo)
-- ================================================================

-- Users table (simple version)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'student',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chapters table (geometry topics)
CREATE TABLE IF NOT EXISTS chapters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  order_index INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================================
-- ADAPTIVE LEARNING TABLES
-- ================================================================

-- Student difficulty tracking
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

-- MDP state transitions (for research)
CREATE TABLE IF NOT EXISTS mdp_state_transitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES chapters(id),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Previous state
  prev_mastery_level DECIMAL(5,2),
  prev_difficulty INTEGER,
  prev_correct_streak INTEGER,
  prev_wrong_streak INTEGER,
  prev_total_attempts INTEGER,
  
  -- Action taken
  action VARCHAR(50) NOT NULL,
  action_reason TEXT,
  
  -- New state
  new_mastery_level DECIMAL(5,2),
  new_difficulty INTEGER,
  new_correct_streak INTEGER,
  new_wrong_streak INTEGER,
  new_total_attempts INTEGER,
  
  -- Reward
  reward DECIMAL(5,2),
  
  -- Question details
  question_id VARCHAR(255),  -- Can be generated question ID
  was_correct BOOLEAN,
  time_spent_seconds INTEGER,
  
  -- Q-Learning metadata
  epsilon DECIMAL(5,3),
  q_value_before DECIMAL(10,2),
  q_value_after DECIMAL(10,2),
  used_exploration BOOLEAN,
  
  -- Session
  session_id UUID,
  metadata JSONB
);

-- ================================================================
-- INDEXES FOR PERFORMANCE
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

-- ================================================================
-- SEED DEMO DATA
-- ================================================================

-- Insert test user
INSERT INTO users (id, email, name, role) VALUES 
  ('00000000-0000-0000-0000-000000000001', 'student@test.com', 'Test Student', 'student'),
  ('00000000-0000-0000-0000-000000000002', 'demo@test.com', 'Demo Student', 'student')
ON CONFLICT (email) DO NOTHING;

-- Insert sample chapters
INSERT INTO chapters (id, title, description, order_index) VALUES
  ('10000000-0000-0000-0000-000000000001', 'Basic Shapes', 'Rectangles, squares, circles', 1),
  ('10000000-0000-0000-0000-000000000002', 'Area & Perimeter', 'Calculate area and perimeter', 2),
  ('10000000-0000-0000-0000-000000000003', 'Triangles', 'Triangle properties and calculations', 3),
  ('10000000-0000-0000-0000-000000000004', 'Advanced Geometry', 'Complex shapes and problems', 4)
ON CONFLICT (id) DO NOTHING;

-- ================================================================
-- HELPER VIEWS
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
-- HELPER FUNCTIONS
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
  IF p_total_attempts = 0 THEN
    RETURN 0;
  END IF;
  
  base_mastery := (p_correct_answers::DECIMAL / p_total_attempts) * 100;
  streak_bonus := LEAST(p_correct_streak * 3, 15);
  streak_penalty := LEAST(p_wrong_streak * 3, 15);
  
  RETURN GREATEST(0, LEAST(100, base_mastery + streak_bonus - streak_penalty));
END;
$$ LANGUAGE plpgsql;

-- ================================================================
-- SUCCESS MESSAGE
-- ================================================================
DO $$
BEGIN
  RAISE NOTICE '✅ COMPLETE ADAPTIVE LEARNING DATABASE CREATED!';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Tables Created:';
  RAISE NOTICE '   - users (2 test users)';
  RAISE NOTICE '   - chapters (4 geometry chapters)';
  RAISE NOTICE '   - student_difficulty_levels';
  RAISE NOTICE '   - mdp_state_transitions';
  RAISE NOTICE '';
  RAISE NOTICE '👥 Test Users:';
  RAISE NOTICE '   - student@test.com';
  RAISE NOTICE '   - demo@test.com';
  RAISE NOTICE '';
  RAISE NOTICE '📚 Chapters:';
  RAISE NOTICE '   1. Basic Shapes';
  RAISE NOTICE '   2. Area & Perimeter';
  RAISE NOTICE '   3. Triangles';
  RAISE NOTICE '   4. Advanced Geometry';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Ready to start backend server!';
END $$;
