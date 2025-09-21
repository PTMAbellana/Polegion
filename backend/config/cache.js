class InMemoryCache {
  constructor() {
    this.cache = new Map();
    this.timers = new Map();
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0
    };
    
    // Application-specific cache categories
    this.categories = {
      USER_SESSIONS: 'user_session_',
      LEADERBOARDS: 'leaderboard_',
      PROBLEMS: 'problem_',
      ROOMS: 'room_',
      COMPETITIONS: 'competition_',
      USER_PROGRESS: 'progress_',
      APP_STATE: 'app_state_'
    };
  }

  async get(key) {
    if (this.cache.has(key)) {
      const item = this.cache.get(key);
      if (item.expiry && Date.now() > item.expiry) {
        this.delete(key);
        this.stats.misses++;
        return null;
      }
      this.stats.hits++;
      return item.value;
    }
    this.stats.misses++;
    return null;
  }

  async set(key, value, ttl = parseInt(process.env.CACHE_DEFAULT_TTL) || 1800) {
    // Clear existing timer if any
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
    }

    const expiry = ttl > 0 ? Date.now() + (ttl * 1000) : null;
    
    this.cache.set(key, { 
      value, 
      expiry,
      createdAt: Date.now(),
      category: this.getCategoryFromKey(key)
    });

    // Set auto-cleanup timer
    if (ttl > 0) {
      const timer = setTimeout(() => {
        this.delete(key);
      }, ttl * 1000);
      this.timers.set(key, timer);
    }

    this.stats.sets++;
    return true;
  }

  async del(key) {
    return this.delete(key);
  }

  delete(key) {
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }
    const deleted = this.cache.delete(key);
    if (deleted) this.stats.deletes++;
    return deleted;
  }

  async flush() {
    // Clear all timers
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }
    this.timers.clear();
    this.cache.clear();
    this.resetStats();
    return true;
  }

  // Application-specific methods
  async cacheUserSession(userId, sessionData, ttl = parseInt(process.env.CACHE_USER_SESSION_TTL) || 7200) {
    return this.set(`${this.categories.USER_SESSIONS}${userId}`, sessionData, ttl);
  }

  async getUserSession(userId) {
    return this.get(`${this.categories.USER_SESSIONS}${userId}`);
  }

  async cacheLeaderboard(roomId, leaderboardData, ttl = parseInt(process.env.CACHE_LEADERBOARD_TTL) || 300) {
    const key = roomId ? `${this.categories.LEADERBOARDS}${roomId}` : `${this.categories.LEADERBOARDS}global`;
    return this.set(key, leaderboardData, ttl);
  }

  async getLeaderboard(roomId = null) {
    const key = roomId ? `${this.categories.LEADERBOARDS}${roomId}` : `${this.categories.LEADERBOARDS}global`;
    return this.get(key);
  }

  async cacheProblem(problemId, problemData, ttl = parseInt(process.env.CACHE_PROBLEMS_TTL) || 3600) {
    return this.set(`${this.categories.PROBLEMS}${problemId}`, problemData, ttl);
  }

  async getProblem(problemId) {
    return this.get(`${this.categories.PROBLEMS}${problemId}`);
  }

  async cacheUserProgress(userId, progressData, ttl = 3600) {
    return this.set(`${this.categories.USER_PROGRESS}${userId}`, progressData, ttl);
  }

  async getUserProgress(userId) {
    return this.get(`${this.categories.USER_PROGRESS}${userId}`);
  }

  async cacheAppState(sessionId, appState, ttl = 1800) {
    return this.set(`${this.categories.APP_STATE}${sessionId}`, appState, ttl);
  }

  async getAppState(sessionId) {
    return this.get(`${this.categories.APP_STATE}${sessionId}`);
  }

  // Utility methods
  getCategoryFromKey(key) {
    for (const [category, prefix] of Object.entries(this.categories)) {
      if (key.startsWith(prefix)) {
        return category;
      }
    }
    return 'UNKNOWN';
  }

  async invalidateByCategory(category) {
    const prefix = this.categories[category];
    if (!prefix) return false;

    const keysToDelete = [];
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.delete(key));
    return keysToDelete.length;
  }

  async invalidateUserData(userId) {
    const patterns = [
      `${this.categories.USER_SESSIONS}${userId}`,
      `${this.categories.USER_PROGRESS}${userId}`
    ];

    let deletedCount = 0;
    patterns.forEach(pattern => {
      if (this.delete(pattern)) deletedCount++;
    });

    return deletedCount;
  }

  // Get cache statistics for monitoring
  getStats() {
    const categoryStats = {};
    for (const [key, item] of this.cache.entries()) {
      const category = item.category || 'UNKNOWN';
      if (!categoryStats[category]) {
        categoryStats[category] = 0;
      }
      categoryStats[category]++;
    }

    return {
      total: this.cache.size,
      categories: categoryStats,
      performance: {
        hits: this.stats.hits,
        misses: this.stats.misses,
        hitRate: this.stats.hits / (this.stats.hits + this.stats.misses) || 0,
        sets: this.stats.sets,
        deletes: this.stats.deletes
      },
      memory: {
        keysCount: this.cache.size,
        timersCount: this.timers.size
      }
    };
  }

  resetStats() {
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0
    };
  }

  // Clean expired items manually
  cleanup() {
    const now = Date.now();
    let cleanedCount = 0;
    
    for (const [key, item] of this.cache.entries()) {
      if (item.expiry && now > item.expiry) {
        this.delete(key);
        cleanedCount++;
      }
    }
    
    console.log(`Cache cleanup completed. Removed ${cleanedCount} expired items.`);
    return cleanedCount;
  }

  // Get cache health status
  getHealth() {
    const stats = this.getStats();
    const memoryUsage = process.memoryUsage();
    
    return {
      status: 'healthy',
      cache: {
        size: stats.total,
        hitRate: stats.performance.hitRate,
        categories: stats.categories
      },
      memory: {
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
      },
      uptime: process.uptime()
    };
  }
}

// Create singleton instance
const cacheService = new InMemoryCache();

// Run cleanup every 5 minutes
setInterval(() => {
  cacheService.cleanup();
}, 5 * 60 * 1000);

// Log cache stats every 10 minutes in development
if (process.env.NODE_ENV === 'development') {
  setInterval(() => {
    const stats = cacheService.getStats();
    console.log('📊 Cache Stats:', {
      size: stats.total,
      hitRate: `${(stats.performance.hitRate * 100).toFixed(1)}%`,
      categories: stats.categories
    });
  }, 10 * 60 * 1000);
}

module.exports = cacheService;