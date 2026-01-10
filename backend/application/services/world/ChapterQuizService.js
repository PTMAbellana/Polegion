const cache = require('../../cache');
const chapterQuizModel = require('../../../domain/models/world/ChapterQuiz');

class ChapterQuizService {
    constructor(chapterQuizRepo) {
        this.chapterQuizRepo = chapterQuizRepo;
        this.CACHE_TTL = 10 * 60 * 1000;
    }

    _invalidateChapterQuizCache(quizId = null) {
        if (quizId) {
            cache.delete(cache.generateKey('chapter_quiz', quizId));
        }
        cache.delete(cache.generateKey('all_chapter_quizzes'));
    }

    async createChapterQuiz(data) {
        const result = await this.chapterQuizRepo.createChapterQuiz(data);
        this._invalidateChapterQuizCache();
        return result;
    }

    async getChapterQuizById(quizId) {
        const cacheKey = cache.generateKey('chapter_quiz', quizId);
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        const quiz = await this.chapterQuizRepo.getChapterQuizById(quizId);
        cache.set(cacheKey, quiz);
        return quiz;
    }

    async getAllChapterQuizzes() {
        const cacheKey = cache.generateKey('all_chapter_quizzes');
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        const quizzes = await this.chapterQuizRepo.getAllChapterQuizzes();
        cache.set(cacheKey, quizzes);
        return quizzes;
    }

    async getChapterQuizzesByChapterId(chapterId) {
        const cacheKey = cache.generateKey('chapter_quizzes_by_chapter', chapterId);
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        const quizzes = await this.chapterQuizRepo.getChapterQuizzesByChapterId(chapterId);
        cache.set(cacheKey, quizzes);
        return quizzes;
    }

    async updateChapterQuiz(quizId, data) {
        const result = await this.chapterQuizRepo.updateChapterQuiz(quizId, data);
        this._invalidateChapterQuizCache(quizId);
        return result;
    }

    async deleteChapterQuiz(quizId) {
        const result = await this.chapterQuizRepo.deleteChapterQuiz(quizId);
        this._invalidateChapterQuizCache(quizId);
        return result;
    }
}

module.exports = ChapterQuizService;