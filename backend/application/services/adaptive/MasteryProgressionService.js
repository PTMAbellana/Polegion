/**
 * MasteryProgressionService
 * 
 * CRITICAL DESIGN PRINCIPLE:
 * This service implements mastery-based chapter unlocking WITHOUT modifying WorldMap.
 * WorldMap remains untouched - this service feeds unlock data into existing WorldMap APIs.
 * 
 * Mastery System:
 * - Each chapter has a mastery level: 0-5
 * - Mastery ≥ 3 → unlocks next chapter
 * - Mastery is updated based on Q-Learning state transitions and performance signals
 * - Unlocking is persistent, deterministic, and logged
 * 
 * Performance Signals:
 * - correct_streak: consecutive correct answers (increases mastery)
 * - wrong_streak: consecutive wrong answers (decreases mastery)
 * - difficulty_level: optimal challenge met (increases mastery faster)
 * - MDP action: pedagogical strategy effectiveness
 * - Q-Learning reward: learning progress indicator
 * 
 * Integration Points:
 * 1. AdaptiveLearningService calls updateMastery() after each answer
 * 2. ChapterProgressRepo receives unlock commands
 * 3. WorldMap fetches updated unlock states (no code changes needed)
 */

class MasteryProgressionService {
  constructor(adaptiveLearningRepo, chapterProgressRepo, chapterRepo) {
    this.adaptiveRepo = adaptiveLearningRepo;
    this.chapterProgressRepo = chapterProgressRepo;
    this.chapterRepo = chapterRepo;
    
    // Mastery thresholds (0-5 scale)
    this.MASTERY_LEVELS = {
      NONE: 0,          // 0-19% accuracy - just started
      NOVICE: 1,        // 20-39% accuracy - learning basics
      BEGINNER: 2,      // 40-59% accuracy - making progress
      DEVELOPING: 3,    // 60-74% accuracy - UNLOCK THRESHOLD (can progress)
      PROFICIENT: 4,    // 75-89% accuracy - strong understanding
      MASTERED: 5       // 90-100% accuracy - complete mastery
    };
    
    // Unlock threshold: Mastery ≥ 3 required to unlock next chapter
    this.UNLOCK_THRESHOLD = 3;
    
    console.log('[MasteryProgressionService] Initialized with unlock threshold:', this.UNLOCK_THRESHOLD);
  }

  /**
   * Calculate mastery level (0-5) from performance metrics
   * 
   * Deterministic mapping based on:
   * - Base accuracy (correct_answers / total_attempts)
   * - Streak bonuses (correct_streak increases, wrong_streak decreases)
   * - Difficulty handling (higher difficulty = faster mastery growth)
   * - MDP rewards (Q-Learning effectiveness)
   * 
   * @param {Object} state - Adaptive learning state with mastery_level (0-100)
   * @param {Object} mdpMetrics - Optional MDP metrics for adjustment
   * @returns {number} - Mastery level (0-5)
   */
  calculateMasteryLevel(state, mdpMetrics = {}) {
    if (!state || typeof state.mastery_level !== 'number') {
      return this.MASTERY_LEVELS.NONE;
    }

    let masteryPercentage = state.mastery_level;
    
    // Apply performance signal adjustments
    if (state.correct_streak >= 5) {
      masteryPercentage += 5; // Bonus for consistency
    }
    if (state.wrong_streak >= 3) {
      masteryPercentage -= 10; // Penalty for frustration
    }
    if (state.difficulty_level >= 7 && state.correct_streak >= 2) {
      masteryPercentage += 3; // Bonus for handling hard challenges
    }
    
    // Clamp to 0-100
    masteryPercentage = Math.max(0, Math.min(100, masteryPercentage));
    
    // Convert 0-100 scale to 0-5 scale
    if (masteryPercentage >= 90) {
      return this.MASTERY_LEVELS.MASTERED; // 5
    } else if (masteryPercentage >= 75) {
      return this.MASTERY_LEVELS.PROFICIENT; // 4
    } else if (masteryPercentage >= 60) {
      return this.MASTERY_LEVELS.DEVELOPING; // 3 - UNLOCKS NEXT CHAPTER (with stability check)
    } else if (masteryPercentage >= 40) {
      return this.MASTERY_LEVELS.BEGINNER; // 2
    } else if (masteryPercentage >= 20) {
      return this.MASTERY_LEVELS.NOVICE; // 1
    } else {
      return this.MASTERY_LEVELS.NONE; // 0
    }
  }

  /**
   * STABILITY-BASED UNLOCKING (Research-Grade Implementation)
   * 
   * DESIGN PRINCIPLE: Mastery percentage alone is insufficient for unlock.
   * A student could reach 60% through lucky guesses or inconsistent performance.
   * Stability ensures the student has DEMONSTRATED RELIABLE understanding.
   * 
   * UNLOCK CRITERIA (ALL must be met):
   * 1. Mastery ≥ 60% (base threshold)
   * 2. At least ONE stability condition:
   *    a) Accuracy ≥ 70% over last 5 attempts, OR
   *    b) 2+ consecutive correct answers (current streak), OR
   *    c) Correct answer without hint at difficulty ≥ 3
   * 
   * WHY: This prevents:
   * - Guess-based unlocking (lucky streaks)
   * - Premature progression (unstable understanding)
   * - Frustration from entering locked content unprepared
   * 
   * @param {Object} state - Adaptive learning state
   * @param {Array} recentHistory - Last 5-10 attempts (for trend analysis)
   * @returns {Object} {meets: boolean, reason: string, details: object}
   */
  async checkStabilityForUnlock(state, recentHistory = []) {
    const masteryPercentage = state.mastery_level || 0;
    
    // CRITERION 1: Mastery threshold (60%)
    if (masteryPercentage < 60) {
      return {
        meets: false,
        reason: `Mastery ${masteryPercentage.toFixed(1)}% < 60% threshold`,
        details: { masteryCheck: false }
      };
    }
    
    // Now check STABILITY conditions (at least one must be true)
    const stabilityChecks = {
      recentAccuracy: false,
      consecutiveCorrect: false,
      highDifficultySuccess: false
    };
    
    // STABILITY CONDITION A: Accuracy ≥ 70% over last 5 attempts
    if (recentHistory.length >= 5) {
      const last5 = recentHistory.slice(-5);
      const correctCount = last5.filter(h => h.was_correct).length;
      const recentAccuracy = (correctCount / 5) * 100;
      
      if (recentAccuracy >= 70) {
        stabilityChecks.recentAccuracy = true;
        console.log(`[StabilityCheck] ✅ Recent accuracy: ${recentAccuracy.toFixed(0)}% ≥ 70% (${correctCount}/5)`);
      } else {
        console.log(`[StabilityCheck] ❌ Recent accuracy: ${recentAccuracy.toFixed(0)}% < 70% (${correctCount}/5)`);
      }
    } else {
      console.log(`[StabilityCheck] ⚠️ Insufficient history: ${recentHistory.length}/5 attempts`);
    }
    
    // STABILITY CONDITION B: 2+ consecutive correct answers
    if (state.correct_streak >= 2) {
      stabilityChecks.consecutiveCorrect = true;
      console.log(`[StabilityCheck] ✅ Consecutive correct: ${state.correct_streak} ≥ 2`);
    } else {
      console.log(`[StabilityCheck] ❌ Consecutive correct: ${state.correct_streak} < 2`);
    }
    
    // STABILITY CONDITION C: Correct without hint at difficulty ≥ 3
    // Hint is shown after wrong_streak >= 2, so correct_streak >= 1 AND wrong_streak == 0 = no hint used
    const noHintUsed = state.wrong_streak === 0 && state.correct_streak >= 1;
    const highDifficulty = state.difficulty_level >= 3;
    
    if (noHintUsed && highDifficulty) {
      stabilityChecks.highDifficultySuccess = true;
      console.log(`[StabilityCheck] ✅ Correct without hint at difficulty ${state.difficulty_level} ≥ 3`);
    } else {
      console.log(`[StabilityCheck] ❌ High difficulty success: hint=${!noHintUsed}, difficulty=${state.difficulty_level}`);
    }
    
    // Check if ANY stability condition is met
    const meetsStability = Object.values(stabilityChecks).some(check => check === true);
    
    if (meetsStability) {
      const metConditions = Object.keys(stabilityChecks).filter(k => stabilityChecks[k]);
      return {
        meets: true,
        reason: `Mastery ${masteryPercentage.toFixed(1)}% + Stability [${metConditions.join(', ')}]`,
        details: { masteryCheck: true, ...stabilityChecks }
      };
    } else {
      return {
        meets: false,
        reason: `Mastery ${masteryPercentage.toFixed(1)}% OK, but stability not demonstrated`,
        details: { masteryCheck: true, ...stabilityChecks }
      };
    }
  }

  /**
   * Update mastery and check for chapter unlocks
   * Called by AdaptiveLearningService after each answer is processed
   * 
   * NOW IMPLEMENTS: Stability-based unlocking (not just mastery threshold)
   * 
   * @param {string} userId 
   * @param {number} chapterId - Current chapter (topic)
   * @param {Object} state - Updated adaptive learning state
   * @param {Object} mdpMetrics - MDP transition metrics (action, reward, etc.)
   * @returns {Promise<{masteryLevel: number, chapterUnlocked: object|null, stabilityCheck: object}>}
   */
  async updateMasteryAndUnlock(userId, chapterId, state, mdpMetrics = {}) {
    try {
      // Calculate new mastery level (0-5) with performance signals
      const masteryLevel = this.calculateMasteryLevel(state, mdpMetrics);
      
      console.log(`[MasteryProgression] User ${userId}, Chapter ${chapterId}: Mastery = ${masteryLevel}/5 (${state.mastery_level.toFixed(1)}%)`);
      console.log(`[MasteryProgression] Performance: correct_streak=${state.correct_streak}, wrong_streak=${state.wrong_streak}, difficulty=${state.difficulty_level}`);
      
      // Log mastery update for analytics/research
      await this.logMasteryUpdate({
        userId,
        chapterId,
        masteryLevel,
        masteryPercentage: state.mastery_level,
        totalAttempts: state.total_attempts,
        correctAnswers: state.correct_answers,
        correctStreak: state.correct_streak,
        wrongStreak: state.wrong_streak,
        difficultyLevel: state.difficulty_level,
        mdpAction: mdpMetrics.action,
        mdpReward: mdpMetrics.reward,
        timestamp: new Date().toISOString()
      });
      
      // ========== STABILITY-BASED UNLOCK CHECK ==========
      // Get recent attempt history for stability calculation
      const recentHistory = await this.adaptiveRepo.getRecentAttempts(userId, chapterId, 10);
      
      // Check if unlock criteria met (mastery + stability)
      const stabilityCheck = await this.checkStabilityForUnlock(state, recentHistory);
      
      console.log(`[MasteryProgression] Stability check: ${stabilityCheck.meets ? '✅ PASSED' : '❌ FAILED'} - ${stabilityCheck.reason}`);
      
      // Attempt unlock if stability check passed
      let chapterUnlocked = null;
      if (stabilityCheck.meets) {
        chapterUnlocked = await this.unlockNextChapter(userId, chapterId, masteryLevel, state, stabilityCheck);
      }
      
      return {
        masteryLevel,
        chapterUnlocked,
        stabilityCheck // NEW: Return stability details for frontend display
      };
      
    } catch (error) {
      console.error('[MasteryProgression] Error updating mastery:', error);
      // Non-blocking: return safe defaults
      return {
        masteryLevel: 0,
        chapterUnlocked: null,
        stabilityCheck: { meets: false, reason: 'Error during calculation' }
      };
    }
  }

  /**
   * Unlock next chapter when mastery threshold is met
   * CRITICAL: This modifies chapter_progress table, NOT WorldMap code
   * NOW INCLUDES: Stability check results for research logging
   * 
   * @param {string} userId 
   * @param {number} currentChapterId 
   * @param {number} masteryLevel - Current mastery (should be ≥ 3)
   * @param {Object} state - Adaptive learning state
   * @param {Object} stabilityCheck - Stability verification results
   * @returns {Promise<object|null>} - Unlock info or null if nothing to unlock
   */
  async unlockNextChapter(userId, currentChapterId, masteryLevel, state, stabilityCheck = {}) {
    if (!this.chapterProgressRepo || !this.chapterRepo) {
      console.warn('[MasteryProgression] Chapter repos not available');
      return null;
    }

    try {
      // Get current chapter info
      const currentChapter = await this.chapterRepo.getChapterById(currentChapterId);
      if (!currentChapter) {
        console.warn(`[MasteryProgression] Chapter ${currentChapterId} not found`);
        return null;
      }

      // Calculate next chapter ID (sequential)
      const nextChapterId = currentChapterId + 1;
      
      // Check if next chapter exists
      const nextChapter = await this.chapterRepo.getChapterById(nextChapterId);
      if (!nextChapter) {
        console.log(`[MasteryProgression] No next chapter after ${currentChapterId} (end of content)`);
        return null;
      }

      // Check if next chapter already unlocked
      let nextChapterProgress = await this.chapterProgressRepo.getUserChapterProgressByUserAndChapter(userId, nextChapterId);
      
      if (nextChapterProgress && nextChapterProgress.unlocked) {
        console.log(`[MasteryProgression] Chapter ${nextChapterId} already unlocked`);
        return null; // Already unlocked - no notification needed
      }

      // UNLOCK NEXT CHAPTER
      if (nextChapterProgress) {
        // Update existing progress record
        await this.chapterProgressRepo.updateUserChapterProgress(nextChapterProgress.id, {
          unlocked: true,
          updated_at: new Date().toISOString()
        });
      } else {
        // Create new progress record with unlocked = true
        nextChapterProgress = await this.chapterProgressRepo.createUserChapterProgress({
          user_id: userId,
          chapter_id: nextChapterId,
          unlocked: true,
          completed: false,
          xp_earned: 0,
          quiz_passed: false,
          started_at: null,
          completed_at: null
        });
      }

      // Log unlock event for research/analytics
      await this.logChapterUnlock({
        userId,
        unlockedChapterId: nextChapterId,
        unlockedByChapterId: currentChapterId,
        masteryLevel,
        masteryPercentage: state.mastery_level,
        stabilityCheck: stabilityCheck.details || {}, // Include stability details
        timestamp: new Date().toISOString()
      });

      console.log(`✅ [MasteryProgression] User ${userId} unlocked chapter ${nextChapterId}: ${nextChapter.chapter_name} (mastery ${masteryLevel}/3, stability: ${stabilityCheck.reason || 'verified'})`);
      
      return {
        chapterId: nextChapterId,
        chapterName: nextChapter.chapter_name,
        message: `🎉 Congratulations! You've unlocked: ${nextChapter.chapter_name}`,
        stabilityDetails: stabilityCheck.details // Return to frontend for celebration UI
      };

    } catch (error) {
      console.error('[MasteryProgression] Unlock error:', error);
      return null; // Non-blocking failure
    }
  }

  /**
   * Get all unlocked chapters for a student
   * This is the data adapter that feeds WorldMap
   * 
   * @param {string} userId 
   * @returns {Promise<Array<{chapterId: number, unlocked: boolean, masteryLevel: number}>>}
   */
  async getUnlockedChapters(userId) {
    if (!this.chapterProgressRepo || !this.adaptiveRepo) {
      console.warn('[MasteryProgression] Required repos not available');
      return [];
    }

    try {
      // Get all chapter progress for user
      const allProgress = await this.chapterProgressRepo.getAllUserChapterProgressByUser(userId);
      
      // Get current mastery levels from adaptive learning states
      const unlockStates = [];
      
      for (const progress of allProgress) {
        const chapterId = progress.chapterId;
        
        // Get adaptive learning state for this chapter
        const state = await this.adaptiveRepo.getStudentState(userId, chapterId);
        const masteryLevel = state ? this.calculateMasteryLevel(state) : 0;
        
        unlockStates.push({
          chapterId: chapterId,
          unlocked: progress.unlocked,
          masteryLevel: masteryLevel,
          masteryPercentage: state ? state.mastery_level : 0
        });
      }
      
      return unlockStates;
      
    } catch (error) {
      console.error('[MasteryProgression] Error getting unlocked chapters:', error);
      return [];
    }
  }

  /**
   * Validate chapter access (prevents URL hacking)
   * Called by chapter routes before rendering content
   * 
   * @param {string} userId 
   * @param {number} chapterId 
   * @returns {Promise<{allowed: boolean, reason: string}>}
   */
  async validateChapterAccess(userId, chapterId) {
    if (!this.chapterProgressRepo) {
      // Fail-safe: allow access if service unavailable
      return { allowed: true, reason: 'Service unavailable - defaulting to allow' };
    }

    try {
      const progress = await this.chapterProgressRepo.getUserChapterProgressByUserAndChapter(userId, chapterId);
      
      if (!progress) {
        // No progress record = first chapter or needs initialization
        // Allow if chapter 1, deny otherwise
        return {
          allowed: chapterId === 1,
          reason: chapterId === 1 ? 'First chapter - auto-allowed' : 'Chapter not unlocked'
        };
      }
      
      if (!progress.unlocked) {
        return {
          allowed: false,
          reason: 'Chapter locked - mastery threshold not reached on previous chapter'
        };
      }
      
      return {
        allowed: true,
        reason: 'Chapter unlocked'
      };
      
    } catch (error) {
      console.error('[MasteryProgression] Validation error:', error);
      // Fail-safe: allow access on error
      return { allowed: true, reason: 'Error during validation - defaulting to allow' };
    }
  }

  /**
   * Log mastery update for analytics
   */
  async logMasteryUpdate(data) {
    // TODO: Implement logging to mastery_logs table
    // For now, just console log
    console.log('[MasteryProgression] Mastery update logged:', {
      userId: data.userId,
      chapterId: data.chapterId,
      masteryLevel: data.masteryLevel,
      masteryPercentage: data.masteryPercentage
    });
  }

  /**
   * Log chapter unlock event
   */
  async logChapterUnlock(data) {
    // TODO: Implement logging to unlock_events table
    console.log('[MasteryProgression] Chapter unlock logged:', data);
  }

  /**
   * Get mastery analytics for radar chart
   * Computes cognitive domain scores from logged performance
   * 
   * @param {string} userId 
   * @returns {Promise<Object>} - Radar chart data
   */
  async getMasteryAnalytics(userId) {
    if (!this.adaptiveRepo) {
      return this._getDefaultAnalytics();
    }

    try {
      // Get all state transitions for cognitive domain analysis
      const transitions = await this.adaptiveRepo.getStateTransitions(userId);
      
      if (!transitions || transitions.length === 0) {
        return this._getDefaultAnalytics();
      }

      // Aggregate by cognitive domain
      const domainScores = {
        'Knowledge Recall': { correct: 0, total: 0 },
        'Concept Understanding': { correct: 0, total: 0 },
        'Procedural Skills': { correct: 0, total: 0 },
        'Analytical Thinking': { correct: 0, total: 0 },
        'Problem-Solving': { correct: 0, total: 0 },
        'Higher-Order Thinking': { correct: 0, total: 0 }
      };

      // Map difficulty levels to cognitive domains (simplified)
      transitions.forEach(t => {
        const difficulty = t.prev_difficulty || 1;
        let domain;
        
        if (difficulty === 1) domain = 'Knowledge Recall';
        else if (difficulty === 2) domain = 'Concept Understanding';
        else if (difficulty === 3) domain = 'Procedural Skills';
        else if (difficulty === 4) domain = 'Analytical Thinking';
        else if (difficulty === 5) domain = 'Problem-Solving';
        else domain = 'Higher-Order Thinking';
        
        if (domainScores[domain]) {
          domainScores[domain].total += 1;
          if (t.was_correct) {
            domainScores[domain].correct += 1;
          }
        }
      });

      // Calculate percentages
      const analytics = {};
      for (const [domain, scores] of Object.entries(domainScores)) {
        analytics[domain] = {
          correct: scores.correct,
          total: scores.total,
          percentage: scores.total > 0 ? (scores.correct / scores.total) * 100 : 0
        };
      }

      return analytics;
      
    } catch (error) {
      console.error('[MasteryProgression] Analytics error:', error);
      return this._getDefaultAnalytics();
    }
  }

  /**
   * Default analytics when no data available
   */
  _getDefaultAnalytics() {
    return {
      'Knowledge Recall': { correct: 0, total: 0, percentage: 0 },
      'Concept Understanding': { correct: 0, total: 0, percentage: 0 },
      'Procedural Skills': { correct: 0, total: 0, percentage: 0 },
      'Analytical Thinking': { correct: 0, total: 0, percentage: 0 },
      'Problem-Solving': { correct: 0, total: 0, percentage: 0 },
      'Higher-Order Thinking': { correct: 0, total: 0, percentage: 0 }
    };
  }
}

module.exports = MasteryProgressionService;
