/**
 * AdaptiveLearningService
 * Implements rule-based MDP for adaptive difficulty adjustment
 * Research Focus: Test if adaptive difficulty improves learning outcomes
 */
class AdaptiveLearningService {
  constructor(adaptiveLearningRepo) {
    this.repo = adaptiveLearningRepo;
    
    // MDP Actions
    this.ACTIONS = {
      DECREASE_DIFFICULTY: 'decrease_difficulty',
      MAINTAIN_DIFFICULTY: 'maintain_difficulty',
      INCREASE_DIFFICULTY: 'increase_difficulty',
      ADVANCE_CHAPTER: 'advance_chapter',
      REPEAT_CURRENT: 'repeat_current'
    };

    // Reward values
    this.REWARDS = {
      MASTERY_IMPROVED: 5,
      CORRECT_ANSWER: 2,
      MAINTAINED_HIGH_MASTERY: 3,
      ADVANCED_CHAPTER: 10,
      MASTERY_DECREASED: -2,
      FRUSTRATION: -5,
      BOREDOM: -3
    };
  }

  /**
   * Main entry point: Process student answer and adjust difficulty
   */
  async processAnswer(userId, chapterId, questionId, isCorrect, timeSpent) {
    try {
      // 1. Get current state
      const currentState = await this.repo.getStudentDifficulty(userId, chapterId);
      
      // 2. Update performance metrics
      const newState = await this.updatePerformanceMetrics(
        userId, 
        chapterId, 
        currentState, 
        isCorrect
      );

      // 3. Determine next action using rule-based policy
      const { action, reason } = this.determineAction(newState);

      // 4. Apply action (adjust difficulty if needed)
      const updatedState = await this.applyAction(userId, chapterId, newState, action);

      // 5. Calculate reward
      const reward = this.calculateReward(currentState, newState, action);

      // 6. Log transition for research
      await this.repo.logStateTransition({
        userId,
        chapterId,
        prevState: currentState,
        action,
        actionReason: reason,
        newState: updatedState,
        reward,
        questionId,
        wasCorrect: isCorrect,
        timeSpent,
        sessionId: this.generateSessionId(userId),
        metadata: {
          timestamp: new Date().toISOString()
        }
      });

      return {
        success: true,
        isCorrect,
        currentDifficulty: updatedState.difficulty_level,
        masteryLevel: updatedState.mastery_level,
        action,
        actionReason: reason,
        feedback: this.generateFeedback(updatedState, action)
      };
    } catch (error) {
      console.error('Error processing answer:', error);
      throw error;
    }
  }

  /**
   * Update student's performance metrics based on answer
   */
  async updatePerformanceMetrics(userId, chapterId, currentState, isCorrect) {
    const totalAttempts = currentState.total_attempts + 1;
    const correctAnswers = currentState.correct_answers + (isCorrect ? 1 : 0);
    const correctStreak = isCorrect ? currentState.correct_streak + 1 : 0;
    const wrongStreak = !isCorrect ? currentState.wrong_streak + 1 : 0;

    // Calculate mastery level (0-100)
    const accuracy = (correctAnswers / totalAttempts) * 100;
    const streakBonus = Math.min(correctStreak * 3, 15);
    const streakPenalty = Math.min(wrongStreak * 3, 15);
    const masteryLevel = Math.max(0, Math.min(100, accuracy + streakBonus - streakPenalty));

    const updates = {
      total_attempts: totalAttempts,
      correct_answers: correctAnswers,
      correct_streak: correctStreak,
      wrong_streak: wrongStreak,
      mastery_level: masteryLevel
    };

    return await this.repo.updateStudentDifficulty(userId, chapterId, updates);
  }

  /**
   * Rule-Based Policy: Determine what action to take based on current state
   */
  determineAction(state) {
    const { mastery_level, correct_streak, wrong_streak, difficulty_level } = state;

    // Rule 1: Student is frustrated (3+ wrong in a row)
    if (wrong_streak >= 3 && difficulty_level > 1) {
      return {
        action: this.ACTIONS.DECREASE_DIFFICULTY,
        reason: `Frustration detected: ${wrong_streak} wrong answers in a row. Decreasing difficulty to build confidence.`
      };
    }

    // Rule 2: Student mastered and ready to advance
    if (mastery_level >= 85 && correct_streak >= 3 && difficulty_level === 5) {
      return {
        action: this.ACTIONS.ADVANCE_CHAPTER,
        reason: `Mastery achieved: ${mastery_level.toFixed(1)}% with ${correct_streak} correct streak. Ready for next chapter.`
      };
    }

    // Rule 3: Student doing well, increase difficulty
    if (correct_streak >= 5 && mastery_level >= 75 && difficulty_level < 5) {
      return {
        action: this.ACTIONS.INCREASE_DIFFICULTY,
        reason: `Strong performance: ${correct_streak} correct streak with ${mastery_level.toFixed(1)}% mastery. Increasing challenge.`
      };
    }

    // Rule 4: Student is bored (too easy, 8+ correct at low difficulty)
    if (correct_streak >= 8 && difficulty_level <= 2 && mastery_level >= 80) {
      return {
        action: this.ACTIONS.INCREASE_DIFFICULTY,
        reason: `Content too easy: ${correct_streak} correct streak at low difficulty. Adding challenge.`
      };
    }

    // Rule 5: Student struggling but not frustrated yet
    if (wrong_streak === 2 && mastery_level < 50) {
      return {
        action: this.ACTIONS.REPEAT_CURRENT,
        reason: `Building foundation: ${wrong_streak} wrong answers. Repeating current difficulty to strengthen understanding.`
      };
    }

    // Rule 6: Student needs more practice at current level
    if (mastery_level < 60 && correct_streak < 3 && wrong_streak < 2) {
      return {
        action: this.ACTIONS.MAINTAIN_DIFFICULTY,
        reason: `Steady progress: ${mastery_level.toFixed(1)}% mastery. Continuing at current difficulty.`
      };
    }

    // Default: Maintain current difficulty
    return {
      action: this.ACTIONS.MAINTAIN_DIFFICULTY,
      reason: `Balanced performance: ${mastery_level.toFixed(1)}% mastery with ${correct_streak} correct streak. Maintaining current level.`
    };
  }

  /**
   * Apply the determined action (adjust difficulty)
   */
  async applyAction(userId, chapterId, currentState, action) {
    let newDifficulty = currentState.difficulty_level;

    switch (action) {
      case this.ACTIONS.DECREASE_DIFFICULTY:
        newDifficulty = Math.max(1, currentState.difficulty_level - 1);
        break;
      case this.ACTIONS.INCREASE_DIFFICULTY:
        newDifficulty = Math.min(5, currentState.difficulty_level + 1);
        break;
      case this.ACTIONS.ADVANCE_CHAPTER:
        // Keep current difficulty or reset to medium for new chapter
        newDifficulty = 3;
        break;
      case this.ACTIONS.REPEAT_CURRENT:
      case this.ACTIONS.MAINTAIN_DIFFICULTY:
      default:
        // No change
        newDifficulty = currentState.difficulty_level;
    }

    if (newDifficulty !== currentState.difficulty_level) {
      return await this.repo.updateStudentDifficulty(userId, chapterId, {
        difficulty_level: newDifficulty
      });
    }

    return currentState;
  }

  /**
   * Calculate reward for the state transition (for research analysis)
   */
  calculateReward(prevState, newState, action) {
    let reward = 0;

    // Positive rewards
    if (newState.mastery_level > prevState.mastery_level) {
      reward += this.REWARDS.MASTERY_IMPROVED;
    }
    
    if (newState.correct_streak > 0) {
      reward += this.REWARDS.CORRECT_ANSWER;
    }

    if (newState.mastery_level >= 75) {
      reward += this.REWARDS.MAINTAINED_HIGH_MASTERY;
    }

    if (action === this.ACTIONS.ADVANCE_CHAPTER) {
      reward += this.REWARDS.ADVANCED_CHAPTER;
    }

    // Negative rewards
    if (newState.mastery_level < prevState.mastery_level) {
      reward += this.REWARDS.MASTERY_DECREASED;
    }

    if (newState.wrong_streak >= 5) {
      reward += this.REWARDS.FRUSTRATION;
    }

    if (newState.correct_streak >= 10 && newState.difficulty_level <= 2) {
      reward += this.REWARDS.BOREDOM;
    }

    return reward;
  }

  /**
   * Get adaptive questions based on student's current difficulty
   */
  async getAdaptiveQuestions(userId, chapterId, count = 10) {
    try {
      const state = await this.repo.getStudentDifficulty(userId, chapterId);
      const questions = await this.repo.getQuestionsByDifficulty(
        chapterId,
        state.difficulty_level,
        count
      );

      return {
        questions,
        currentDifficulty: state.difficulty_level,
        masteryLevel: state.mastery_level,
        difficultyLabel: this.getDifficultyLabel(state.difficulty_level)
      };
    } catch (error) {
      console.error('Error getting adaptive questions:', error);
      throw error;
    }
  }

  /**
   * Get student's current state and performance
   */
  async getStudentState(userId, chapterId) {
    try {
      const state = await this.repo.getStudentDifficulty(userId, chapterId);
      const history = await this.repo.getPerformanceHistory(userId, chapterId, 10);

      return {
        currentDifficulty: state.difficulty_level,
        difficultyLabel: this.getDifficultyLabel(state.difficulty_level),
        masteryLevel: state.mastery_level,
        correctStreak: state.correct_streak,
        wrongStreak: state.wrong_streak,
        totalAttempts: state.total_attempts,
        accuracy: state.total_attempts > 0 
          ? (state.correct_answers / state.total_attempts * 100).toFixed(1)
          : 0,
        recentHistory: history.map(h => ({
          action: h.action,
          wasCorrect: h.was_correct,
          difficultyChange: h.new_difficulty - h.prev_difficulty,
          timestamp: h.timestamp
        }))
      };
    } catch (error) {
      console.error('Error getting student state:', error);
      throw error;
    }
  }

  /**
   * Get research statistics (for analysis)
   */
  async getResearchStats(chapterId = null) {
    try {
      return await this.repo.getResearchStatistics(chapterId);
    } catch (error) {
      console.error('Error getting research stats:', error);
      throw error;
    }
  }

  /**
   * Helper: Generate user-friendly feedback message
   */
  generateFeedback(state, action) {
    const messages = {
      [this.ACTIONS.DECREASE_DIFFICULTY]: "Let's try some easier questions to build your confidence! 💪",
      [this.ACTIONS.INCREASE_DIFFICULTY]: "Great job! Ready for a bigger challenge? 🚀",
      [this.ACTIONS.ADVANCE_CHAPTER]: "Excellent! You've mastered this chapter! 🎉",
      [this.ACTIONS.MAINTAIN_DIFFICULTY]: "Keep going! You're making good progress! 📈",
      [this.ACTIONS.REPEAT_CURRENT]: "Practice makes perfect! Let's strengthen your understanding. 📚"
    };

    return messages[action] || "Keep learning! 👍";
  }

  /**
   * Helper: Get difficulty label
   */
  getDifficultyLabel(level) {
    const labels = {
      1: 'Very Easy',
      2: 'Easy',
      3: 'Medium',
      4: 'Hard',
      5: 'Very Hard'
    };
    return labels[level] || 'Unknown';
  }

  /**
   * Helper: Generate session ID
   */
  generateSessionId(userId) {
    return `${userId}-${Date.now()}`;
  }
}

module.exports = AdaptiveLearningService;
