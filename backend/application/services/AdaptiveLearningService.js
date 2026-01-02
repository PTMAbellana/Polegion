/**
 * AdaptiveLearningService
 * Implements MDP with Q-Learning for adaptive difficulty adjustment
 * Research Focus: Test if adaptive difficulty improves learning outcomes
 * 
 * Key AI Features:
 * - Q-Learning algorithm for optimal action selection
 * - Epsilon-greedy exploration strategy
 * - Advanced reward shaping based on learning theory
 * - State representation with multiple performance indicators
 * - Performance prediction using historical patterns
 * - Parametric question generation (infinite unique variations)
 */

const QuestionGeneratorService = require('./QuestionGeneratorService');

class AdaptiveLearningService {
  constructor(adaptiveLearningRepo) {
    this.repo = adaptiveLearningRepo;
    this.questionGenerator = new QuestionGeneratorService();
    
    // MDP Actions - Enhanced with Pedagogical Strategies
    this.ACTIONS = {
      // Difficulty adjustments
      DECREASE_DIFFICULTY: 'decrease_difficulty',
      MAINTAIN_DIFFICULTY: 'maintain_difficulty',
      INCREASE_DIFFICULTY: 'increase_difficulty',
      
      // Teaching strategy changes
      REPEAT_DIFFERENT_REPRESENTATION: 'repeat_same_concept_different_representation',
      SWITCH_TO_VISUAL: 'switch_to_visual_example',
      SWITCH_TO_REAL_WORLD: 'switch_to_real_world_context',
      GIVE_HINT_RETRY: 'give_hint_then_retry',
      
      // Topic navigation
      ADVANCE_TOPIC: 'advance_to_next_topic',
      REVIEW_PREREQUISITE: 'review_prerequisite_topic',
      REPEAT_CURRENT: 'repeat_current'
    };

    // Representation types for multi-modal learning
    this.REPRESENTATIONS = {
      TEXT: 'text',           // Symbolic/algebraic representation
      VISUAL: 'visual',       // Diagrams, illustrations
      REAL_WORLD: 'real_world' // Contextual, real-life examples
    };

    // Q-Learning Parameters
    this.LEARNING_RATE = 0.15;      // Alpha: how quickly to update Q-values
    this.DISCOUNT_FACTOR = 0.9;     // Gamma: importance of future rewards
    this.INITIAL_EPSILON = 0.2;     // Initial exploration rate (20%)
    this.EPSILON_DECAY = 0.995;     // Decay exploration over time
    this.MIN_EPSILON = 0.05;        // Minimum exploration rate (5%)
    
    // Q-Table: stores learned Q-values for state-action pairs
    // Structure: { stateKey: { action: qValue } }
    this.qTable = new Map();

    // Reward values - Educational Psychology Based
    this.REWARDS = {
      // Positive outcomes
      ADVANCE_WITH_MASTERY: 10,       // Student ready to progress
      OPTIMAL_CHALLENGE_ZONE: 7,      // "Flow state" - just right difficulty
      IMPROVED_AFTER_STRATEGY: 3,     // Strategy change helped
      CORRECT_ANSWER: 2,
      MAINTAINED_HIGH_MASTERY: 3,
      RAPID_MASTERY: 8,
      
      // Negative outcomes (pedagogical failures)
      BOREDOM: -3,                    // Too easy, long correct streak
      FRUSTRATION: -5,                // Too hard, repeated failures
      POOR_ADAPTATION: -7,            // Repeating failures with no strategy change
      MASTERY_DECREASED: -2,
      MISCONCEPTION_REPEATED: -6      // Same error pattern without intervention
    };
  }

  /**
   * Main entry point: Process student answer and adjust difficulty
   * Uses Q-Learning to determine optimal action
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
        isCorrect,
        timeSpent
      );

      // 3. Create state representations for Q-learning
      const currentStateKey = this.getStateKey(currentState);
      const newStateKey = this.getStateKey(newState);

      // 4. Determine next action using Q-learning with epsilon-greedy policy
      const actionResult = await this.selectActionQLearning(
        newStateKey, 
        newState
      );
      const { action, reason, usedExploration, pedagogicalStrategy, representationType } = actionResult;

      // 5. Apply action (adjust difficulty and/or teaching strategy)
      const updatedState = await this.applyAction(userId, chapterId, newState, action, actionResult);

      // 6. Calculate reward based on learning theory
      const reward = this.calculateAdvancedReward(currentState, newState, action, timeSpent);

      // 7. Update Q-value using Q-learning update rule
      await this.updateQValue(currentStateKey, action, reward, newStateKey);

      // 8. Log transition for research analysis
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
        usedExploration,
        qValue: this.getQValue(newStateKey, action),
        sessionId: this.generateSessionId(userId),
        metadata: {
          timestamp: new Date().toISOString(),
          epsilon: this.getCurrentEpsilon(updatedState.total_attempts)
        }
      });

      return {
        success: true,
        isCorrect,
        currentDifficulty: updatedState.difficulty_level,
        masteryLevel: updatedState.mastery_level,
        action,
        actionReason: reason,
        feedback: this.generateFeedback(updatedState, action),
        reward, // Include for debugging/research
        learningMode: usedExploration ? 'exploring' : 'exploiting'
      };
    } catch (error) {
      console.error('Error processing answer:', error);
      throw error;
    }
  }

  /**
   * Update student's performance metrics based on answer
   * Enhanced with time-based learning indicators
   */
  async updatePerformanceMetrics(userId, chapterId, currentState, isCorrect, timeSpent) {
    const totalAttempts = currentState.total_attempts + 1;
    const correctAnswers = currentState.correct_answers + (isCorrect ? 1 : 0);
    const correctStreak = isCorrect ? currentState.correct_streak + 1 : 0;
    const wrongStreak = !isCorrect ? currentState.wrong_streak + 1 : 0;

    // Calculate mastery level (0-100) with advanced factors
    const accuracy = (correctAnswers / totalAttempts) * 100;
    
    // Streak bonus: rewards consistency (max 20 points)
    const streakBonus = Math.min(correctStreak * 4, 20);
    
    // Streak penalty: indicates struggling (max 20 points)
    const streakPenalty = Math.min(wrongStreak * 4, 20);
    
    // Difficulty adjustment: higher difficulty correct answers worth more
    const difficultyBonus = isCorrect ? (currentState.difficulty_level - 3) * 2 : 0;
    
    // Time factor: penalize if taking too long (indicates uncertainty)
    const expectedTime = 60; // 60 seconds per question baseline
    const timeFactor = timeSpent > expectedTime * 2 ? -5 : 0;
    
    // Calculate final mastery with all factors
    let masteryLevel = accuracy + streakBonus - streakPenalty + difficultyBonus + timeFactor;
    masteryLevel = Math.max(0, Math.min(100, masteryLevel));

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
   * Generate state key for Q-table
   * Discretizes continuous state space into buckets
   */
  getStateKey(state) {
    // Discretize mastery level into ranges
    const masteryBucket = Math.floor(state.mastery_level / 20); // 0-4 (0-20, 20-40, 40-60, 60-80, 80-100)
    
    // Discretize streaks (cap at 5+)
    const correctStreakBucket = Math.min(Math.floor(state.correct_streak / 2), 3); // 0, 1-2, 3-4, 5+
    const wrongStreakBucket = Math.min(state.wrong_streak, 3); // 0, 1, 2, 3+
    
    // Current difficulty level
    const difficulty = state.difficulty_level;
    
    // Create state key combining all features
    return `M${masteryBucket}_D${difficulty}_C${correctStreakBucket}_W${wrongStreakBucket}`;
  }

  /**
   * Q-Learning: Select action using epsilon-greedy policy
   * Balance exploration (trying new actions) vs exploitation (using best known action)
   */
  async selectActionQLearning(stateKey, state) {
    const epsilon = this.getCurrentEpsilon(state.total_attempts);
    const random = Math.random();

    // Exploration: Random action
    if (random < epsilon) {
      const actions = Object.values(this.ACTIONS);
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      return {
        action: randomAction,
        reason: `[Exploration] Trying ${randomAction} to learn (ε=${epsilon.toFixed(3)})`,
        usedExploration: true
      };
    }

    // Exploitation: Choose action with highest Q-value
    let bestAction = null;
    let bestQValue = -Infinity;

    for (const action of Object.values(this.ACTIONS)) {
      const qValue = this.getQValue(stateKey, action);
      if (qValue > bestQValue) {
        bestQValue = qValue;
        bestAction = action;
      }
    }

    // If no Q-values exist yet, fall back to rule-based policy
    if (bestAction === null || bestQValue === 0) {
      const fallback = this.determineActionRuleBased(state);
      return {
        ...fallback,
        usedExploration: false,
        reason: `[Bootstrap] ${fallback.reason} (no Q-values yet)`
      };
    }

    return {
      action: bestAction,
      reason: `[Exploitation] Best action based on Q-value=${bestQValue.toFixed(2)}`,
      usedExploration: false
    };
  }

  /**
   * Get Q-value for state-action pair
   */
  getQValue(stateKey, action) {
    if (!this.qTable.has(stateKey)) {
      this.qTable.set(stateKey, {});
    }
    const stateActions = this.qTable.get(stateKey);
    return stateActions[action] || 0; // Initialize to 0 if not seen
  }

  /**
   * Update Q-value using Q-learning update rule
   * Q(s,a) ← Q(s,a) + α[r + γ·max Q(s',a') - Q(s,a)]
   */
  async updateQValue(currentStateKey, action, reward, nextStateKey) {
    const currentQ = this.getQValue(currentStateKey, action);
    
    // Find max Q-value for next state
    let maxNextQ = -Infinity;
    for (const nextAction of Object.values(this.ACTIONS)) {
      const nextQ = this.getQValue(nextStateKey, nextAction);
      if (nextQ > maxNextQ) {
        maxNextQ = nextQ;
      }
    }
    
    // If next state has no Q-values, use 0
    if (maxNextQ === -Infinity) {
      maxNextQ = 0;
    }

    // Q-learning update rule
    const newQ = currentQ + this.LEARNING_RATE * (
      reward + this.DISCOUNT_FACTOR * maxNextQ - currentQ
    );

    // Store updated Q-value
    if (!this.qTable.has(currentStateKey)) {
      this.qTable.set(currentStateKey, {});
    }
    this.qTable.get(currentStateKey)[action] = newQ;

    // Optional: Persist Q-table to database for research analysis
    // await this.repo.saveQValue(currentStateKey, action, newQ);
  }

  /**
   * Calculate epsilon (exploration rate) with decay
   * Starts high (20%), decays to minimum (5%) as student completes more attempts
   */
  getCurrentEpsilon(totalAttempts) {
    const epsilon = this.INITIAL_EPSILON * Math.pow(this.EPSILON_DECAY, totalAttempts);
    return Math.max(this.MIN_EPSILON, epsilon);
  }

  /**
   * Detect Misconception Patterns
   * Educational Psychology: Identifies if student is making the same type of error repeatedly
   * Critical for changing teaching approach instead of repeating failed methods
   */
  async detectMisconception(userId, chapterId) {
    try {
      // Get recent answer history (last 5-10 attempts)
      const recentHistory = await this.repo.getRecentAttempts(userId, chapterId, 10);
      
      if (!recentHistory || recentHistory.length < 3) {
        return null;
      }

      const incorrectAnswers = recentHistory.filter(a => !a.was_correct);
      
      if (incorrectAnswers.length < 2) {
        return null; // Not enough errors to detect pattern
      }

      // Pattern 1: Same representation type keeps failing
      const representations = incorrectAnswers.map(a => a.representation_type || 'text');
      const sameRepCount = representations.filter(r => r === representations[0]).length;
      
      if (sameRepCount === incorrectAnswers.length && incorrectAnswers.length >= 2) {
        return {
          type: 'representation_issue',
          pattern: representations[0],
          count: sameRepCount,
          recommendation: this.ACTIONS.REPEAT_DIFFERENT_REPRESENTATION
        };
      }

      // Pattern 2: Stuck at same difficulty level
      const difficulties = incorrectAnswers.map(a => a.prev_difficulty || a.new_difficulty);
      const sameDiffCount = difficulties.filter(d => d === difficulties[0]).length;
      
      if (sameDiffCount >= 3 && difficulties[0] > 2) {
        return {
          type: 'difficulty_mismatch',
          pattern: `stuck_at_level_${difficulties[0]}`,
          count: sameDiffCount,
          recommendation: this.ACTIONS.DECREASE_DIFFICULTY
        };
      }

      // Pattern 3: Prerequisite gaps (failures at beginner level)
      const beginnerFailures = incorrectAnswers.filter(a => 
        (a.prev_difficulty || a.new_difficulty || 3) <= 2
      );
      if (beginnerFailures.length >= 3) {
        return {
          type: 'prerequisite_gap',
          pattern: 'basic_concept_confusion',
          count: beginnerFailures.length,
          recommendation: this.ACTIONS.REVIEW_PREREQUISITE
        };
      }

      return null;
    } catch (error) {
      console.error('Error detecting misconception:', error);
      return null;
    }
  }

  /**
   * Enhanced Pedagogical Policy: Fallback when Q-values not yet learned
   * CRITICAL: Changes teaching approach, not just difficulty
   * Based on educational psychology - DO NOT repeat failed methods
   */
  async determineActionRuleBased(state) {
    const { 
      mastery_level, 
      correct_streak, 
      wrong_streak, 
      difficulty_level,
      current_representation = 'text',
      user_id,
      chapter_id
    } = state;

    // PRIORITY 1: Detect misconceptions (change approach!)
    const misconception = await this.detectMisconception(user_id, chapter_id);
    
    if (misconception && wrong_streak >= 2) {
      // Student stuck with same error - CHANGE TEACHING STRATEGY
      if (misconception.type === 'representation_issue') {
        // Same format failing - switch modality
        if (current_representation === this.REPRESENTATIONS.TEXT) {
          return {
            action: this.ACTIONS.SWITCH_TO_VISUAL,
            reason: `Misconception: Text failing ${misconception.count}x. Switching to visual diagrams.`,
            pedagogicalStrategy: 'switch_modality',
            representationType: this.REPRESENTATIONS.VISUAL
          };
        } else if (current_representation === this.REPRESENTATIONS.VISUAL) {
          return {
            action: this.ACTIONS.SWITCH_TO_REAL_WORLD,
            reason: `Visual not working. Trying real-world contextual examples.`,
            pedagogicalStrategy: 'contextualization',
            representationType: this.REPRESENTATIONS.REAL_WORLD
          };
        } else {
          return {
            action: this.ACTIONS.GIVE_HINT_RETRY,
            reason: `Multiple formats tried. Providing scaffolding with hints.`,
            pedagogicalStrategy: 'scaffolding',
            representationType: current_representation
          };
        }
      }
      
      if (misconception.type === 'prerequisite_gap') {
        return {
          action: this.ACTIONS.REVIEW_PREREQUISITE,
          reason: `Basic concepts failing. Reviewing prerequisites.`,
          pedagogicalStrategy: 'spiral_review',
          representationType: this.REPRESENTATIONS.VISUAL
        };
      }
    }

    // Rule 1: Severe Frustration (3+ wrong)
    if (wrong_streak >= 3) {
      if (difficulty_level > 1) {
        return {
          action: this.ACTIONS.DECREASE_DIFFICULTY,
          reason: `Frustration: ${wrong_streak} errors. Reducing difficulty.`,
          pedagogicalStrategy: 'confidence_building'
        };
      } else {
        // Already easiest - need strategy change
        return {
          action: this.ACTIONS.GIVE_HINT_RETRY,
          reason: `At easiest level, still struggling. Adding hints.`,
          pedagogicalStrategy: 'scaffolding'
        };
      }
    }

    // Rule 2: Mastery Achieved
    if (mastery_level >= 85 && correct_streak >= 3) {
      if (difficulty_level < 5) {
        return {
          action: this.ACTIONS.INCREASE_DIFFICULTY,
          reason: `Mastery ${mastery_level.toFixed(1)}%. Increasing challenge.`,
          pedagogicalStrategy: 'progressive_challenge'
        };
      } else {
        return {
          action: this.ACTIONS.ADVANCE_TOPIC,
          reason: `Mastery at max difficulty. Advancing topic.`,
          pedagogicalStrategy: 'progression'
        };
      }
    }

    // Rule 3: Flow State (Optimal Challenge)
    if (mastery_level >= 60 && mastery_level < 85 && wrong_streak <= 1 && correct_streak >= 2) {
      return {
        action: this.ACTIONS.MAINTAIN_DIFFICULTY,
        reason: `Flow state: ${mastery_level.toFixed(1)}% mastery. Optimal challenge.`,
        pedagogicalStrategy: 'flow_maintenance'
      };
    }

    // Rule 4: Boredom (too easy)
    if (correct_streak >= 7 && difficulty_level <= 2 && mastery_level >= 75) {
      return {
        action: this.ACTIONS.INCREASE_DIFFICULTY,
        reason: `Boredom risk: ${correct_streak} streak at easy level.`,
        pedagogicalStrategy: 'engagement'
      };
    }

    // Default: Steady practice
    return {
      action: this.ACTIONS.MAINTAIN_DIFFICULTY,
      reason: `Steady progress: ${mastery_level.toFixed(1)}% mastery.`,
      pedagogicalStrategy: 'steady_practice'
    };
  }

  /**
   * Apply the determined action (adjust difficulty)
   */
  /**
   * Apply Action - Enhanced with Pedagogical Strategies
   * Handles not just difficulty changes, but teaching approach changes
   */
  async applyAction(userId, chapterId, currentState, action, actionMetadata = {}) {
    let newDifficulty = currentState.difficulty_level;
    let newRepresentation = currentState.current_representation || 'text';
    let teachingStrategy = actionMetadata.pedagogicalStrategy || null;

    switch (action) {
      case this.ACTIONS.DECREASE_DIFFICULTY:
        newDifficulty = Math.max(1, currentState.difficulty_level - 1);
        break;
      case this.ACTIONS.INCREASE_DIFFICULTY:
        newDifficulty = Math.min(5, currentState.difficulty_level + 1);
        break;
      case this.ACTIONS.ADVANCE_TOPIC:
        newDifficulty = 3; // Reset to medium for new topic
        break;
      
      // Teaching strategy changes
      case this.ACTIONS.SWITCH_TO_VISUAL:
        newRepresentation = this.REPRESENTATIONS.VISUAL;
        teachingStrategy = 'switch_modality';
        break;
      case this.ACTIONS.SWITCH_TO_REAL_WORLD:
        newRepresentation = this.REPRESENTATIONS.REAL_WORLD;
        teachingStrategy = 'contextualization';
        break;
      case this.ACTIONS.REPEAT_DIFFERENT_REPRESENTATION:
        // Cycle through representations
        if (newRepresentation === this.REPRESENTATIONS.TEXT) {
          newRepresentation = this.REPRESENTATIONS.VISUAL;
        } else if (newRepresentation === this.REPRESENTATIONS.VISUAL) {
          newRepresentation = this.REPRESENTATIONS.REAL_WORLD;
        } else {
          newRepresentation = this.REPRESENTATIONS.TEXT;
        }
        teachingStrategy = 'vary_representation';
        break;
      case this.ACTIONS.GIVE_HINT_RETRY:
        teachingStrategy = 'scaffolding';
        break;
      case this.ACTIONS.REVIEW_PREREQUISITE:
        newDifficulty = 1; // Go to basics
        teachingStrategy = 'spiral_review';
        break;
      
      case this.ACTIONS.REPEAT_CURRENT:
      case this.ACTIONS.MAINTAIN_DIFFICULTY:
      default:
        // No change
        break;
    }

    // Update database if changes occurred
    const updates = {};
    if (newDifficulty !== currentState.difficulty_level) {
      updates.difficulty_level = newDifficulty;
    }
    if (newRepresentation !== (currentState.current_representation || 'text')) {
      updates.current_representation = newRepresentation;
    }
    if (teachingStrategy) {
      updates.teaching_strategy = teachingStrategy;
    }

    if (Object.keys(updates).length > 0) {
      return await this.repo.updateStudentDifficulty(userId, chapterId, updates);
    }

    return currentState;
  }

  /**
   * Calculate reward for the state transition (enhanced with learning theory)
   * Based on educational psychology principles:
   * - Optimal challenge (flow theory)
   * - Mastery learning
   * - Spaced repetition benefits
   */
  calculateAdvancedReward(prevState, newState, action, timeSpent) {
    let reward = 0;

    // 1. Mastery improvement rewards
    const masteryChange = newState.mastery_level - prevState.mastery_level;
    if (masteryChange > 0) {
      reward += this.REWARDS.MASTERY_IMPROVED * (masteryChange / 10); // Scale by improvement
    } else if (masteryChange < 0) {
      reward += this.REWARDS.MASTERY_DECREASED * Math.abs(masteryChange / 10);
    }
    
    // 2. Correct answer at appropriate difficulty (flow zone)
    if (newState.correct_streak > 0) {
      reward += this.REWARDS.CORRECT_ANSWER;
      
      // Bonus for being in "optimal challenge zone" (70-85% mastery)
      if (newState.mastery_level >= 70 && newState.mastery_level <= 85) {
        reward += this.REWARDS.OPTIMAL_CHALLENGE;
      }
    }

    // 3. Maintained high mastery (consistent performance)
    if (newState.mastery_level >= 75 && prevState.mastery_level >= 75) {
      reward += this.REWARDS.MAINTAINED_HIGH_MASTERY;
    }

    // 4. Chapter advancement (major milestone)
    if (action === this.ACTIONS.ADVANCE_CHAPTER) {
      reward += this.REWARDS.ADVANCED_CHAPTER;
      
      // Extra bonus if achieved quickly (efficiency)
      if (newState.total_attempts < 20) {
        reward += this.REWARDS.RAPID_MASTERY;
      }
    }

    // 5. Frustration penalty (student struggling, likely to disengage)
    if (newState.wrong_streak >= 5) {
      reward += this.REWARDS.FRUSTRATION;
    } else if (newState.wrong_streak >= 3) {
      reward += this.REWARDS.FRUSTRATION / 2; // Partial penalty
    }

    // 6. Boredom penalty (content too easy, no learning)
    if (newState.correct_streak >= 10 && newState.difficulty_level <= 2) {
      reward += this.REWARDS.BOREDOM;
    }

    // 7. Time-based rewards (efficient learning is better)
    const expectedTime = 60; // 60 seconds baseline
    if (timeSpent && timeSpent < expectedTime / 2) {
      reward += 1; // Quick and correct = understanding
    } else if (timeSpent && timeSpent > expectedTime * 2) {
      reward -= 1; // Slow = struggling or guessing
    }

    // 8. Difficulty appropriateness
    // Reward staying in appropriate difficulty for mastery level
    const appropriateDifficulty = Math.ceil(newState.mastery_level / 20);
    if (Math.abs(newState.difficulty_level - appropriateDifficulty) <= 1) {
      reward += 2; // Good difficulty match
    }

    return reward;
  }

  /**
   * Predict student's next performance based on current state
   * Uses simple pattern recognition (can be upgraded to ML model)
   */
  predictNextPerformance(state) {
    const { mastery_level, correct_streak, wrong_streak, difficulty_level } = state;

    // Calculate probability of next answer being correct
    let probability = mastery_level / 100;

    // Adjust based on streaks (momentum)
    if (correct_streak >= 3) {
      probability += 0.1; // Confidence boost
    } else if (wrong_streak >= 2) {
      probability -= 0.15; // Struggling
    }

    // Adjust based on difficulty
    const difficultyPenalty = (difficulty_level - 3) * 0.05;
    probability -= difficultyPenalty;

    // Clamp between 0 and 1
    probability = Math.max(0, Math.min(1, probability));

    return {
      successProbability: probability,
      confidence: this.calculateConfidence(state),
      recommendation: this.getRecommendation(probability, state)
    };
  }

  /**
   * Calculate confidence in current mastery estimate
   */
  calculateConfidence(state) {
    // More attempts = more confidence in mastery estimate
    const attemptConfidence = Math.min(state.total_attempts / 20, 1);
    
    // Recent consistency increases confidence
    const streakConfidence = state.correct_streak >= 3 ? 0.9 : 
                            state.wrong_streak >= 3 ? 0.3 : 0.6;
    
    return (attemptConfidence + streakConfidence) / 2;
  }

  /**
   * Get recommendation based on prediction
   */
  getRecommendation(successProbability, state) {
    if (successProbability > 0.85) {
      return 'Consider increasing difficulty for optimal challenge';
    } else if (successProbability < 0.4) {
      return 'Consider decreasing difficulty to prevent frustration';
    } else if (successProbability >= 0.6 && successProbability <= 0.75) {
      return 'Current difficulty is in optimal learning zone';
    } else {
      return 'Continue monitoring performance';
    }
  }

  /**
   * Analyze learning patterns for research insights
   */
  async analyzeLearningPattern(userId, chapterId) {
    try {
      const history = await this.repo.getPerformanceHistory(userId, chapterId, 50);
      
      if (history.length < 5) {
        return { insufficient_data: true };
      }

      // Calculate various metrics
      const accuracy = history.filter(h => h.was_correct).length / history.length;
      const avgDifficulty = history.reduce((sum, h) => sum + h.new_difficulty, 0) / history.length;
      const difficultyChanges = history.filter((h, i) => 
        i > 0 && h.new_difficulty !== history[i-1].new_difficulty
      ).length;
      
      // Detect learning velocity (mastery gain per attempt)
      const firstMastery = history[0].new_mastery_level || 0;
      const lastMastery = history[history.length - 1].new_mastery_level || 0;
      const learningVelocity = (lastMastery - firstMastery) / history.length;

      // Detect patterns
      const hasUpwardTrend = learningVelocity > 0.5;
      const hasDownwardTrend = learningVelocity < -0.5;
      const isStagnant = Math.abs(learningVelocity) < 0.2;

      return {
        accuracy: (accuracy * 100).toFixed(1),
        avgDifficulty: avgDifficulty.toFixed(1),
        difficultyChanges,
        learningVelocity: learningVelocity.toFixed(2),
        pattern: hasUpwardTrend ? 'improving' : 
                 hasDownwardTrend ? 'declining' : 
                 isStagnant ? 'stagnant' : 'variable',
        recommendation: this.getPatternRecommendation(learningVelocity, accuracy)
      };
    } catch (error) {
      console.error('Error analyzing learning pattern:', error);
      return { error: 'Analysis failed' };
    }
  }

  /**
   * Get recommendation based on learning pattern
   */
  getPatternRecommendation(velocity, accuracy) {
    if (velocity > 1 && accuracy > 0.7) {
      return 'Excellent progress! Student is thriving with adaptive difficulty.';
    } else if (velocity < -0.5) {
      return 'Student may be struggling. Consider reviewing fundamentals.';
    } else if (Math.abs(velocity) < 0.2 && accuracy < 0.5) {
      return 'Learning has plateaued. Try different difficulty or content approach.';
    } else {
      return 'Student is making steady progress.';
    }
  }

  /**
   * Get adaptive questions based on student's current difficulty
   * NOW USES PARAMETRIC GENERATION - Creates infinite unique questions!
   */
  async getAdaptiveQuestions(userId, chapterId, count = 10) {
    try {
      const state = await this.repo.getStudentDifficulty(userId, chapterId);
      
      // OPTION 1: Generate fresh questions on-the-fly (recommended)
      const generatedQuestions = this.questionGenerator.generateQuestions(
        state.difficulty_level,
        chapterId,
        count
      );

      // OPTION 2: Mix of generated + database questions (hybrid approach)
      // Uncomment below to use hybrid approach
      /*
      const dbQuestions = await this.repo.getQuestionsByDifficulty(
        chapterId,
        state.difficulty_level,
        Math.floor(count / 2)
      );
      const genCount = count - dbQuestions.length;
      const generatedQuestions = this.questionGenerator.generateQuestions(
        state.difficulty_level,
        chapterId,
        genCount
      );
      const allQuestions = [...dbQuestions, ...generatedQuestions];
      */

      return {
        questions: generatedQuestions,
        currentDifficulty: state.difficulty_level,
        masteryLevel: state.mastery_level,
        difficultyLabel: this.getDifficultyLabel(state.difficulty_level),
        questionSource: 'parametric_generation', // NEW: indicates questions are generated
        totalTemplates: this.questionGenerator.getTemplateStats()
      };
    } catch (error) {
      console.error('Error getting adaptive questions:', error);
      throw error;
    }
  }

  /**
   * Get student's current state and performance with AI insights
   */
  async getStudentState(userId, chapterId) {
    try {
      const state = await this.repo.getStudentDifficulty(userId, chapterId);
      const history = await this.repo.getPerformanceHistory(userId, chapterId, 10);
      
      // Generate AI predictions
      const prediction = this.predictNextPerformance(state);
      
      // Get learning pattern analysis
      const pattern = await this.analyzeLearningPattern(userId, chapterId);
      
      // Get Q-values for current state
      const stateKey = this.getStateKey(state);
      const qValues = this.getQValuesForState(stateKey);

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
        
        // AI-enhanced features
        prediction: {
          successProbability: (prediction.successProbability * 100).toFixed(1),
          confidence: (prediction.confidence * 100).toFixed(1),
          recommendation: prediction.recommendation
        },
        
        learningPattern: pattern,
        
        qLearning: {
          stateKey,
          epsilon: this.getCurrentEpsilon(state.total_attempts).toFixed(3),
          explorationRate: (this.getCurrentEpsilon(state.total_attempts) * 100).toFixed(1),
          qValues: qValues,
          totalStatesLearned: this.qTable.size
        },
        
        recentHistory: history.map(h => ({
          action: h.action,
          wasCorrect: h.was_correct,
          difficultyChange: h.new_difficulty - h.prev_difficulty,
          reward: h.reward,
          timestamp: h.timestamp
        }))
      };
    } catch (error) {
      console.error('Error getting student state:', error);
      throw error;
    }
  }

  /**
   * Get all Q-values for a given state
   */
  getQValuesForState(stateKey) {
    const qValues = {};
    for (const action of Object.values(this.ACTIONS)) {
      qValues[action] = this.getQValue(stateKey, action).toFixed(2);
    }
    return qValues;
  }

  /**
   * Export Q-table for research analysis
   */
  exportQTable() {
    const table = [];
    for (const [stateKey, actions] of this.qTable.entries()) {
      table.push({
        state: stateKey,
        qValues: actions
      });
    }
    return table;
  }

  /**
   * Get Q-learning statistics
   */
  getQLearningStats() {
    return {
      totalStates: this.qTable.size,
      learningRate: this.LEARNING_RATE,
      discountFactor: this.DISCOUNT_FACTOR,
      currentMinEpsilon: this.MIN_EPSILON,
      initialEpsilon: this.INITIAL_EPSILON,
      epsilonDecay: this.EPSILON_DECAY,
      averageQValues: this.calculateAverageQValues()
    };
  }

  /**
   * Calculate average Q-values across all states
   */
  calculateAverageQValues() {
    let sum = 0;
    let count = 0;
    
    for (const [_, actions] of this.qTable.entries()) {
      for (const [action, qValue] of Object.entries(actions)) {
        sum += qValue;
        count++;
      }
    }
    
    return count > 0 ? (sum / count).toFixed(2) : 0;
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
