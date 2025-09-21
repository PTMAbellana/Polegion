const UserRepository = require('../../infrastructure/repository/UserRepo');
const cacheService = require('../../config/cache');

class UserService {
  constructor() {
    this.userRepo = new UserRepository();
  }

  async getUserProfile(userId) {
    // Try cache first
    let user = await cacheService.getUserSession(userId);
    
    if (!user) {
      user = await this.userRepo.findById(userId);
      if (user) {
        // Cache user profile for quick access
        await cacheService.cacheUserSession(userId, user, 3600); // 1 hour
      }
    }
    
    return user;
  }

  async updateUserProgress(userId, progressData) {
    // Update in database
    const user = await this.userRepo.update(userId, progressData);
    
    // Update cache
    await cacheService.cacheUserProgress(userId, progressData);
    await cacheService.invalidateUserData(userId); // Clear old user session
    
    // Invalidate leaderboard cache since user progress changed
    await cacheService.invalidateByCategory('LEADERBOARDS');
    
    return user;
  }

  async getUserProgress(userId) {
    // Try cache first
    let progress = await cacheService.getUserProgress(userId);
    
    if (!progress) {
      // Calculate progress from database
      progress = await this.calculateUserProgress(userId);
      if (progress) {
        await cacheService.cacheUserProgress(userId, progress, 1800); // 30 minutes
      }
    }
    
    return progress;
  }

  async calculateUserProgress(userId) {
    // This would calculate user's progress based on attempts, completed problems, etc.
    const user = await this.userRepo.findById(userId, false);
    if (!user) return null;

    // You can expand this logic based on your gaming mechanics
    const progress = {
      level: user.level,
      xp: user.xp,
      totalProblems: 0, // Calculate from attempts
      solvedProblems: 0, // Calculate from successful attempts
      badges: [], // Any badges earned
      streak: 0, // Current solving streak
      lastActivity: user.lastLoginAt
    };

    return progress;
  }

  async addXP(userId, amount, reason) {
    const user = await this.userRepo.updateXP(userId, amount, reason);
    
    // Clear user caches to force refresh
    await cacheService.invalidateUserData(userId);
    await cacheService.invalidateByCategory('LEADERBOARDS');
    
    return user;
  }

  async getLeaderboard(roomId = null, limit = 10) {
    // Try cache first
    let leaderboard = await cacheService.getLeaderboard(roomId);
    
    if (!leaderboard) {
      leaderboard = await this.userRepo.getLeaderboard(limit);
      if (leaderboard) {
        await cacheService.cacheLeaderboard(roomId, leaderboard, 300); // 5 minutes
      }
    }
    
    return leaderboard;
  }
}

module.exports = UserService;