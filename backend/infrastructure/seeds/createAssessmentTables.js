// ============================================================================
// CREATE ASSESSMENT TABLES
// ============================================================================
// Creates 3 tables needed for the assessment system:
// 1. assessment_questions - Stores all 240 questions
// 2. user_assessment_attempts - Tracks which questions were shown to each user
// 3. user_assessment_results - Stores test scores and category breakdown
//
// Usage: node infrastructure/seeds/createAssessmentTables.js

const supabase = require('../../config/supabase');

async function createAssessmentTables() {
    console.log('📋 Creating Assessment Database Tables...\n');

    try {
        // ================================================================
        // TABLE 1: assessment_questions
        // ================================================================
        console.log('1️⃣  Creating assessment_questions table...');
        
        const { error: questionsTableError } = await supabase.rpc('exec_sql', {
            sql: `
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
                CREATE INDEX IF NOT EXISTS idx_assessment_questions_difficulty ON assessment_questions(difficulty);
            `
        });

        if (questionsTableError) {
            console.error('❌ Error creating assessment_questions:', questionsTableError);
            throw questionsTableError;
        }

        console.log('✅ assessment_questions table created!\n');

        // ================================================================
        // TABLE 2: user_assessment_attempts
        // ================================================================
        console.log('2️⃣  Creating user_assessment_attempts table...');

        const { error: attemptsTableError } = await supabase.rpc('exec_sql', {
            sql: `
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
                CREATE INDEX IF NOT EXISTS idx_user_assessment_attempts_test_type ON user_assessment_attempts(test_type);
            `
        });

        if (attemptsTableError) {
            console.error('❌ Error creating user_assessment_attempts:', attemptsTableError);
            throw attemptsTableError;
        }

        console.log('✅ user_assessment_attempts table created!\n');

        // ================================================================
        // TABLE 3: user_assessment_results
        // ================================================================
        console.log('3️⃣  Creating user_assessment_results table...');

        const { error: resultsTableError } = await supabase.rpc('exec_sql', {
            sql: `
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
                CREATE INDEX IF NOT EXISTS idx_user_assessment_results_test_type ON user_assessment_results(test_type);
            `
        });

        if (resultsTableError) {
            console.error('❌ Error creating user_assessment_results:', resultsTableError);
            throw resultsTableError;
        }

        console.log('✅ user_assessment_results table created!\n');

        // ================================================================
        // Verification
        // ================================================================
        console.log('🔍 Verifying tables...');

        const { data: tables, error: verifyError } = await supabase.rpc('exec_sql', {
            sql: `
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name LIKE '%assessment%'
                ORDER BY table_name;
            `
        });

        if (verifyError) {
            console.error('⚠️  Could not verify tables (they may still exist)');
        } else if (tables) {
            console.log('\n📊 Assessment Tables Created:');
            console.log('─'.repeat(50));
            tables.forEach(t => console.log(`   ✓ ${t.table_name}`));
            console.log('─'.repeat(50));
        }

        console.log('\n🎉 All assessment tables created successfully!\n');
        console.log('📌 Next Steps:');
        console.log('   1. Run seedAssessmentQuestions.js to insert 240 questions');
        console.log('   2. Build backend AssessmentService');
        console.log('   3. Build backend AssessmentRepo');
        console.log('   4. Create API endpoints\n');

    } catch (error) {
        console.error('\n💥 Table creation failed:', error.message);
        console.log('\n💡 Alternative: Run this SQL manually in Supabase SQL Editor:');
        console.log('\n' + getManualSQL());
        process.exit(1);
    }
}

function getManualSQL() {
    return `
-- =====================================================
-- ASSESSMENT TABLES - Run this in Supabase SQL Editor
-- =====================================================

-- Table 1: assessment_questions
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
CREATE INDEX IF NOT EXISTS idx_assessment_questions_difficulty ON assessment_questions(difficulty);

-- Table 2: user_assessment_attempts
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
CREATE INDEX IF NOT EXISTS idx_user_assessment_attempts_test_type ON user_assessment_attempts(test_type);

-- Table 3: user_assessment_results
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
CREATE INDEX IF NOT EXISTS idx_user_assessment_results_test_type ON user_assessment_results(test_type);
`;
}

// Run the creation
createAssessmentTables();
