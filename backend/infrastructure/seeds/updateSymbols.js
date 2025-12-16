// Update assessment questions with corrected geometric symbols
const supabase = require('../../config/supabase');

async function updateSymbols() {
    console.log('🔄 Updating assessment questions with corrected symbols...\n');

    const updates = [
        {
            question_id: 'ps_pre_01',
            options: JSON.stringify(['AB→', 'AB↔', 'A̅B̅', 'Ray AB']),
            correct_answer: 'A̅B̅'
        },
        {
            question_id: 'ps_pre_05',
            options: JSON.stringify(['A̅B̅', 'AB→', 'AB↔', 'Point A']),
            correct_answer: 'AB→'
        },
        {
            question_id: 'ps_post_01',
            options: JSON.stringify(['M̅N̅', 'MN→', 'MN↔', 'Ray MN']),
            correct_answer: 'MN↔'
        },
        {
            question_id: 'ps_post_05',
            options: JSON.stringify(['C̅D̅', 'CD↔', 'CD→', 'D̅C̅']),
            correct_answer: 'CD→'
        }
    ];

    try {
        for (const update of updates) {
            const { error } = await supabase
                .from('assessment_questions')
                .update({
                    options: update.options,
                    correct_answer: update.correct_answer
                })
                .eq('question_id', update.question_id);

            if (error) {
                console.error(`❌ Error updating ${update.question_id}:`, error);
            } else {
                console.log(`✅ Updated ${update.question_id}`);
            }
        }

        console.log('\n🎉 All symbols updated successfully!');
        console.log('\n📝 Updated questions:');
        console.log('   - ps_pre_01: Line segment notation (A̅B̅)');
        console.log('   - ps_pre_05: Ray notation (AB→)');
        console.log('   - ps_post_01: Line notation (MN↔)');
        console.log('   - ps_post_05: Ray notation (CD→)');
        console.log('\n✨ The database now has proper mathematical notation!\n');

    } catch (error) {
        console.error('\n💥 Update failed:', error.message);
        process.exit(1);
    }
}

updateSymbols();
