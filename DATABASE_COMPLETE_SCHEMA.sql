-- =====================================================
-- POLEGION - COMPLETE DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- =====================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. CASTLES AND CHAPTERS
-- =====================================================

-- Castles table
CREATE TABLE IF NOT EXISTS castles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  difficulty VARCHAR(50),
  region VARCHAR(100),
  route VARCHAR(100) NOT NULL UNIQUE,
  image_number INTEGER NOT NULL,
  total_xp INTEGER DEFAULT 0,
  unlock_order INTEGER NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Chapters table
CREATE TABLE IF NOT EXISTS chapters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  castle_id UUID NOT NULL REFERENCES castles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  chapter_number INTEGER NOT NULL,
  xp_reward INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(castle_id, chapter_number)
);

-- Chapter Quizzes table
CREATE TABLE IF NOT EXISTS chapter_quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  xp_reward INTEGER DEFAULT 0,
  passing_score INTEGER DEFAULT 70,
  time_limit INTEGER, -- in seconds, NULL for no limit
  quiz_config JSONB NOT NULL, -- stores questions, options, answers
  created_at TIMESTAMP DEFAULT NOW()
);

-- Minigames table
CREATE TABLE IF NOT EXISTS minigames (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  game_type VARCHAR(100) NOT NULL, -- 'interactive', 'puzzle', 'drag-drop', etc.
  xp_reward INTEGER DEFAULT 0,
  time_limit INTEGER, -- in seconds, NULL for no limit
  order_index INTEGER DEFAULT 1,
  game_config JSONB NOT NULL, -- stores game-specific data
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 2. USER PROGRESS TABLES
-- =====================================================

-- User Castle Progress
CREATE TABLE IF NOT EXISTS user_castle_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  castle_id UUID NOT NULL REFERENCES castles(id) ON DELETE CASCADE,
  unlocked BOOLEAN DEFAULT FALSE,
  completed BOOLEAN DEFAULT FALSE,
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  xp_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, castle_id)
);

-- User Chapter Progress
CREATE TABLE IF NOT EXISTS user_chapter_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  unlocked BOOLEAN DEFAULT FALSE,
  completed BOOLEAN DEFAULT FALSE,
  xp_earned INTEGER DEFAULT 0,
  lesson_completed BOOLEAN DEFAULT FALSE,
  minigame_completed BOOLEAN DEFAULT FALSE,
  quiz_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, chapter_id)
);

-- User Quiz Attempts
CREATE TABLE IF NOT EXISTS user_quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id UUID NOT NULL REFERENCES chapter_quizzes(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0,
  passed BOOLEAN DEFAULT FALSE,
  time_taken INTEGER, -- in seconds
  answers JSONB NOT NULL, -- stores user's answers
  created_at TIMESTAMP DEFAULT NOW()
);

-- User Minigame Attempts
CREATE TABLE IF NOT EXISTS user_minigame_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  minigame_id UUID NOT NULL REFERENCES minigames(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0,
  time_taken INTEGER, -- in seconds
  attempt_data JSONB, -- stores game-specific attempt data
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 3. INDEXES FOR PERFORMANCE
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

-- User progress indexes
CREATE INDEX IF NOT EXISTS idx_user_castle_progress_user_id ON user_castle_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_castle_progress_castle_id ON user_castle_progress(castle_id);
CREATE INDEX IF NOT EXISTS idx_user_chapter_progress_user_id ON user_chapter_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_chapter_progress_chapter_id ON user_chapter_progress(chapter_id);

-- User attempt indexes
CREATE INDEX IF NOT EXISTS idx_user_quiz_attempts_user_id ON user_quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_quiz_attempts_quiz_id ON user_quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_user_minigame_attempts_user_id ON user_minigame_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_minigame_attempts_minigame_id ON user_minigame_attempts(minigame_id);

-- =====================================================
-- 4. SAMPLE DATA (CASTLES)
-- =====================================================

-- Insert sample castles (if not exists)
INSERT INTO castles (id, name, description, difficulty, region, route, image_number, total_xp, unlock_order)
VALUES 
  ('cd5ddb70-b4ba-46cb-85fd-d66e5735619f', 'The Euclidean Spire', 'Master the foundations of geometry. Learn about points, lines, angles, and basic shapes.', 'Easy', 'Northern Plains', 'castle1', 1, 500, 1)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all user progress tables
ALTER TABLE user_castle_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_chapter_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_minigame_attempts ENABLE ROW LEVEL SECURITY;

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

-- Public read access for castles, chapters, quizzes, and minigames
ALTER TABLE castles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapter_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE minigames ENABLE ROW LEVEL SECURITY;

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

-- =====================================================
-- 6. HELPER FUNCTIONS
-- =====================================================

-- Function to update castle completion percentage based on chapter progress
CREATE OR REPLACE FUNCTION update_castle_completion()
RETURNS TRIGGER AS $$
DECLARE
  total_chapters INTEGER;
  completed_chapters INTEGER;
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

  -- Update castle progress
  UPDATE user_castle_progress
  SET 
    completion_percentage = CASE 
      WHEN total_chapters > 0 THEN (completed_chapters * 100 / total_chapters)
      ELSE 0
    END,
    completed = (completed_chapters = total_chapters),
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
-- 7. VERIFICATION QUERIES
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
    'user_castle_progress',
    'user_chapter_progress',
    'user_quiz_attempts',
    'user_minigame_attempts'
  )
ORDER BY table_name;

-- Check castle data
SELECT id, name, route, unlock_order FROM castles ORDER BY unlock_order;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Database schema created successfully!';
  RAISE NOTICE 'Run the Castle 1 initialization endpoint to seed chapters, quizzes, and minigames.';
END $$;
