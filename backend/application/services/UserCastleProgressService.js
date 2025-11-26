const cache = require('../cache');
const userCastleProgressModel = require('../../domain/models/UserCastleProgress');

class UserCastleProgressService {
    constructor(userCastleProgressRepo, castleService) {
        this.userCastleProgressRepo = userCastleProgressRepo;
        this.castleService = castleService;
        this.CACHE_TTL = 10 * 60 * 1000;
    }

    _invalidateUserCastleProgressCache(progressId = null) {
        if (progressId) {
            cache.delete(cache.generateKey('user_castle_progress', progressId));
        }
        cache.delete(cache.generateKey('all_user_castle_progress'));
    }

    async createUserCastleProgress(data) {
        // Example: use this.castleService if needed for business logic
        const result = await this.userCastleProgressRepo.createUserCastleProgress(data);
        this._invalidateUserCastleProgressCache();
        return result;
    }

    async getUserCastleProgressById(progressId) {
        const cacheKey = cache.generateKey('user_castle_progress', progressId);
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        const progress = await this.userCastleProgressRepo.getUserCastleProgressById(progressId);
        cache.set(cacheKey, progress);
        return progress;
    }

    async getAllUserCastleProgress() {
        const cacheKey = cache.generateKey('all_user_castle_progress');
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        const progresses = await this.userCastleProgressRepo.getAllUserCastleProgress();
        cache.set(cacheKey, progresses);
        return progresses;
    }

    async updateUserCastleProgress(progressId, data) {
        const result = await this.userCastleProgressRepo.updateUserCastleProgress(progressId, data);
        this._invalidateUserCastleProgressCache(progressId);
        return result;
    }

    async deleteUserCastleProgress(progressId) {
        const result = await this.userCastleProgressRepo.deleteUserCastleProgress(progressId);
        this._invalidateUserCastleProgressCache(progressId);
        return result;
    }
}

module.exports = UserCastleProgressService;