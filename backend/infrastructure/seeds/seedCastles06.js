// ============================================================================
// SEED SCRIPT: Castle 0 (Pretest) and Castle 6 (Posttest)
// ============================================================================
// Run this script to add the assessment castles to your database
// Usage: node infrastructure/seeds/seedCastles06.js

const supabase = require('../../config/supabase');

// Castle 0 and Castle 6 data
const castlesData = [
    {
        id: 'a0b1c2d3-0000-4000-a000-000000000000',
        name: 'The Trial Grounds',
        region: 'The Entrance',
        description: 'Prove your worth before embarking on your geometric journey. Take the assessment to help us understand your current knowledge.',
        difficulty: 'Easy',
        terrain: 'mystical',
        image_number: 0,
        total_xp: 0,
        unlock_order: 0,
        route: 'castle0'
    },
    {
        id: 'a0b1c2d3-0006-4000-a000-000000000006',
        name: 'The Grand Championship',
        region: 'The Arena of Champions',
        description: 'You have conquered all five kingdoms! Now prove your mastery in the Grand Championship and see how much you have grown.',
        difficulty: 'Hard',
        terrain: 'mystical',
        image_number: 6,
        total_xp: 0,
        unlock_order: 6,
        route: 'castle6'
    }
];

// Chapters for Castle 0 and Castle 6
const chaptersData = [
    {
        id: 'a0b1c2d3-0000-4001-a001-000000000001',
        castle_id: 'a0b1c2d3-0000-4000-a000-000000000000',
        title: "The Guardian's Assessment",
        description: "Answer the Guardian's questions to begin your journey through the Kingdom of Geometry.",
        chapter_number: 1,
        xp_reward: 0
    },
    {
        id: 'a0b1c2d3-0006-4001-a001-000000000001',
        castle_id: 'a0b1c2d3-0006-4000-a000-000000000006',
        title: 'The Championship Challenge',
        description: 'Face the final challenge and demonstrate all you have learned on your geometric adventure!',
        chapter_number: 1,
        xp_reward: 0
    }
];

async function seedCastles06() {
    console.log('🏰 Starting Castle 0 & Castle 6 Seed...\n');

    try {
        // ================================================================
        // STEP 1: Insert Castles
        // ================================================================
        console.log('📦 Inserting castles...');
        
        const { data: castlesInserted, error: castlesError } = await supabase
            .from('castles')
            .upsert(castlesData, { 
                onConflict: 'id',
                ignoreDuplicates: false 
            })
            .select();

        if (castlesError) {
            console.error('❌ Error inserting castles:', castlesError);
            throw castlesError;
        }

        console.log(`✅ Inserted ${castlesData.length} castles successfully!`);
        castlesData.forEach(castle => {
            console.log(`   - ${castle.name} (unlock_order: ${castle.unlock_order})`);
        });

        // ================================================================
        // STEP 2: Insert Chapters
        // ================================================================
        console.log('\n📖 Inserting chapters...');

        const { data: chaptersInserted, error: chaptersError } = await supabase
            .from('chapters')
            .upsert(chaptersData, { 
                onConflict: 'id',
                ignoreDuplicates: false 
            })
            .select();

        if (chaptersError) {
            console.error('❌ Error inserting chapters:', chaptersError);
            throw chaptersError;
        }

        console.log(`✅ Inserted ${chaptersData.length} chapters successfully!`);
        chaptersData.forEach(chapter => {
            console.log(`   - ${chapter.title}`);
        });

        // ================================================================
        // STEP 3: Verification - Fetch all castles
        // ================================================================
        console.log('\n🔍 Verifying castle data...');

        const { data: allCastles, error: fetchError } = await supabase
            .from('castles')
            .select('id, name, route, unlock_order, region, difficulty, image_number')
            .order('unlock_order', { ascending: true });

        if (fetchError) {
            console.error('❌ Error fetching castles:', fetchError);
            throw fetchError;
        }

        console.log('\n📊 All Castles in Database (ordered by unlock_order):');
        console.log('─'.repeat(80));
        allCastles.forEach(castle => {
            console.log(
                `${castle.unlock_order}. ${castle.name.padEnd(30)} ` +
                `Route: ${castle.route.padEnd(10)} ` +
                `Region: ${(castle.region || 'N/A').padEnd(25)} ` +
                `Image: ${castle.image_number}`
            );
        });
        console.log('─'.repeat(80));

        console.log(`\n✨ Total Castles: ${allCastles.length}`);
        console.log('\n🎉 Seed completed successfully!');
        console.log('\n📌 Next Steps:');
        console.log('   1. Visit /student/worldmap to see Castle 0 and Castle 6');
        console.log('   2. Create assessment database tables (assessment_questions, user_assessment_attempts, user_assessment_results)');
        console.log('   3. Seed the 240 assessment questions');
        console.log('   4. Build backend AssessmentService and API endpoints\n');

    } catch (error) {
        console.error('\n💥 Seed failed:', error.message);
        process.exit(1);
    }
}

// Run the seed
seedCastles06();
