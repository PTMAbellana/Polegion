// ============================================================================
// GENERATE SQL INSERT FILE FOR ASSESSMENT QUESTIONS
// ============================================================================
// Generates a SQL file with all 260 question INSERTs
// Usage: node infrastructure/seeds/generateAssessmentSQL.js

const fs = require('fs');
const path = require('path');

// Import all question files
const { knowledgeRecallQuestions } = require('./assessmentQuestions/knowledgeRecall');
const { conceptUnderstandingQuestions } = require('./assessmentQuestions/conceptUnderstanding');
const { proceduralSkillsQuestions } = require('./assessmentQuestions/proceduralSkills');
const { analyticalThinkingQuestions } = require('./assessmentQuestions/analyticalThinking');
const { problemSolvingQuestions } = require('./assessmentQuestions/problemSolving');
const { higherOrderThinkingQuestions } = require('./assessmentQuestions/higherOrderThinking');

// Helper function to format category names
function formatCategory(category) {
    const categoryMap = {
        'knowledge_recall': 'Knowledge Recall',
        'concept_understanding': 'Concept Understanding',
        'procedural_skills': 'Procedural Skills',
        'analytical_thinking': 'Analytical Thinking',
        'problem_solving': 'Problem-Solving',
        'higher_order_thinking': 'Higher-Order Thinking'
    };
    return categoryMap[category] || category;
}

// Escape single quotes for SQL
function escapeSQLString(str) {
    return str.replace(/'/g, "''");
}

function generateSQL() {
    console.log('📝 Generating SQL file for assessment questions...\n');

    // Combine all questions
    const allQuestions = [
        ...knowledgeRecallQuestions,
        ...conceptUnderstandingQuestions,
        ...proceduralSkillsQuestions,
        ...analyticalThinkingQuestions,
        ...problemSolvingQuestions,
        ...higherOrderThinkingQuestions
    ];

    console.log(`📊 Total questions: ${allQuestions.length}`);

    let sql = `-- =====================================================
-- ASSESSMENT QUESTIONS SEED
-- Generated: ${new Date().toISOString()}
-- Total Questions: ${allQuestions.length}
-- =====================================================

`;

    allQuestions.forEach((q, index) => {
        const category = formatCategory(q.category);
        const question = escapeSQLString(q.question);
        const options = JSON.stringify(q.options).replace(/'/g, "''");
        const correctAnswer = escapeSQLString(q.correctAnswer);

        sql += `-- Question ${index + 1}: ${q.id}
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    '${q.id}',
    '${category}',
    '${question}',
    '${options}'::jsonb,
    '${correctAnswer}',
    '${q.difficulty}',
    '${q.testType}',
    ${q.points}
)
ON CONFLICT (question_id) DO NOTHING;

`;
    });

    sql += `
-- =====================================================
-- VERIFICATION QUERY
-- =====================================================
SELECT 
    category, 
    test_type, 
    COUNT(*) as count 
FROM assessment_questions 
GROUP BY category, test_type 
ORDER BY category, test_type;
`;

    // Write to file
    const outputPath = path.join(__dirname, '../../../INSERT_ASSESSMENT_QUESTIONS.sql');
    fs.writeFileSync(outputPath, sql, 'utf8');

    console.log(`\n✅ SQL file generated successfully!`);
    console.log(`📁 Location: ${outputPath}`);
    console.log(`\n📌 Next steps:`);
    console.log(`   1. Open Supabase Dashboard → SQL Editor`);
    console.log(`   2. Copy contents of INSERT_ASSESSMENT_QUESTIONS.sql`);
    console.log(`   3. Paste and click "Run"`);
    console.log(`   4. Verify ${allQuestions.length} questions were inserted\n`);
}

generateSQL();
