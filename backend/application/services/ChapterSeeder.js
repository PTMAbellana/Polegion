const { castle1Chapters } = require('../../infrastructure/seeds/chapterSeeds');

class ChapterSeeder {
    constructor(chapterRepo) {
        this.chapterRepo = chapterRepo;
    }

    /**
     * Seeds chapters for a specific castle if they don't exist
     * @param {string} castleId - The castle ID
     * @param {string} castleRoute - The castle route (e.g., 'castle1')
     * @returns {Promise<Array>} - Array of created chapters
     */
    async seedChaptersForCastle(castleId, castleRoute) {
        try {
            console.log(`[ChapterSeeder] Checking chapters for ${castleRoute}`);

            // Get existing chapters
            const existingChapters = await this.chapterRepo.getChaptersByCastleId(castleId);
            
            if (existingChapters.length > 0) {
                console.log(`[ChapterSeeder] Castle ${castleRoute} already has ${existingChapters.length} chapters`);
                return existingChapters;
            }

            // Get seed data based on castle route
            let seedData = [];
            if (castleRoute === 'castle1') {
                seedData = castle1Chapters;
            }
            // Add more castles here in the future
            // else if (castleRoute === 'castle2') {
            //     seedData = castle2Chapters;
            // }

            if (seedData.length === 0) {
                console.log(`[ChapterSeeder] No seed data found for ${castleRoute}`);
                return [];
            }

            console.log(`[ChapterSeeder] Seeding ${seedData.length} chapters for ${castleRoute}`);

            // Create chapters
            const createdChapters = [];
            for (const chapterData of seedData) {
                const chapter = await this.chapterRepo.createChapter({
                    id: chapterData.id,
                    castle_id: castleId,
                    title: chapterData.title,
                    description: chapterData.description,
                    chapter_number: chapterData.chapter_number,
                    xp_reward: chapterData.xp_reward
                });
                createdChapters.push(chapter);
                console.log(`[ChapterSeeder] Created chapter: ${chapter.title}`);
            }

            return createdChapters;

        } catch (error) {
            console.error('[ChapterSeeder] Error seeding chapters:', error);
            throw error;
        }
    }
}

module.exports = ChapterSeeder;
