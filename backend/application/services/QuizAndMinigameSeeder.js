const { 
    castle1Chapter1Quizzes, 
    castle1Chapter1Minigames,
    castle1Chapter2Quizzes,
    castle1Chapter2Minigames,
    castle2Chapter1Quizzes,
    castle2Chapter1Minigames,
    castle2Chapter2Quizzes,
    castle2Chapter2Minigames,
    castle3Chapter1Quizzes,
    castle3Chapter1Minigames,
    castle3Chapter2Quizzes,
    castle3Chapter2Minigames,
    castle3Chapter3Quizzes,
    castle3Chapter3Minigames
} = require('../../infrastructure/seeds/chapterSeeds');

// Mapping of castle and chapter to their respective seed data
const QUIZ_SEEDS = {
    1: { // Castle 1
        1: castle1Chapter1Quizzes,
        2: castle1Chapter2Quizzes,
        // 3: castle1Chapter3Quizzes, // Add when ready
    },
    2: { // Castle 2
        1: castle2Chapter1Quizzes,
        2: castle2Chapter2Quizzes,
        // 3: castle2Chapter3Quizzes, // Add when ready
    },
    3: { // Castle 3 - Circle Sanctuary Quest
        1: castle3Chapter1Quizzes,
        2: castle3Chapter2Quizzes,
        3: castle3Chapter3Quizzes
    }
};

const MINIGAME_SEEDS = {
    1: { // Castle 1
        1: castle1Chapter1Minigames,
        2: castle1Chapter2Minigames,
        // 3: castle1Chapter3Minigames, // Add when ready
    },
    2: { // Castle 2
        1: castle2Chapter1Minigames,
        2: castle2Chapter2Minigames,
        // 3: castle2Chapter3Minigames, // Add when ready
    },
    3: { // Castle 3 - Circle Sanctuary Quest
        1: castle3Chapter1Minigames,
        2: castle3Chapter2Minigames,
        3: castle3Chapter3Minigames
    }
};

class QuizAndMinigameSeeder {
    constructor(chapterQuizRepo, minigameRepo) {
        this.chapterQuizRepo = chapterQuizRepo;
        this.minigameRepo = minigameRepo;
    }

    /**
     * Seeds quizzes and minigames for a specific chapter if they don't exist
     * @param {string} chapterId - The chapter ID
     * @param {number} chapterNumber - The chapter number
     * @param {number} castleNumber - The castle number (default: 1)
     * @returns {Promise<Object>} - Object with created quizzes and minigames
     */
    async seedForChapter(chapterId, chapterNumber, castleNumber = 1) {
        try {
            console.log(`[QuizAndMinigameSeeder] Seeding for Castle ${castleNumber}, Chapter ${chapterNumber}`);

            const result = {
                quizzes: [],
                minigames: []
            };

            // Get seed data based on castle and chapter number
            const quizSeeds = QUIZ_SEEDS[castleNumber]?.[chapterNumber] || [];
            const minigameSeeds = MINIGAME_SEEDS[castleNumber]?.[chapterNumber] || [];

            if (quizSeeds.length === 0 && minigameSeeds.length === 0) {
                console.log(`[QuizAndMinigameSeeder] No seed data found for Castle ${castleNumber}, Chapter ${chapterNumber}`);
                return result;
            }

            // Seed quizzes
            for (const quizData of quizSeeds) {
                const existing = await this.chapterQuizRepo.getChapterQuizById(quizData.id);
                
                if (!existing) {
                    console.log(`[QuizAndMinigameSeeder] Creating quiz: ${quizData.title}`);
                    const quiz = await this.chapterQuizRepo.createChapterQuiz({
                        ...quizData,
                        chapter_id: chapterId
                    });
                    result.quizzes.push(quiz);
                } else {
                    console.log(`[QuizAndMinigameSeeder] Quiz already exists: ${quizData.title}`);
                    result.quizzes.push(existing);
                }
            }

            // Seed minigames
            for (const minigameData of minigameSeeds) {
                const existing = await this.minigameRepo.getMinigameById(minigameData.id);
                
                if (!existing) {
                    console.log(`[QuizAndMinigameSeeder] Creating minigame: ${minigameData.title}`);
                    const minigame = await this.minigameRepo.createMinigame({
                        ...minigameData,
                        chapter_id: chapterId
                    });
                    result.minigames.push(minigame);
                } else {
                    console.log(`[QuizAndMinigameSeeder] Minigame already exists: ${minigameData.title}`);
                    result.minigames.push(existing);
                }
            }

            return result;

        } catch (error) {
            console.error('[QuizAndMinigameSeeder] Error seeding:', error);
            throw error;
        }
    }
}

module.exports = QuizAndMinigameSeeder;
