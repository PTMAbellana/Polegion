/**
 * Session Tracking Middleware
 * Automatically tracks user sessions and activity
 */

let sessionAnalyticsRepo;

// Lazy load to avoid circular dependency
function getRepo() {
  if (!sessionAnalyticsRepo) {
    const SessionAnalyticsRepo = require('../../infrastructure/repository/analytics/SessionAnalyticsRepo');
    sessionAnalyticsRepo = new SessionAnalyticsRepo();
  }
  return sessionAnalyticsRepo;
}

// In-memory session store (use Redis in production for multiple servers)
const activeSessions = new Map();

/**
 * Middleware to track user sessions
 * Automatically creates session on first request and tracks activity
 */
function sessionTracking(req, res, next) {
  // Only track authenticated requests
  if (!req.user || !req.user.id) {
    return next();
  }
  
  const userId = req.user.id;
  const sessionKey = `session_${userId}`;
  
  // Initialize or retrieve session
  if (!activeSessions.has(sessionKey)) {
    const repo = getRepo();
    
    // Create new session in database
    repo.createSession(
      userId,
      req.headers['user-agent'],
      req.ip,
      req.headers['user-agent']
    ).then(session => {
      if (session) {
        activeSessions.set(sessionKey, {
          sessionId: session.id,
          userId: userId,
          startTime: new Date(),
          lastActivity: new Date(),
          questionsAnswered: 0,
          questionsCorrect: 0
        });
        
        // Update login streak
        repo.updateLoginStreak(userId).catch(err => {
          console.error('[SessionTracking] Error updating streak:', err);
        });
      }
    }).catch(err => {
      console.error('[SessionTracking] Error creating session:', err);
    });
  } else {
    // Update last activity time
    const session = activeSessions.get(sessionKey);
    session.lastActivity = new Date();
  }
  
  // Attach session data to request
  req.sessionData = activeSessions.get(sessionKey);
  
  next();
}

/**
 * Middleware to track question attempts
 */
function trackQuestionAttempt(req, res, next) {
  if (!req.sessionData || !req.body) {
    return next();
  }
  
  const { isCorrect, topicCode } = req.body;
  
  if (typeof isCorrect !== 'boolean') {
    return next();
  }
  
  const repo = getRepo();
  const session = req.sessionData;
  
  // Update session question count
  session.questionsAnswered++;
  if (isCorrect) {
    session.questionsCorrect++;
  }
  
  // Update in database
  repo.incrementQuestionCount(session.sessionId, isCorrect).catch(err => {
    console.error('[SessionTracking] Error updating question count:', err);
  });
  
  // Update daily activity
  const today = new Date().toISOString().split('T')[0];
  repo.recordDailyActivity(session.userId, today, {
    questionsAnswered: 1,
    questionsCorrect: isCorrect ? 1 : 0,
    topics: topicCode ? [topicCode] : []
  }).catch(err => {
    console.error('[SessionTracking] Error updating daily activity:', err);
  });
  
  next();
}

/**
 * Cleanup inactive sessions periodically
 * Call this every 5 minutes or on server shutdown
 */
function cleanupInactiveSessions(inactiveMinutes = 30) {
  const repo = getRepo();
  const now = new Date();
  const sessionsToRemove = [];
  
  for (const [key, session] of activeSessions.entries()) {
    const inactiveTime = (now - session.lastActivity) / 1000 / 60; // minutes
    
    if (inactiveTime > inactiveMinutes) {
      // End session in database
      repo.endSession(session.sessionId).catch(err => {
        console.error('[SessionTracking] Error ending session:', err);
      });
      
      sessionsToRemove.push(key);
    }
  }
  
  // Remove from memory
  sessionsToRemove.forEach(key => activeSessions.delete(key));
  
  if (sessionsToRemove.length > 0) {
    console.log(`[SessionTracking] Cleaned up ${sessionsToRemove.length} inactive sessions`);
  }
}

// Cleanup inactive sessions every 5 minutes
setInterval(() => cleanupInactiveSessions(30), 5 * 60 * 1000);

// Cleanup on process exit
process.on('SIGINT', () => {
  console.log('[SessionTracking] Ending all active sessions...');
  const repo = getRepo();
  
  Promise.all(
    Array.from(activeSessions.values()).map(session => 
      repo.endSession(session.sessionId)
    )
  ).finally(() => {
    process.exit(0);
  });
});

module.exports = {
  sessionTracking,
  trackQuestionAttempt,
  cleanupInactiveSessions,
  getActiveSessions: () => activeSessions
};
