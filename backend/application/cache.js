/**
 * Simple In-Memory Cache Utility
 * Provides basic caching with TTL (Time To Live) support
 */
class InMemoryCache {
    constructor() {
        this.cache = new Map();
        this.timers = new Map();
    }

    /**
     * Set a value in cache with optional TTL
     * @param {string} key - Cache key
     * @param {any} value - Value to cache
     * @param {number} ttl - Time to live in milliseconds (default: 5 minutes)
     */
    set(key, value, ttl = 5 * 60 * 1000) {
        // Clear existing timer if key exists
        if (this.timers.has(key)) {
            clearTimeout(this.timers.get(key));
        }

        // Set the value
        this.cache.set(key, {
            value,
            timestamp: Date.now()
        });

        // Set expiration timer
        const timer = setTimeout(() => {
            this.delete(key);
        }, ttl);

        this.timers.set(key, timer);
    }

    /**
     * Get a value from cache
     * @param {string} key - Cache key
     * @returns {any|null} Cached value or null if not found
     */
    get(key) {
        const cached = this.cache.get(key);
        if (!cached) return null;
        
        return cached.value;
    }

    /**
     * Check if key exists in cache
     * @param {string} key - Cache key
     * @returns {boolean}
     */
    has(key) {
        return this.cache.has(key);
    }

    /**
     * Delete a specific key from cache
     * @param {string} key - Cache key
     */
    delete(key) {
        if (this.timers.has(key)) {
            clearTimeout(this.timers.get(key));
            this.timers.delete(key);
        }
        this.cache.delete(key);
    }

    /**
     * Clear all cache
     */
    clear() {
        // Clear all timers
        this.timers.forEach(timer => clearTimeout(timer));
        this.timers.clear();
        this.cache.clear();
    }

    /**
     * Delete all cache entries for a specific user
     * @param {string} userId - User ID to clear cache for
     */
    clearUserCache(userId) {
        const keysToDelete = [];
        
        // Find all keys that contain this userId
        for (const key of this.cache.keys()) {
            if (key.includes(`:${userId}`)) {
                keysToDelete.push(key);
            }
        }
        
        // Delete all matching keys
        keysToDelete.forEach(key => this.delete(key));
        
        console.log(`Cleared ${keysToDelete.length} cache entries for user: ${userId}`);
        return keysToDelete.length;
    }

    /**
     * Delete all cache entries matching a pattern (RegExp or string)
     * @param {RegExp|string} pattern - Pattern to match keys (string will be converted to RegExp)
     * @returns {number} Number of deleted keys
     */
    deletePattern(pattern) {
        let regex = pattern instanceof RegExp ? pattern : new RegExp(pattern);
        const keysToDelete = [];
        for (const key of this.cache.keys()) {
            if (regex.test(key)) {
                keysToDelete.push(key);
            }
        }
        keysToDelete.forEach(key => this.delete(key));
        return keysToDelete.length;
    }

    /**
     * Get cache statistics
     */
    getStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys())
        };
    }

    /**
     * Generate cache key from multiple parameters
     * @param {string} prefix - Key prefix
     * @param {...any} params - Parameters to include in key
     * @returns {string} Generated cache key
     */
    generateKey(prefix, ...params) {
        return `${prefix}:${params.filter(p => p !== undefined && p !== null).join(':')}`;
    }
}

// Export singleton instance
module.exports = new InMemoryCache();