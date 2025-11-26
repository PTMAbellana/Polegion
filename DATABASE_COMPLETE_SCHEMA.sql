-- =====================================================
-- POLEGION - COMPLETE DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- Last Updated: November 25, 2025
-- =====================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. CORE TABLES: CASTLES AND CHAPTERS
-- =====================================================

-- Castles table
CREATE TABLE IF NOT EXISTS castles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  region TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty = ANY (ARRAY['Easy'::text, 'Intermediate'::text, 'Hard'::text])),
  terrain TEXT NOT NULL CHECK (terrain = ANY (ARRAY['mountain'::text, 'forest'::text, 'desert'::text, 'coastal'::text, 'highland'::text, 'mystical'::text])),
  image_number INTEGER NOT NULL,
  total_xp INTEGER NOT NULL DEFAULT 0,
  unlock_order INTEGER NOT NULL,
  route TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chapters table
CREATE TABLE IF NOT EXISTS chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  castle_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  chapter_number INTEGER NOT NULL,
  xp_reward INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT chapters_castle_id_fkey FOREIGN KEY (castle_id) REFERENCES castles(id)
);

-- Chapter Quizzes table
CREATE TABLE IF NOT EXISTS chapter_quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  quiz_config JSONB,
  xp_reward INTEGER NOT NULL DEFAULT 0,
  passing_score INTEGER NOT NULL DEFAULT 70,
  time_limit INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT chapter_quizzes_chapter_id_fkey FOREIGN KEY (chapter_id) REFERENCES chapters(id)
);

-- Minigames table
CREATE TABLE IF NOT EXISTS minigames (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  game_type TEXT NOT NULL,
  game_config JSONB,
  xp_reward INTEGER NOT NULL DEFAULT 0,
  time_limit INTEGER,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT minigames_chapter_id_fkey FOREIGN KEY (chapter_id) REFERENCES chapters(id)
);

-- =====================================================
-- 2. ASSESSMENT TABLES (PRETEST/POSTTEST)
-- =====================================================

-- Assessment Questions table
CREATE TABLE IF NOT EXISTS assessment_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id VARCHAR NOT NULL UNIQUE,
  category VARCHAR NOT NULL CHECK (category IN ('Knowledge Recall', 'Concept Understanding', 'Procedural Skills', 'Analytical Thinking', 'Problem-Solving', 'Higher-Order Thinking')),
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer VARCHAR NOT NULL,
  difficulty VARCHAR NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  test_type VARCHAR NOT NULL CHECK (test_type IN ('pretest', 'posttest', 'both')),
  points INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Assessment Attempts table
CREATE TABLE IF NOT EXISTS user_assessment_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  test_type VARCHAR NOT NULL CHECK (test_type IN ('pretest', 'posttest')),
  question_id UUID NOT NULL,
  user_answer VARCHAR,
  is_correct BOOLEAN,
  points_earned INTEGER DEFAULT 0,
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT user_assessment_attempts_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT user_assessment_attempts_question_id_fkey FOREIGN KEY (question_id) REFERENCES assessment_questions(id),
  UNIQUE(user_id, test_type, question_id)
);

-- User Assessment Results table
CREATE TABLE IF NOT EXISTS user_assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  test_type VARCHAR NOT NULL CHECK (test_type IN ('pretest', 'posttest')),
  total_score INTEGER DEFAULT 0,
  max_score INTEGER DEFAULT 600,
  percentage NUMERIC,
  category_scores JSONB NOT NULL DEFAULT '{}'::jsonb,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER DEFAULT 0,
  CONSTRAINT user_assessment_results_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  UNIQUE(user_id, test_type)
);

-- =====================================================
-- 3. USER PROGRESS TABLES
-- =====================================================

-- User Castle Progress
CREATE TABLE IF NOT EXISTS user_castle_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  castle_id UUID NOT NULL,
  unlocked BOOLEAN DEFAULT FALSE,
  completed BOOLEAN DEFAULT FALSE,
  total_xp_earned INTEGER DEFAULT 0,
  completion_percentage INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT user_castle_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT user_castle_progress_castle_id_fkey FOREIGN KEY (castle_id) REFERENCES castles(id),
  UNIQUE(user_id, castle_id)
);

-- User Chapter Progress
CREATE TABLE IF NOT EXISTS user_chapter_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  chapter_id UUID NOT NULL,
  unlocked BOOLEAN DEFAULT FALSE,
  completed BOOLEAN DEFAULT FALSE,
  xp_earned INTEGER DEFAULT 0,
  quiz_passed BOOLEAN DEFAULT FALSE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT user_chapter_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT user_chapter_progress_chapter_id_fkey FOREIGN KEY (chapter_id) REFERENCES chapters(id),
  UNIQUE(user_id, chapter_id)
);

-- User Quiz Attempts
CREATE TABLE IF NOT EXISTS user_quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  chapter_quiz_id UUID NOT NULL,
  score INTEGER NOT NULL,
  passing_score INTEGER NOT NULL,
  passed BOOLEAN DEFAULT FALSE,
  xp_earned INTEGER DEFAULT 0,
  answers JSONB,
  time_taken INTEGER,
  attempt_number INTEGER DEFAULT 1,
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT user_quiz_attempts_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT user_quiz_attempts_chapter_quiz_id_fkey FOREIGN KEY (chapter_quiz_id) REFERENCES chapter_quizzes(id)
);

-- User Minigame Attempts
CREATE TABLE IF NOT EXISTS user_minigame_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  minigame_id UUID NOT NULL,
  score INTEGER,
  time_taken INTEGER,
  xp_earned INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  attempt_data JSONB,
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT user_minigame_attempts_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT user_minigame_attempts_minigame_id_fkey FOREIGN KEY (minigame_id) REFERENCES minigames(id)
);

-- =====================================================
-- 4. COMPETITION AND ROOMS TABLES
-- =====================================================

-- User Profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID,
  profile_pic TEXT DEFAULT 'https://uwllqanzveqanfpfnndu.supabase.co/storage/v1/object/public/profile-images/1751777126476.png',
  first_name TEXT DEFAULT 'John',
  last_name TEXT DEFAULT 'Doe',
  gender TEXT DEFAULT 'others',
  phone TEXT,
  role TEXT DEFAULT 'admin',
  CONSTRAINT user_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- Rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  banner_image TEXT,
  mantra TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  code TEXT UNIQUE,
  visibility VARCHAR NOT NULL DEFAULT 'private',
  CONSTRAINT rooms_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- Room Participants table
CREATE TABLE IF NOT EXISTS room_participants (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  room_id BIGINT NOT NULL,
  user_id UUID NOT NULL,
  CONSTRAINT room_participants_room_id_fkey FOREIGN KEY (room_id) REFERENCES rooms(id),
  CONSTRAINT room_participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- Problems table
CREATE TABLE IF NOT EXISTS problems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  room_id BIGINT,
  creator_id UUID NOT NULL,
  expected_solution JSONB,
  difficulty TEXT NOT NULL DEFAULT 'easy',
  visibility TEXT NOT NULL DEFAULT 'show',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE,
  max_attempts INTEGER DEFAULT 1,
  expected_xp INTEGER,
  hint TEXT,
  CONSTRAINT problems_room_id_fkey FOREIGN KEY (room_id) REFERENCES rooms(id),
  CONSTRAINT problems_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES auth.users(id)
);

-- Competitions table
CREATE TABLE IF NOT EXISTS competitions (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  room_id BIGINT NOT NULL,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'NEW',
  gameplay_indicator TEXT,
  current_problem_id BIGINT,
  current_problem_index INTEGER,
  timer_started_at TIMESTAMP WITH TIME ZONE,
  timer_duration INTEGER,
  timer_end_at TIMESTAMP WITH TIME ZONE,
  time_remaining INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT competitions_room_id_fkey FOREIGN KEY (room_id) REFERENCES rooms(id)
);

-- Competition Problems table
CREATE TABLE IF NOT EXISTS competition_problems (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  problem_id UUID,
  competition_id BIGINT,
  timer INTEGER,
  CONSTRAINT competition_problems_problem_id_fkey FOREIGN KEY (problem_id) REFERENCES problems(id),
  CONSTRAINT competition_problems_competition_id_fkey FOREIGN KEY (competition_id) REFERENCES competitions(id)
);

-- Add foreign key for competitions.current_problem_id
ALTER TABLE competitions
ADD CONSTRAINT competitions_current_problem_id_fkey 
FOREIGN KEY (current_problem_id) REFERENCES competition_problems(id);

-- Problem Attempts table
CREATE TABLE IF NOT EXISTS problem_attempts (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  attempted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  problem_id UUID,
  room_participant_id BIGINT,
  solution JSONB,
  xp_gained INTEGER,
  feedback TEXT,
  attempt_number INTEGER,
  CONSTRAINT problem_attempts_problem_id_fkey FOREIGN KEY (problem_id) REFERENCES problems(id),
  CONSTRAINT problem_attempts_room_participant_id_fkey FOREIGN KEY (room_participant_id) REFERENCES room_participants(id)
);

-- Competition Problem Attempts table
CREATE TABLE IF NOT EXISTS competition_problem_attempts (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  attempted_at TIMESTAMP WITH TIME ZONE NOT NULL,
  competition_problem_id BIGINT,
  solution JSONB,
  time_taken INTEGER,
  xp_gained INTEGER,
  feedback TEXT,
  room_participant_id BIGINT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc'),
  CONSTRAINT competition_problem_attempts_competition_problem_id_fkey FOREIGN KEY (competition_problem_id) REFERENCES competition_problems(id),
  CONSTRAINT competition_problem_attempts_room_participant_id_fkey FOREIGN KEY (room_participant_id) REFERENCES room_participants(id)
);

-- Room Leaderboards table
CREATE TABLE IF NOT EXISTS room_leaderboards (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  room_participant_id BIGINT,
  accumulated_xp INTEGER,
  room_id BIGINT,
  CONSTRAINT room_leaderboards_room_id_fkey FOREIGN KEY (room_id) REFERENCES rooms(id),
  CONSTRAINT room_leaderboards_room_participant_id_fkey FOREIGN KEY (room_participant_id) REFERENCES room_participants(id)
);

-- Competition Leaderboards table
CREATE TABLE IF NOT EXISTS competition_leaderboards (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  room_participant_id BIGINT,
  accumulated_xp INTEGER,
  competition_id BIGINT NOT NULL,
  CONSTRAINT competition_leaderboards_competition_id_fkey FOREIGN KEY (competition_id) REFERENCES competitions(id),
  CONSTRAINT competition_leaderboards_room_participant_id_fkey FOREIGN KEY (room_participant_id) REFERENCES room_participants(id)
);

-- XP Transactions table
CREATE TABLE IF NOT EXISTS xp_transactions (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  room_participant_id BIGINT,
  competition_problem_attempt_id BIGINT,
  competition_problem_attempt_xp_gained INTEGER,
  problem_attempt_id BIGINT,
  problem_attempt_xp_gained INTEGER,
  CONSTRAINT xp_transactions_competition_problem_attempt_id_fkey FOREIGN KEY (competition_problem_attempt_id) REFERENCES competition_problem_attempts(id)
);

-- =====================================================
-- 5. INDEXES FOR PERFORMANCE
-- =====================================================

-- =====================================================
-- 5. INDEXES FOR PERFORMANCE
-- =====================================================

-- Castle indexes
CREATE INDEX IF NOT EXISTS idx_castles_unlock_order ON castles(unlock_order);
CREATE INDEX IF NOT EXISTS idx_castles_route ON castles(route);

-- Chapter indexes
CREATE INDEX IF NOT EXISTS idx_chapters_castle_id ON chapters(castle_id);
CREATE INDEX IF NOT EXISTS idx_chapters_number ON chapters(castle_id, chapter_number);

-- Quiz indexes
CREATE INDEX IF NOT EXISTS idx_chapter_quizzes_chapter_id ON chapter_quizzes(chapter_id);

-- Minigame indexes
CREATE INDEX IF NOT EXISTS idx_minigames_chapter_id ON minigames(chapter_id);

-- Assessment indexes
CREATE INDEX IF NOT EXISTS idx_assessment_questions_category ON assessment_questions(category);
CREATE INDEX IF NOT EXISTS idx_assessment_questions_test_type ON assessment_questions(test_type);
CREATE INDEX IF NOT EXISTS idx_user_assessment_attempts_user_id ON user_assessment_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_assessment_attempts_test_type ON user_assessment_attempts(test_type);
CREATE INDEX IF NOT EXISTS idx_user_assessment_results_user_id ON user_assessment_results(user_id);
CREATE INDEX IF NOT EXISTS idx_user_assessment_results_test_type ON user_assessment_results(test_type);

-- User progress indexes
CREATE INDEX IF NOT EXISTS idx_user_castle_progress_user_id ON user_castle_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_castle_progress_castle_id ON user_castle_progress(castle_id);
CREATE INDEX IF NOT EXISTS idx_user_chapter_progress_user_id ON user_chapter_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_chapter_progress_chapter_id ON user_chapter_progress(chapter_id);

-- User attempt indexes
CREATE INDEX IF NOT EXISTS idx_user_quiz_attempts_user_id ON user_quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_quiz_attempts_quiz_id ON user_quiz_attempts(chapter_quiz_id);
CREATE INDEX IF NOT EXISTS idx_user_minigame_attempts_user_id ON user_minigame_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_minigame_attempts_minigame_id ON user_minigame_attempts(minigame_id);

-- Competition and room indexes
CREATE INDEX IF NOT EXISTS idx_rooms_user_id ON rooms(user_id);
CREATE INDEX IF NOT EXISTS idx_room_participants_room_id ON room_participants(room_id);
CREATE INDEX IF NOT EXISTS idx_room_participants_user_id ON room_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_problems_room_id ON problems(room_id);
CREATE INDEX IF NOT EXISTS idx_competitions_room_id ON competitions(room_id);

-- =====================================================
-- 6. SAMPLE DATA (CASTLES)
-- =====================================================

-- Insert sample castles (if not exists)
INSERT INTO castles (id, name, region, description, difficulty, terrain, image_number, total_xp, unlock_order, route)
VALUES 
  ('cd5ddb70-b4ba-46cb-85fd-d66e5735619f', 'The Euclidean Spire', 'Northern Plains', 'Master the foundations of geometry. Learn about points, lines, angles, and basic shapes.', 'Easy', 'mountain', 1, 500, 1, 'castle1')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- =====================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all user-related tables
ALTER TABLE user_castle_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_chapter_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_minigame_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_assessment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- User Castle Progress Policies
DROP POLICY IF EXISTS "Users can view their own castle progress" ON user_castle_progress;
CREATE POLICY "Users can view their own castle progress"
  ON user_castle_progress FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own castle progress" ON user_castle_progress;
CREATE POLICY "Users can update their own castle progress"
  ON user_castle_progress FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own castle progress" ON user_castle_progress;
CREATE POLICY "Users can insert their own castle progress"
  ON user_castle_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- User Chapter Progress Policies
DROP POLICY IF EXISTS "Users can view their own chapter progress" ON user_chapter_progress;
CREATE POLICY "Users can view their own chapter progress"
  ON user_chapter_progress FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own chapter progress" ON user_chapter_progress;
CREATE POLICY "Users can update their own chapter progress"
  ON user_chapter_progress FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own chapter progress" ON user_chapter_progress;
CREATE POLICY "Users can insert their own chapter progress"
  ON user_chapter_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- User Quiz Attempts Policies
DROP POLICY IF EXISTS "Users can view their own quiz attempts" ON user_quiz_attempts;
CREATE POLICY "Users can view their own quiz attempts"
  ON user_quiz_attempts FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own quiz attempts" ON user_quiz_attempts;
CREATE POLICY "Users can insert their own quiz attempts"
  ON user_quiz_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- User Minigame Attempts Policies
DROP POLICY IF EXISTS "Users can view their own minigame attempts" ON user_minigame_attempts;
CREATE POLICY "Users can view their own minigame attempts"
  ON user_minigame_attempts FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own minigame attempts" ON user_minigame_attempts;
CREATE POLICY "Users can insert their own minigame attempts"
  ON user_minigame_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- User Assessment Attempts Policies
DROP POLICY IF EXISTS "Users can view their own assessment attempts" ON user_assessment_attempts;
CREATE POLICY "Users can view their own assessment attempts"
  ON user_assessment_attempts FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own assessment attempts" ON user_assessment_attempts;
CREATE POLICY "Users can insert their own assessment attempts"
  ON user_assessment_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- User Assessment Results Policies
DROP POLICY IF EXISTS "Users can view their own assessment results" ON user_assessment_results;
CREATE POLICY "Users can view their own assessment results"
  ON user_assessment_results FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own assessment results" ON user_assessment_results;
CREATE POLICY "Users can insert their own assessment results"
  ON user_assessment_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- User Profiles Policies
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Public read access for castles, chapters, quizzes, minigames, and assessment questions
ALTER TABLE castles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapter_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE minigames ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view castles" ON castles;
CREATE POLICY "Anyone can view castles"
  ON castles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Anyone can view chapters" ON chapters;
CREATE POLICY "Anyone can view chapters"
  ON chapters FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Anyone can view quizzes" ON chapter_quizzes;
CREATE POLICY "Anyone can view quizzes"
  ON chapter_quizzes FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Anyone can view minigames" ON minigames;
CREATE POLICY "Anyone can view minigames"
  ON minigames FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Anyone can view assessment questions" ON assessment_questions;
CREATE POLICY "Anyone can view assessment questions"
  ON assessment_questions FOR SELECT
  USING (true);

-- =====================================================
-- 8. HELPER FUNCTIONS
-- =====================================================

-- Function to update castle completion percentage based on chapter progress
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

-- Trigger to update castle completion when chapter is completed
DROP TRIGGER IF EXISTS trigger_update_castle_completion ON user_chapter_progress;
CREATE TRIGGER trigger_update_castle_completion
  AFTER INSERT OR UPDATE ON user_chapter_progress
  FOR EACH ROW
  WHEN (NEW.completed = true)
  EXECUTE FUNCTION update_castle_completion();

-- =====================================================
-- 9. VERIFICATION QUERIES
-- =====================================================

-- =====================================================
-- 9. VERIFICATION QUERIES
-- =====================================================

-- Check if all tables exist
SELECT 
  table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'castles', 
    'chapters', 
    'chapter_quizzes', 
    'minigames',
    'assessment_questions',
    'user_assessment_attempts',
    'user_assessment_results',
    'user_castle_progress',
    'user_chapter_progress',
    'user_quiz_attempts',
    'user_minigame_attempts',
    'user_profiles',
    'rooms',
    'room_participants',
    'problems',
    'competitions',
    'competition_problems',
    'problem_attempts',
    'competition_problem_attempts',
    'room_leaderboards',
    'competition_leaderboards',
    'xp_transactions'
  )
ORDER BY table_name;

-- Check castle data
SELECT id, name, route, unlock_order FROM castles ORDER BY unlock_order;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Database schema created successfully!';
  RAISE NOTICE '📊 Includes: Castles, Chapters, Assessments, Progress Tracking, Competitions, and Rooms';
  RAISE NOTICE '🔐 Row Level Security (RLS) policies applied';
  RAISE NOTICE '📝 Run the Castle initialization endpoints to seed content';
END $$;
