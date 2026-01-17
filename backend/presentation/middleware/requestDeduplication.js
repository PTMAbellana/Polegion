/**
 * Request Deduplication Middleware
 * 
 * ✅ Prevents race conditions by ensuring only ONE request per user+endpoint
 * executes at a time. Subsequent duplicate requests wait for the first to complete.
 * 
 * Use Cases:
 * - /api/adaptive/topics-with-progress (prevents concurrent initialization)
 * - /api/adaptive/question/:topicId (prevents duplicate question generation)
 * - Any endpoint that initializes user data
 * 
 * How it works:
 * 1. Generate request key from user ID + endpoint + params
 * 2. If request is already in-flight, wait for it to complete
 * 3. Otherwise, mark request as in-flight and proceed
 * 4. Always clean up after completion (success or error)
 */

class RequestDeduplication {
  constructor() {
    // Map of request keys to Promise resolvers
    // Format: { "userId:endpoint:params": { promise, resolvers: [] } }
    this.pendingRequests = new Map();
    
    // Timeout for waiting requests (prevent indefinite blocking)
    this.WAIT_TIMEOUT_MS = 30000; // 30 seconds
    
    // Cleanup old requests every 5 minutes
    this.cleanupInterval = setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  /**
   * Generate unique request key from user, endpoint, and params
   */
  generateRequestKey(req) {
    const userId = req.user?.id || 'anonymous';
    const endpoint = req.route?.path || req.path;
    
    // Include significant params in key (e.g., topicId)
    const params = JSON.stringify({
      topicId: req.params.topicId,
      questionId: req.params.questionId,
      // Add other relevant params as needed
    });
    
    return `${userId}:${endpoint}:${params}`;
  }

  /**
   * Middleware function - deduplicate requests
   */
  middleware() {
    return async (req, res, next) => {
      const requestKey = this.generateRequestKey(req);
      
      // Check if same request is already in progress
      if (this.pendingRequests.has(requestKey)) {
        console.log(`[Dedup] Duplicate request detected: ${requestKey}`);
        
        const pending = this.pendingRequests.get(requestKey);
        
        try {
          // Wait for the original request to complete (with timeout)
          const result = await Promise.race([
            pending.promise,
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Request wait timeout')), this.WAIT_TIMEOUT_MS)
            )
          ]);
          
          console.log(`[Dedup] Original request completed, returning cached result`);
          
          // Return the same response as the original request
          return res.status(result.status).json(result.data);
          
        } catch (error) {
          console.error(`[Dedup] Error waiting for original request:`, error);
          
          // If original request failed or timed out, allow this request to proceed
          // Remove the stale entry
          this.pendingRequests.delete(requestKey);
        }
      }
      
      // No duplicate request - create new pending entry
      console.log(`[Dedup] New request: ${requestKey}`);
      
      let resolvePromise, rejectPromise;
      const promise = new Promise((resolve, reject) => {
        resolvePromise = resolve;
        rejectPromise = reject;
      });
      
      this.pendingRequests.set(requestKey, {
        promise,
        resolve: resolvePromise,
        reject: rejectPromise,
        startTime: Date.now()
      });
      
      // Intercept res.json to capture response and resolve promise
      const originalJson = res.json.bind(res);
      res.json = (data) => {
        const pending = this.pendingRequests.get(requestKey);
        
        if (pending) {
          // Resolve promise with response data
          pending.resolve({
            status: res.statusCode,
            data
          });
          
          // Cleanup after short delay (allow waiting requests to read)
          setTimeout(() => this.pendingRequests.delete(requestKey), 1000);
        }
        
        return originalJson(data);
      };
      
      // Intercept errors
      const originalSend = res.send.bind(res);
      res.send = function(data) {
        const pending = this.pendingRequests.get(requestKey);
        
        if (pending && res.statusCode >= 400) {
          pending.reject(new Error(`Request failed with status ${res.statusCode}`));
          this.pendingRequests.delete(requestKey);
        }
        
        return originalSend(data);
      }.bind(this);
      
      // Continue to actual handler
      next();
    };
  }

  /**
   * Clean up old pending requests (prevent memory leaks)
   */
  cleanup() {
    const now = Date.now();
    const STALE_THRESHOLD_MS = 60000; // 1 minute
    
    let cleanedCount = 0;
    
    for (const [key, pending] of this.pendingRequests.entries()) {
      if (now - pending.startTime > STALE_THRESHOLD_MS) {
        this.pendingRequests.delete(key);
        cleanedCount++;
      }
    }
    
    if (cleanedCount > 0) {
      console.log(`[Dedup] Cleaned up ${cleanedCount} stale requests`);
    }
  }

  /**
   * Clear all pending requests (for testing)
   */
  reset() {
    this.pendingRequests.clear();
  }

  /**
   * Shutdown - clear interval
   */
  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.pendingRequests.clear();
  }
}

// Singleton instance
const deduplication = new RequestDeduplication();

module.exports = deduplication.middleware.bind(deduplication);
module.exports.instance = deduplication;
