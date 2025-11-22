const { 
    castle1Chapter1Quizzes, 
    castle1Chapter1Minigames,
    castle1Chapter2Quizzes,
    castle1Chapter2Minigames,
    castle1Chapter3Quizzes,
    castle1Chapter3Minigames,
    castle2Chapter1Quizzes,
    castle2Chapter1Minigames,
    castle2Chapter2Quizzes,
    castle2Chapter2Minigames,
    castle2Chapter3Quizzes,
    castle2Chapter3Minigames,
    castle2Chapter4Quizzes,
    castle2Chapter4Minigames,
    castle3Chapter1Quizzes,
    castle3Chapter1Minigames,
    castle3Chapter2Quizzes,
    castle3Chapter2Minigames,
    castle3Chapter3Quizzes,
    castle3Chapter3Minigames,
    castle4Chapter1Quizzes,
    castle4Chapter1Minigames,
    castle4Chapter2Quizzes,
    castle4Chapter2Minigames,
    castle4Chapter3Quizzes,
    castle4Chapter3Minigames,
    castle4Chapter4Quizzes,
    castle4Chapter4Minigames,
    castle5Chapter1Quizzes,
    castle5Chapter1Minigames,
    castle5Chapter2Quizzes,
    castle5Chapter2Minigames,
    castle5Chapter3Quizzes,
    castle5Chapter3Minigames,
    castle5Chapter4Quizzes,
    castle5Chapter4Minigames
} = require('../../infrastructure/seeds/chapterSeeds');

// Mapping of castle and chapter to their respective seed data
const QUIZ_SEEDS = {
    1: { // Castle 1
        1: castle1Chapter1Quizzes,
        2: castle1Chapter2Quizzes,
        3: castle1Chapter3Quizzes,
    },
    2: { // Castle 2
        1: castle2Chapter1Quizzes,
        2: castle2Chapter2Quizzes,
        3: castle2Chapter3Quizzes,
        4: castle2Chapter4Quizzes,
    },
    3: { // Castle 3
        1: castle3Chapter1Quizzes,
        2: castle3Chapter2Quizzes,
        3: castle3Chapter3Quizzes,
    },
    4: { // Castle 4
        1: castle4Chapter1Quizzes,
        2: castle4Chapter2Quizzes,
        3: castle4Chapter3Quizzes,
        4: castle4Chapter4Quizzes,
    },
    5: { // Castle 5
        1: castle5Chapter1Quizzes,
        2: castle5Chapter2Quizzes,
        3: castle5Chapter3Quizzes,
        4: castle5Chapter4Quizzes,
    }
};

const MINIGAME_SEEDS = {
    1: { // Castle 1
        1: castle1Chapter1Minigames,
        2: castle1Chapter2Minigames,
        3: castle1Chapter3Minigames,
    },
    2: { // Castle 2
        1: castle2Chapter1Minigames,
        2: castle2Chapter2Minigames,
        3: castle2Chapter3Minigames,
        4: castle2Chapter4Minigames,
    },
    3: { // Castle 3
        1: castle3Chapter1Minigames,
        2: castle3Chapter2Minigames,
        3: castle3Chapter3Minigames,
    },
    4: { // Castle 4
        1: castle4Chapter1Minigames,
        2: castle4Chapter2Minigames,
        3: castle4Chapter3Minigames,
        4: castle4Chapter4Minigames,
    },
    5: { // Castle 5
        1: castle5Chapter1Minigames,
        2: castle5Chapter2Minigames,
        3: castle5Chapter3Minigames,
        4: castle5Chapter4Minigames,
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
                // Check if quiz already exists for this chapter
                const existingQuizzes = await this.chapterQuizRepo.getChapterQuizzesByChapterId(chapterId);
                
                if (!existingQuizzes || existingQuizzes.length === 0) {
                    console.log(`[QuizAndMinigameSeeder] Creating quiz: ${quizData.title}`);
                    const quiz = await this.chapterQuizRepo.createChapterQuiz({
                        ...quizData,
                        chapter_id: chapterId
                    });
                    result.quizzes.push(quiz);
                } else {
                    console.log(`[QuizAndMinigameSeeder] Quiz already exists for chapter: ${quizData.title}`);
                    result.quizzes.push(existingQuizzes[0]);
                }
            }

            // Seed minigames
            for (const minigameData of minigameSeeds) {
                // Check if minigame already exists for this chapter
                const existingMinigames = await this.minigameRepo.getMinigamesByChapterId(chapterId);
                
                if (!existingMinigames || existingMinigames.length === 0) {
                    console.log(`[QuizAndMinigameSeeder] Creating minigame: ${minigameData.title}`);
                    const minigame = await this.minigameRepo.createMinigame({
                        ...minigameData,
                        chapter_id: chapterId
                    });
                    result.minigames.push(minigame);
                } else {
                    console.log(`[QuizAndMinigameSeeder] Minigame already exists for chapter: ${minigameData.title}`);
                    result.minigames.push(existingMinigames[0]);
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
