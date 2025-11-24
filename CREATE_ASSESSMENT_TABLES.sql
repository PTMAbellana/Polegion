-- =====================================================
-- ASSESSMENT SYSTEM DATABASE TABLES
-- =====================================================
-- Creates 3 tables for Castle 0 (Pretest) and Castle 6 (Posttest)
-- Run this in Supabase SQL Editor
-- =====================================================

-- =====================================================
-- TABLE 1: assessment_questions
-- Stores all 240 assessment questions (120 pretest + 120 posttest)
-- =====================================================
CREATE TABLE IF NOT EXISTS assessment_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id VARCHAR(50) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN (
        'Knowledge Recall',
        'Concept Understanding',
        'Procedural Skills',
        'Analytical Thinking',
        'Problem-Solving',
        'Higher-Order Thinking'
    )),
    question TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_answer VARCHAR(255) NOT NULL,
    difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    test_type VARCHAR(20) NOT NULL CHECK (test_type IN ('pretest', 'posttest', 'both')),
    points INTEGER DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for faster querying
CREATE INDEX IF NOT EXISTS idx_assessment_questions_category ON assessment_questions(category);
CREATE INDEX IF NOT EXISTS idx_assessment_questions_test_type ON assessment_questions(test_type);
CREATE INDEX IF NOT EXISTS idx_assessment_questions_difficulty ON assessment_questions(difficulty);

COMMENT ON TABLE assessment_questions IS 'Stores all 240 assessment questions for pretest and posttest';
COMMENT ON COLUMN assessment_questions.category IS 'One of 6 categories: Knowledge Recall, Concept Understanding, Procedural Skills, Analytical Thinking, Problem-Solving, Higher-Order Thinking';
COMMENT ON COLUMN assessment_questions.test_type IS 'Which test(s) can use this question: pretest, posttest, or both';
COMMENT ON COLUMN assessment_questions.points IS 'Points awarded for correct answer (default: 10)';

-- =====================================================
-- TABLE 2: user_assessment_attempts
-- Tracks which questions were shown to each user and their answers
-- =====================================================
CREATE TABLE IF NOT EXISTS user_assessment_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    test_type VARCHAR(20) NOT NULL CHECK (test_type IN ('pretest', 'posttest')),
    question_id UUID NOT NULL REFERENCES assessment_questions(id) ON DELETE CASCADE,
    user_answer VARCHAR(255),
    is_correct BOOLEAN,
    points_earned INTEGER DEFAULT 0,
    answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, test_type, question_id)
);

-- Indexes for faster querying
CREATE INDEX IF NOT EXISTS idx_user_assessment_attempts_user ON user_assessment_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_assessment_attempts_test_type ON user_assessment_attempts(test_type);

COMMENT ON TABLE user_assessment_attempts IS 'Records each question shown to a user and their response';
COMMENT ON COLUMN user_assessment_attempts.user_answer IS 'The answer the user selected';
COMMENT ON COLUMN user_assessment_attempts.is_correct IS 'Whether the user answered correctly';
COMMENT ON COLUMN user_assessment_attempts.points_earned IS 'Points earned for this question (0 if incorrect)';

-- =====================================================
-- TABLE 3: user_assessment_results
-- Stores overall test results and category breakdown
-- =====================================================
CREATE TABLE IF NOT EXISTS user_assessment_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    test_type VARCHAR(20) NOT NULL CHECK (test_type IN ('pretest', 'posttest')),
    total_score INTEGER DEFAULT 0,
    max_score INTEGER DEFAULT 600,
    percentage DECIMAL(5,2),
    category_scores JSONB NOT NULL DEFAULT '{}'::jsonb,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, test_type)
);

-- Indexes for faster querying
CREATE INDEX IF NOT EXISTS idx_user_assessment_results_user ON user_assessment_results(user_id);
CREATE INDEX IF NOT EXISTS idx_user_assessment_results_test_type ON user_assessment_results(test_type);

COMMENT ON TABLE user_assessment_results IS 'Stores final scores and category breakdown for each user assessment';
COMMENT ON COLUMN user_assessment_results.total_score IS 'Total points earned (out of 600)';
COMMENT ON COLUMN user_assessment_results.max_score IS 'Maximum possible score (600 points: 60 questions × 10 points)';
COMMENT ON COLUMN user_assessment_results.percentage IS 'Score as percentage (total_score / max_score * 100)';
COMMENT ON COLUMN user_assessment_results.category_scores IS 'JSON object with score breakdown per category. Example: {"Knowledge Recall": {"score": 80, "max": 100}, ...}';

-- =====================================================
-- VERIFICATION QUERY
-- Run this after creating tables to confirm success
-- =====================================================
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_name IN ('assessment_questions', 'user_assessment_attempts', 'user_assessment_results')
ORDER BY table_name;

-- Expected output:
-- assessment_questions        | 10 columns
-- user_assessment_attempts    | 8 columns  
-- user_assessment_results     | 8 columns
