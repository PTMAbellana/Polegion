/**
 * Performance Analytics Service
 * 
 * SINGLE RESPONSIBILITY: Analyze learning patterns and generate statistics
 * 
 * Handles:
 * - Learning pattern analysis
 * - Research statistics generation
 * - Performance trend detection
 * - Diagnostic reporting
 */

class PerformanceAnalyticsService {
  constructor(adaptiveLearningRepo) {
    this.repo = adaptiveLearningRepo;
  }

  /**
   * Analyze learning pattern for a user on a specific topic
   * Detects trends, struggles, and strengths
   */
  async analyzeLearningPattern(userId, topicId) {
    try {
      const recentTransitions = await this.repo.getRecentTransitions(userId, topicId, 10);
      const currentState = await this.repo.getUserTopicState(userId, topicId);

      if (!recentTransitions || recentTransitions.length === 0) {
        return {
          pattern: 'insufficient_data',
          recommendation: 'continue_practice',
          confidence: 0
        };
      }

      // Analyze correctness trend
      const correctCount = recentTransitions.filter(t => t.was_correct).length;
      const accuracy = correctCount / recentTransitions.length;

      // Analyze mastery trend
      const masteryValues = recentTransitions.map(t => t.new_mastery || 0);
      const masteryTrend = this._calculateTrend(masteryValues);

      // Analyze difficulty changes
      const difficultyValues = recentTransitions.map(t => t.new_difficulty || 3);
      const avgDifficulty = difficultyValues.reduce((a, b) => a + b, 0) / difficultyValues.length;

      // Detect patterns
      let pattern = 'steady';
      let recommendation = 'continue';

      if (masteryTrend > 0.1 && accuracy > 0.7) {
        pattern = 'improving';
        recommendation = 'increase_difficulty';
      } else if (masteryTrend < -0.1 || accuracy < 0.4) {
        pattern = 'struggling';
        recommendation = 'decrease_difficulty';
      } else if (accuracy > 0.8 && avgDifficulty < 4) {
        pattern = 'ready_to_advance';
        recommendation = 'increase_challenge';
      } else if (currentState?.wrong_streak >= 3) {
        pattern = 'frustrated';
        recommendation = 'provide_support';
      }

      return {
        pattern,
        recommendation,
        confidence: Math.min(recentTransitions.length / 10, 1),
        metrics: {
          accuracy,
          masteryTrend,
          avgDifficulty,
          correctStreak: currentState?.correct_streak || 0,
          wrongStreak: currentState?.wrong_streak || 0
        }
      };
    } catch (error) {
      console.error('[PerformanceAnalytics] Error analyzing learning pattern:', error);
      return {
        pattern: 'error',
        recommendation: 'continue_practice',
        confidence: 0
      };
    }
  }

  /**
   * Get research statistics for analysis
   * Aggregates data across all users or specific topic
   */
  async getResearchStats(topicId = null) {
    try {
      const stats = {
        overview: {},
        qLearning: {},
        performance: {},
        topics: []
      };

      // Overall statistics
      const allStates = await this.repo.getAllUserStates(topicId);
      
      stats.overview = {
        totalUsers: new Set(allStates.map(s => s.user_id)).size,
        totalTopics: topicId ? 1 : new Set(allStates.map(s => s.topic_id)).size,
        totalAttempts: allStates.reduce((sum, s) => sum + (s.total_attempts || 0), 0),
        avgMastery: this._average(allStates.map(s => s.mastery_level || 0))
      };

      // Q-Learning statistics
      const allTransitions = await this.repo.getAllTransitions(topicId);
      
      stats.qLearning = {
        totalTransitions: allTransitions.length,
        explorationRate: this._average(allTransitions.map(t => t.epsilon || 0)),
        avgReward: this._average(allTransitions.map(t => t.reward || 0)),
        actionDistribution: this._countActions(allTransitions)
      };

      // Performance statistics
      const correctCount = allTransitions.filter(t => t.was_correct).length;
      
      stats.performance = {
        overallAccuracy: allTransitions.length > 0 ? correctCount / allTransitions.length : 0,
        avgTimeSpent: this._average(allTransitions.map(t => t.time_spent || 0).filter(t => t > 0)),
        difficultyDistribution: this._countDifficulties(allTransitions)
      };

      // Topic-specific statistics
      if (!topicId) {
        const topics = await this.repo.getAllTopics();
        
        for (const topic of topics) {
          const topicStates = allStates.filter(s => s.topic_id === topic.id);
          const topicTransitions = allTransitions.filter(t => t.topic_id === topic.id);
          
          stats.topics.push({
            topicId: topic.id,
            topicName: topic.topic_name,
            totalUsers: new Set(topicStates.map(s => s.user_id)).size,
            avgMastery: this._average(topicStates.map(s => s.mastery_level || 0)),
            totalAttempts: topicTransitions.length,
            accuracy: topicTransitions.length > 0 
              ? topicTransitions.filter(t => t.was_correct).length / topicTransitions.length 
              : 0
          });
        }
      }

      return stats;
    } catch (error) {
      console.error('[PerformanceAnalytics] Error getting research stats:', error);
      return {
        overview: {},
        qLearning: {},
        performance: {},
        topics: [],
        error: error.message
      };
    }
  }

  /**
   * Helper: Calculate trend (simple linear regression slope)
   */
  _calculateTrend(values) {
    if (values.length < 2) return 0;
    
    const n = values.length;
    const sumX = (n * (n - 1)) / 2; // Sum of indices 0,1,2,...,n-1
    const sumY = values.reduce((a, b) => a + b, 0);
    const sumXY = values.reduce((sum, y, x) => sum + x * y, 0);
    const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6; // Sum of squares
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    
    return isNaN(slope) ? 0 : slope;
  }

  /**
   * Helper: Calculate average
   */
  _average(values) {
    if (values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  /**
   * Helper: Count action occurrences
   */
  _countActions(transitions) {
    const counts = {};
    
    for (const t of transitions) {
      const action = t.action || 'unknown';
      counts[action] = (counts[action] || 0) + 1;
    }
    
    return counts;
  }

  /**
   * Helper: Count difficulty levels
   */
  _countDifficulties(transitions) {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    for (const t of transitions) {
      const difficulty = t.new_difficulty || 3;
      if (difficulty >= 1 && difficulty <= 5) {
        counts[difficulty]++;
      }
    }
    
    return counts;
  }

  /**
   * Get user performance summary
   */
  async getUserPerformanceSummary(userId, topicId = null) {
    try {
      const states = topicId 
        ? [await this.repo.getUserTopicState(userId, topicId)]
        : await this.repo.getAllUserStates(null, userId);

      const transitions = await this.repo.getRecentTransitions(userId, topicId, 50);

      const summary = {
        totalTopicsPracticed: states.length,
        avgMastery: this._average(states.map(s => s?.mastery_level || 0)),
        totalAttempts: states.reduce((sum, s) => sum + (s?.total_attempts || 0), 0),
        overallAccuracy: transitions.length > 0 
          ? transitions.filter(t => t.was_correct).length / transitions.length 
          : 0,
        currentStreaks: {
          longest: Math.max(...states.map(s => s?.correct_streak || 0), 0),
          current: topicId ? states[0]?.correct_streak || 0 : 0
        }
      };

      return summary;
    } catch (error) {
      console.error('[PerformanceAnalytics] Error getting user summary:', error);
      return null;
    }
  }
}

module.exports = PerformanceAnalyticsService;
