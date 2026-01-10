const cache = require('../../cache');
const Chapter = require('../../../domain/models/world/Chapter');

class ChapterService {
    constructor(chapterRepo, chapterQuizService) {
        this.chapterRepo = chapterRepo;
        this.chapterQuizService = chapterQuizService;
        this.CACHE_TTL = 10 * 60 * 1000; // 10 minutes
    }

    _invalidateChapterCache(chapterId = null) {
        if (chapterId) {
            const key = cache.generateKey('chapter', chapterId);
            cache.delete(key);
        }
        cache.delete(cache.generateKey('all_chapters'));
    }

    async createChapter(data) {
        const result = await this.chapterRepo.createChapter(data);
        this._invalidateChapterCache();
        return result;
    }

    async getChapterById(chapterId) {
        const cacheKey = cache.generateKey('chapter', chapterId);
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        const chapter = await this.chapterRepo.getChapterById(chapterId);
        cache.set(cacheKey, chapter);
        return chapter;
    }

    async getAllChapters() {
        const cacheKey = cache.generateKey('all_chapters');
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        const chapters = await this.chapterRepo.getAllChapters();
        cache.set(cacheKey, chapters);
        return chapters;
    }

    async getChaptersByCastleId(castleId) {
        const cacheKey = cache.generateKey('castle_chapters', castleId);
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        const chapters = await this.chapterRepo.getChaptersByCastleId(castleId);
        cache.set(cacheKey, chapters);
        return chapters;
    }

    async updateChapter(chapterId, data) {
        const result = await this.chapterRepo.updateChapter(chapterId, data);
        this._invalidateChapterCache(chapterId);
        return result;
    }

    async deleteChapter(chapterId) {
        const result = await this.chapterRepo.deleteChapter(chapterId);
        this._invalidateChapterCache(chapterId);
        return result;
    }
}

module.exports = ChapterService;