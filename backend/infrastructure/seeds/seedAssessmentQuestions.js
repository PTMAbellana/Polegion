// ============================================================================
// SEED ASSESSMENT QUESTIONS
// ============================================================================
// Inserts all 240 assessment questions into the database
// Usage: node infrastructure/seeds/seedAssessmentQuestions.js

const supabase = require('../../config/supabase');

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

async function seedAssessmentQuestions() {
    console.log('📝 Starting Assessment Questions Seed...\n');

    try {
        // Combine all questions
        const allQuestions = [
            ...knowledgeRecallQuestions,
            ...conceptUnderstandingQuestions,
            ...proceduralSkillsQuestions,
            ...analyticalThinkingQuestions,
            ...problemSolvingQuestions,
            ...higherOrderThinkingQuestions
        ];

        console.log(`📊 Total questions to insert: ${allQuestions.length}`);
        console.log('   - Knowledge Recall: ' + knowledgeRecallQuestions.length);
        console.log('   - Concept Understanding: ' + conceptUnderstandingQuestions.length);
        console.log('   - Procedural Skills: ' + proceduralSkillsQuestions.length);
        console.log('   - Analytical Thinking: ' + analyticalThinkingQuestions.length);
        console.log('   - Problem-Solving: ' + problemSolvingQuestions.length);
        console.log('   - Higher-Order Thinking: ' + higherOrderThinkingQuestions.length);

        // Transform questions to match database schema
        const questionsForDB = allQuestions.map(q => ({
            question_id: q.id,
            category: formatCategory(q.category),
            question: q.question,
            options: JSON.stringify(q.options),
            correct_answer: q.correctAnswer,
            difficulty: q.difficulty,
            test_type: q.testType,
            points: q.points
        }));

        console.log('\n💾 Inserting questions into database...');
        
        // Debug: Try inserting just one question first
        console.log('\n🔍 Testing with first question:');
        console.log(JSON.stringify(questionsForDB[0], null, 2));

        // Insert in batches of 10 to avoid payload limits
        const batchSize = 10;
        let insertedCount = 0;

        for (let i = 0; i < questionsForDB.length; i += batchSize) {
            const batch = questionsForDB.slice(i, i + batchSize);
            
            const { data, error } = await supabase
                .from('assessment_questions')
                .insert(batch)
                .select();

            if (error) {
                console.error(`❌ Error inserting batch ${Math.floor(i / batchSize) + 1}:`, error);
                throw error;
            }

            insertedCount += batch.length;
            console.log(`   ✓ Inserted ${insertedCount}/${questionsForDB.length} questions`);
        }

        console.log(`\n✅ Successfully inserted all ${insertedCount} questions!\n`);

        // Verification
        console.log('🔍 Verifying data...');

        const { data: counts, error: countError } = await supabase
            .from('assessment_questions')
            .select('category, test_type', { count: 'exact' });

        if (countError) {
            console.error('⚠️  Could not verify counts:', countError);
        } else {
            const { count } = await supabase
                .from('assessment_questions')
                .select('*', { count: 'exact', head: true });

            console.log(`\n📊 Database now contains ${count} questions`);
        }

        // Count by category
        const categories = [
            'Knowledge Recall',
            'Concept Understanding',
            'Procedural Skills',
            'Analytical Thinking',
            'Problem-Solving',
            'Higher-Order Thinking'
        ];

        console.log('\n📈 Questions by category:');
        console.log('─'.repeat(60));

        for (const category of categories) {
            const { count } = await supabase
                .from('assessment_questions')
                .select('*', { count: 'exact', head: true })
                .eq('category', category);

            console.log(`   ${category.padEnd(30)} ${count} questions`);
        }

        console.log('─'.repeat(60));

        // Count by test type
        console.log('\n📋 Questions by test type:');
        console.log('─'.repeat(60));

        for (const testType of ['pretest', 'posttest']) {
            const { count } = await supabase
                .from('assessment_questions')
                .select('*', { count: 'exact', head: true })
                .eq('test_type', testType);

            console.log(`   ${testType.padEnd(30)} ${count} questions`);
        }

        console.log('─'.repeat(60));

        console.log('\n🎉 Assessment questions seed completed successfully!\n');
        console.log('📌 Next Steps:');
        console.log('   1. Build backend/application/services/AssessmentService.js');
        console.log('   2. Build backend/infrastructure/repository/AssessmentRepo.js');
        console.log('   3. Create backend/presentation/routes/assessment.js');
        console.log('   4. Connect frontend AssessmentPageBase to API endpoints\n');

    } catch (error) {
        console.error('\n💥 Seed failed:', error.message);
        console.error(error);
        process.exit(1);
    }
}

// Run the seed
seedAssessmentQuestions();
