// ============================================================================
// CREATE ASSESSMENT TABLES VIA SUPABASE CLIENT
// ============================================================================
// Creates the 3 assessment tables using direct INSERT operations
// Usage: node infrastructure/seeds/createAssessmentTablesV2.js

const supabase = require('../../config/supabase');

async function createAssessmentTables() {
    console.log('📋 Creating Assessment Database Tables...\n');

    try {
        // Since we can't execute DDL via Supabase JS client directly,
        // we'll use a workaround: query the schema to check if tables exist
        
        console.log('⚠️  Note: Supabase JS client cannot execute CREATE TABLE statements.');
        console.log('📝 Please run the following SQL in your Supabase SQL Editor:\n');
        console.log('=' .repeat(80));
        console.log(getTableCreationSQL());
        console.log('=' .repeat(80));
        
        console.log('\n📌 Steps:');
        console.log('   1. Open Supabase Dashboard → SQL Editor');
        console.log('   2. Copy the SQL above');
        console.log('   3. Paste and click "Run"');
        console.log('   4. Come back here and run: node infrastructure/seeds/seedAssessmentQuestions.js\n');

    } catch (error) {
        console.error('\n💥 Error:', error.message);
        process.exit(1);
    }
}

function getTableCreationSQL() {
    return `
-- Create assessment_questions table
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

CREATE INDEX IF NOT EXISTS idx_assessment_questions_category ON assessment_questions(category);
CREATE INDEX IF NOT EXISTS idx_assessment_questions_test_type ON assessment_questions(test_type);

-- Create user_assessment_attempts table
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

CREATE INDEX IF NOT EXISTS idx_user_assessment_attempts_user ON user_assessment_attempts(user_id);

-- Create user_assessment_results table
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

CREATE INDEX IF NOT EXISTS idx_user_assessment_results_user ON user_assessment_results(user_id);
`;
}

createAssessmentTables();
