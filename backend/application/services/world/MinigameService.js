const cache = require('../../cache');
const minigameModel = require('../../../domain/models/world/Minigame');

class MinigameService {
    constructor(minigameRepo) {
        this.minigameRepo = minigameRepo;
        this.CACHE_TTL = 10 * 60 * 1000;
    }

    _invalidateMinigameCache(minigameId = null) {
        if (minigameId) {
            cache.delete(cache.generateKey('minigame', minigameId));
        }
        cache.delete(cache.generateKey('all_minigames'));
    }

    async createMinigame(data) {
        const result = await this.minigameRepo.createMinigame(data);
        this._invalidateMinigameCache();
        return result;
    }

    async getMinigameById(minigameId) {
        const cacheKey = cache.generateKey('minigame', minigameId);
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        const minigame = await this.minigameRepo.getMinigameById(minigameId);
        cache.set(cacheKey, minigame);
        return minigame;
    }

    async getAllMinigames() {
        const cacheKey = cache.generateKey('all_minigames');
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        const minigames = await this.minigameRepo.getAllMinigames();
        cache.set(cacheKey, minigames);
        return minigames;
    }

    async getMinigamesByChapterId(chapterId) {
        const cacheKey = cache.generateKey('minigames_by_chapter', chapterId);
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        const minigames = await this.minigameRepo.getMinigamesByChapterId(chapterId);
        cache.set(cacheKey, minigames);
        return minigames;
    }

    async updateMinigame(minigameId, data) {
        const result = await this.minigameRepo.updateMinigame(minigameId, data);
        this._invalidateMinigameCache(minigameId);
        return result;
    }

    async deleteMinigame(minigameId) {
        const result = await this.minigameRepo.deleteMinigame(minigameId);
        this._invalidateMinigameCache(minigameId);
        return result;
    }
}

module.exports = MinigameService;