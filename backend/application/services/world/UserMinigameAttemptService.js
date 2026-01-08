const cache = require('../../cache');
const userMinigameAttemptModel = require('../../../domain/models/world/UserMinigameAttempt');

class UserMinigameAttemptService {
    constructor(userMinigameAttemptRepo, minigameService, xpService, leaderboardService) {
        this.userMinigameAttemptRepo = userMinigameAttemptRepo;
        this.minigameService = minigameService;
        this.xpService = xpService;
        this.leaderboardService = leaderboardService;
        this.CACHE_TTL = 10 * 60 * 1000;
    }

    _invalidateUserMinigameAttemptCache(attemptId = null) {
        if (attemptId) {
            cache.delete(cache.generateKey('user_minigame_attempt', attemptId));
        }
        cache.delete(cache.generateKey('all_user_minigame_attempts'));
    }

    async createUserMinigameAttempt(data) {
        // Get the minigame to determine XP reward
        const minigame = await this.minigameService.getMinigameById(data.minigame_id);
        if (!minigame) {
            throw new Error('Minigame not found');
        }
        
        // Check if completed (score >= 100 means all questions correct)
        const completed = (data.score || 0) >= 100;
        const xpEarned = completed ? (minigame.xp_reward || 0) : 0;
        
        console.log(`[UserMinigameAttemptService] Creating minigame attempt: score=${data.score}, completed=${completed}, xpEarned=${xpEarned}`);
        
        // Create the attempt with calculated values
        const attemptData = {
            ...data,
            completed,
            xp_earned: xpEarned,
            attempted_at: data.attempted_at || new Date().toISOString()
        };
        
        const result = await this.userMinigameAttemptRepo.createUserMinigameAttempt(attemptData);
        this._invalidateUserMinigameAttemptCache();
        return result;
    }

    async getUserMinigameAttemptById(attemptId) {
        const cacheKey = cache.generateKey('user_minigame_attempt', attemptId);
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        const attempt = await this.userMinigameAttemptRepo.getUserMinigameAttemptById(attemptId);
        cache.set(cacheKey, attempt);
        return attempt;
    }

    async getAllUserMinigameAttempts() {
        const cacheKey = cache.generateKey('all_user_minigame_attempts');
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        const attempts = await this.userMinigameAttemptRepo.getAllUserMinigameAttempts();
        cache.set(cacheKey, attempts);
        return attempts;
    }

    async updateUserMinigameAttempt(attemptId, data) {
        const result = await this.userMinigameAttemptRepo.updateUserMinigameAttempt(attemptId, data);
        this._invalidateUserMinigameAttemptCache(attemptId);
        return result;
    }

    async deleteUserMinigameAttempt(attemptId) {
        const result = await this.userMinigameAttemptRepo.deleteUserMinigameAttempt(attemptId);
        this._invalidateUserMinigameAttemptCache(attemptId);
        return result;
    }
}

module.exports = UserMinigameAttemptService;