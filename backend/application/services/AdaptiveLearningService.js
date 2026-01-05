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
 * - AI-generated step-by-step explanations for learning support
 */

const QuestionGeneratorService = require('./QuestionGeneratorService');
const AIExplanationService = require('./AIExplanationService');
const HintGenerationService = require('./HintGenerationService');
const GroqQuestionGenerator = require('./GroqQuestionGenerator');

class AdaptiveLearningService {
  constructor(adaptiveLearningRepo) {
    this.repo = adaptiveLearningRepo;
    this.questionGenerator = new QuestionGeneratorService();
    this.aiExplanation = new AIExplanationService();
    this.hintService = new HintGenerationService(); // Production-safe AI hints
    // NOTE: Using Groq AI for difficulty 4-5 (14.4K requests/day free tier)
    this.aiQuestionGenerator = new GroqQuestionGenerator(); // Uses Groq API for complex questions
    
    // MDP Actions - Enhanced with Pedagogical Strategies
    this. ACTIONS = {
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

    // Cognitive Domains - aligned with Bloom's Taxonomy
    this.COGNITIVE_DOMAINS = {
      KR: 'knowledge_recall',        // Basic facts and formulas
      CU: 'concept_understanding',   // Relationships between concepts
      PS: 'procedural_skills',       // Step-by-step calculations
      AT: 'analytical_thinking',     // Multi-step reasoning
      PSP: 'problem_solving',        // Real-world applications
      HOT: 'higher_order_thinking'   // Creative/complex reasoning
    };

    // Cognitive domain progression path (from easier to harder thinking)
    this.DOMAIN_PROGRESSION = [
      'knowledge_recall',
      'concept_understanding',
      'procedural_skills',
      'analytical_thinking',
      'problem_solving',
      'higher_order_thinking'
    ];

    // Q-Learning Parameters (Research-backed from IJRISS & EduQate papers)
    this.LEARNING_RATE = 0.1;       // Alpha: how quickly to update Q-values (IJRISS: 0.1, EduQate: 0.1)
    this.DISCOUNT_FACTOR = 0.95;    // Gamma: importance of future rewards (IJRISS: 0.9, EduQate: 0.95)
    this.INITIAL_EPSILON = 1.0;     // Initial exploration rate (100%, IJRISS: 1.0 for full exploration)
    this.EPSILON_DECAY = 0.995;     // Decay exploration over time (IJRISS: 0.005 decay per step ≈ 0.995 per episode)
    this.MIN_EPSILON = 0.01;        // Minimum exploration rate (IJRISS: 0.01)
    
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
   * Get all available adaptive learning topics
   * All topics are accessible for practice
   */
  async getAllTopics() {
    return await this.repo.getAllTopics();
  }

  /**
   * Get practiced topics for a user (for AI concept unlocking)
   * Returns list of topic names the student has attempted
   */
  async getPracticedTopics(userId) {
    try {
      // Get all adaptive states for this user
      const states = await this.repo.getAllStatesForUser(userId);
      
      if (!states || states.length === 0) {
        return []; // No practiced topics yet
      }
      
      // Get unique topic IDs from states
      const topicIds = [...new Set(states.map(s => s.topicId))];
      
      // Get topic names
      const allTopics = await this.repo.getAllTopics();
      const practicedTopicNames = allTopics
        .filter(topic => topicIds.includes(topic.id))
        .map(topic => topic.topic_name);
      
      return practicedTopicNames;
    } catch (error) {
      console.error('[AdaptiveLearning] Error getting practiced topics:', error);
      return []; // Return empty array on error (AI will work without constraints)
    }
  }

  /**
   * Main entry point: Process student answer and adjust difficulty
   * Uses Q-Learning to determine optimal action
   */
  async processAnswer(userId, topicId, questionId, isCorrect, timeSpent, questionData = null) {
    try {
      // 1. Get current state
      const currentState = await this.repo.getStudentDifficulty(userId, topicId);
      
      // 2. Update performance metrics
      const newState = await this.updatePerformanceMetrics(
        userId, 
        topicId, 
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
      const updatedState = await this.applyAction(userId, topicId, newState, action, actionResult);

      // 6. Calculate reward based on learning theory
      const reward = this.calculateAdvancedReward(currentState, newState, action, timeSpent);

      // 7. Update Q-value using Q-learning update rule
      await this.updateQValue(currentStateKey, action, reward, newStateKey);

      // 8. Generate AI hint ONLY when student is struggling (wrong_streak >= 2)
      // This protects free-tier quota and is pedagogically sound
      let aiHint = null;
      let hintMetadata = null;
      
      if (!isCorrect && newState.wrong_streak >= 2 && questionData) {
        try {
          const topic = await this.repo.getTopicById(topicId);
          
          // Calculate mastery level (0-5) for AI constraint
          const masteryPercentage = newState.mastery_level || 0;
          const masteryLevel = masteryPercentage >= 90 ? 5 : 
                              masteryPercentage >= 75 ? 4 : 
                              masteryPercentage >= 60 ? 3 : 
                              masteryPercentage >= 40 ? 2 :
                              masteryPercentage >= 20 ? 1 : 0;
          
          // Get practiced topics (unlocked concepts) for AI constraint
          const unlockedConcepts = await this.getPracticedTopics(userId);
          
          const hintResult = await this.hintService.generateHint({
            questionText: questionData.questionText,
            topicName: topic?.topic_name || 'Geometry',
            difficultyLevel: currentState.difficulty_level,
            wrongStreak: newState.wrong_streak,
            mdpAction: action,
            representationType: representationType || 'text',
            masteryLevel, // NEW: Constrains AI to appropriate difficulty
            unlockedConcepts // NEW: Prevents AI from introducing locked concepts
          });
          
          aiHint = hintResult.hint;
          hintMetadata = {
            source: hintResult.source,
            reason: hintResult.reason
          };
          
          console.log('[AdaptiveLearning] Hint generated:', hintMetadata);
        } catch (hintError) {
          console.error('[AdaptiveLearning] Hint generation failed (non-critical):', hintError.message);
          // Continue without hint - learning is NOT blocked
        }
      } else if (!isCorrect && newState.wrong_streak < 2) {
        console.log('[AdaptiveLearning] Skipping AI hint - wrong_streak < 2');
      }

      // 9. Log transition for research analysis
      const transition = await this.repo.logStateTransition({
        userId,
        topicId,
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

      // 10. Check for chapter mastery and unlock next chapter
      let chapterUnlocked = null;
      try {
        const masteryHook = require('./MasteryProgressionHook');
        const masteryResult = await masteryHook.afterAnswerProcessed(
          userId, 
          topicId, 
          updatedState, 
          { action, reward }
        );
        
        if (masteryResult && masteryResult.chapterUnlocked) {
          chapterUnlocked = masteryResult.chapterUnlocked;
          console.log('[AdaptiveLearning] Chapter unlocked:', chapterUnlocked.message);
        }
      } catch (masteryError) {
        console.error('[AdaptiveLearning] Mastery progression failed (non-critical):', masteryError.message);
        // Continue without mastery progression - learning is NOT blocked
      }

      return {
        success: true,
        isCorrect,
        currentDifficulty: updatedState.difficulty_level,
        masteryLevel: updatedState.mastery_level,
        action,
        actionReason: reason,
        pedagogicalStrategy,
        representationType: representationType || 'text',
        feedback: this.generateFeedback(updatedState, action),
        reward, // Include for debugging/research
        learningMode: usedExploration ? 'exploring' : 'exploiting',
        aiHint, // AI-generated hint (ONLY if wrong_streak >= 2)
        hintMetadata, // Source tracking (ai/rule/cached)
        transitionId: transition?.id,
        chapterUnlocked // NEW: Chapter unlock notification
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
  async updatePerformanceMetrics(userId, topicId, currentState, isCorrect, timeSpent) {
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
    
    // SAMPLE SIZE PENALTY: Prevent instant 100% mastery from 1 correct answer
    // Mastery should require multiple attempts to reach high percentages
    // Progressive caps: 1 attempt=max 20%, 2=40%, 3=60%, 5=80%, 8+=100%
    let masteryCapByAttempts = 100; // Default: no cap for 8+ attempts
    if (totalAttempts === 1) {
      masteryCapByAttempts = 20;
    } else if (totalAttempts === 2) {
      masteryCapByAttempts = 40;
    } else if (totalAttempts === 3) {
      masteryCapByAttempts = 60;
    } else if (totalAttempts < 5) {
      masteryCapByAttempts = 70;
    } else if (totalAttempts < 8) {
      masteryCapByAttempts = 85;
    }
    
    // Calculate final mastery with all factors
    let masteryLevel = accuracy + streakBonus - streakPenalty + difficultyBonus + timeFactor;
    masteryLevel = Math.max(0, Math.min(100, Math.min(masteryLevel, masteryCapByAttempts)));

    const updates = {
      total_attempts: totalAttempts,
      correct_answers: correctAnswers,
      correct_streak: correctStreak,
      wrong_streak: wrongStreak,
      mastery_level: masteryLevel
    };

    // Update adaptive_learning_state
    const updatedState = await this.repo.updateStudentDifficulty(userId, topicId, updates);
    
    // SYNC: Also update user_topic_progress.mastery_percentage
    await this.repo.updateTopicMastery(userId, topicId, masteryLevel);
    
    return updatedState;
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
      console.log('[selectActionQLearning] Calling determineActionRuleBased with state:', state);
      const fallback = await this.determineActionRuleBased(state);
      console.log('[selectActionQLearning] Fallback result:', fallback);
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
  async detectMisconception(userId, topicId) {
    try {
      // Get recent answer history (last 5-10 attempts)
      const recentHistory = await this.repo.getRecentAttempts(userId, topicId, 10);
      
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
    try {
      console.log('[determineActionRuleBased] Input state:', JSON.stringify(state, null, 2));
      
      const { 
        mastery_level = 0, 
        correct_streak = 0, 
        wrong_streak = 0, 
        difficulty_level = 3,
        current_representation = 'text',
        user_id,
        topic_id
      } = state;

      console.log('[determineActionRuleBased] Destructured:', { user_id, topic_id, mastery_level, correct_streak, wrong_streak, difficulty_level });

      // PRIORITY 1: Detect misconceptions (change approach!)
      // Only call if we have valid IDs
      let misconception = null;
      if (user_id && topic_id) {
        misconception = await this.detectMisconception(user_id, topic_id);
      } else {
        console.error('[determineActionRuleBased] Missing user_id or topic_id!', { user_id, topic_id });
      }
    
    if (misconception && wrong_streak >= 2) {
      // Student stuck with same error - PROVIDE HINT & SCAFFOLDING
      if (misconception.type === 'representation_issue') {
        // Text representation failing - provide targeted hint instead of switching to visual
        // (Visual rendering not implemented yet)
        return {
          action: this.ACTIONS.GIVE_HINT_RETRY,
          reason: `Misconception: Same format failing ${misconception.count}x. Providing scaffolding with hints.`,
          pedagogicalStrategy: 'scaffolding',
          representationType: this.REPRESENTATIONS.TEXT
        };
      }
      
      if (misconception.type === 'prerequisite_gap') {
        return {
          action: this.ACTIONS.GIVE_HINT_RETRY,
          reason: `Basic concepts failing. Providing hints to review prerequisites.`,
          pedagogicalStrategy: 'scaffolding',
          representationType: this.REPRESENTATIONS.TEXT
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
    } catch (error) {
      console.error('[determineActionRuleBased] ERROR:', error);
      console.error('[determineActionRuleBased] State was:', state);
      // Return safe default
      return {
        action: this.ACTIONS.MAINTAIN_DIFFICULTY,
        reason: 'Error in rule-based decision, maintaining difficulty',
        pedagogicalStrategy: 'error_recovery'
      };
    }
  }

  /**
   * Apply the determined action (adjust difficulty)
   */
  /**
   * Apply Action - Enhanced with Pedagogical Strategies
   * Handles not just difficulty changes, but teaching approach changes
   */
  async applyAction(userId, topicId, currentState, action, actionMetadata = {}) {
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
      
      // Teaching strategy changes - DISABLED: Visual/Real-world rendering not implemented
      case this.ACTIONS.SWITCH_TO_VISUAL:
        // Disabled: Visual rendering not implemented - use hints instead
        teachingStrategy = 'scaffolding';
        break;
      case this.ACTIONS.SWITCH_TO_REAL_WORLD:
        // Disabled: Real-world rendering not implemented - use hints instead
        teachingStrategy = 'scaffolding';
        break;
      case this.ACTIONS.REPEAT_DIFFERENT_REPRESENTATION:
        // Keep text representation - others not implemented
        newRepresentation = this.REPRESENTATIONS.TEXT;
        teachingStrategy = 'scaffolding';
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
    // Note: current_representation and teaching_strategy not in adaptive_learning_state schema

    if (Object.keys(updates).length > 0) {
      return await this.repo.updateStudentDifficulty(userId, topicId, updates);
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
  async analyzeLearningPattern(userId, topicId) {
    try {
      const history = await this.repo.getPerformanceHistory(userId, topicId, 50);
      
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
   * NOW USES PARAMETRIC GENERATION with COGNITIVE DOMAINS!
   */
  async getAdaptiveQuestions(userId, topicId, count = 10, targetCognitiveDomain = null, representationType = 'text') {
    try {
      const state = await this.repo.getStudentDifficulty(userId, topicId);
      
      // Determine cognitive domain to use
      const cognitiveDomain = targetCognitiveDomain || this.determineCognitiveDomain(state);
      
      // Generate questions with cognitive domain and representation type
      const generatedQuestions = [];
      for (let i = 0; i < count; i++) {
        const question = this.questionGenerator.generateQuestion(
          state.difficulty_level,
          topicId,
          i,
          cognitiveDomain,
          representationType || 'text'
        );
        generatedQuestions.push(question);
      }

      return {
        questions: generatedQuestions,
        currentDifficulty: state.difficulty_level,
        currentCognitiveDomain: cognitiveDomain,
        cognitiveDomainLabel: this.questionGenerator.getCognitiveDomainLabel(cognitiveDomain),
        masteryLevel: state.mastery_level,
        difficultyLabel: this.getDifficultyLabel(state.difficulty_level),
        questionSource: 'parametric_generation',
        representationType: representationType || 'text',
        totalTemplates: this.questionGenerator.getTemplateStats(),
        cognitiveDomainStats: this.questionGenerator.getCognitiveDomainStats()
      };
    } catch (error) {
      console.error('Error getting adaptive questions:', error);
      throw error;
    }
  }

  /**
   * Determine appropriate cognitive domain based on student performance
   * Progressively advances through cognitive complexity
   */
  determineCognitiveDomain(state) {
    const { mastery_level, difficulty_level, total_attempts } = state;
    
    // Early stage: Focus on knowledge recall and understanding
    if (total_attempts < 10) {
      return 'knowledge_recall';
    }
    
    // Based on mastery level, advance through cognitive domains
    // Note: higher_order_thinking only has templates at difficulty 5
    if (mastery_level >= 90) {
      return difficulty_level >= 5 ? 'higher_order_thinking' : 'problem_solving';
    } else if (mastery_level >= 75) {
      return difficulty_level >= 4 ? 'problem_solving' : 'analytical_thinking';
    } else if (mastery_level >= 60) {
      return difficulty_level >= 3 ? 'analytical_thinking' : 'procedural_skills';
    } else if (mastery_level >= 40) {
      return 'procedural_skills'; // PS - Build calculation skills
    } else if (mastery_level >= 20) {
      return 'concept_understanding'; // CU - Understand relationships
    } else {
      return 'knowledge_recall'; // KR - Back to basics
    }
  }

  /**
   * Get student's current state and performance with AI insights
   */
  async getStudentState(userId, topicId) {
    try {
      const state = await this.repo.getStudentDifficulty(userId, topicId);
      const history = await this.repo.getPerformanceHistory(userId, topicId, 10);
      
      // Get NEW topic progress for mastery level (unified system)
      const topicProgress = await this.repo.getTopicProgress(userId, topicId);
      
      // Auto-unlock first topic if this is a new user accessing for the first time
      if (!topicProgress.unlocked) {
        const allTopics = await this.repo.getAllTopics();
        if (allTopics.length > 0 && allTopics[0].id === topicId) {
          // This is the first topic - unlock it automatically for new users
          await this.repo.updateTopicProgress(userId, topicId, {
            unlocked: true,
            unlocked_at: new Date().toISOString()
          });
          topicProgress.unlocked = true;
        }
      }
      
      // Generate AI predictions
      const prediction = this.predictNextPerformance(state);
      
      // Get learning pattern analysis
      const pattern = await this.analyzeLearningPattern(userId, topicId);
      
      // Get Q-values for current state
      const stateKey = this.getStateKey(state);
      const qValues = this.getQValuesForState(stateKey);
      
      // Determine current cognitive domain from topic progress
      const cognitiveDomain = topicProgress.cognitive_domain || this.determineCognitiveDomain(state);

      return {
        currentDifficulty: state.difficulty_level,
        difficultyLabel: this.getDifficultyLabel(state.difficulty_level),
        currentCognitiveDomain: cognitiveDomain,
        cognitiveDomainLabel: this.questionGenerator.getCognitiveDomainLabel(cognitiveDomain),
        cognitiveDomainDescription: this.questionGenerator.getCognitiveDomainDescription(cognitiveDomain),
        masteryLevel: topicProgress.mastery_percentage || 0, // Use NEW mastery from user_topic_progress
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
        
        // Cognitive domain progression info
        cognitiveDomainProgression: {
          current: cognitiveDomain,
          available: this.questionGenerator.getDomainsForDifficulty(state.difficulty_level),
          progressionPath: this.DOMAIN_PROGRESSION
        },
        
        currentRepresentation: state.current_representation || 'text',
        recentHistory: history
      };
    } catch (error) {
      console.error('[AdaptiveLearning] Error getting student state:', error);
      throw error;
    }
  }

  /**
   * Generate a new question for the student based on current state
   * Uses QuestionGeneratorService for infinite question variations
   */
  async generateQuestionForStudent(userId, topicId, difficultyLevel, representationType = 'text') {
    try {
      console.log(`[AdaptiveLearning] START generateQuestionForStudent - userId: ${userId}, topicId: ${topicId}, difficulty: ${difficultyLevel}`);
      
      // Get topic info to get chapter_id and topic_name
      const topic = await this.repo.getTopicById(topicId);
      if (!topic) {
        throw new Error(`Topic ${topicId} not found`);
      }
      console.log(`[AdaptiveLearning] Got topic: ${topic.topic_name}`);

      // Get current state to determine cognitive domain
      const state = await this.repo.getStudentDifficulty(userId, topicId);
      const cognitiveDomain = this.determineCognitiveDomain(state);
      console.log(`[AdaptiveLearning] Cognitive domain: ${cognitiveDomain}`);

      // Map topic name to question type filter
      const topicFilter = this.getTopicFilter(topic.topic_name);
      
      console.log(`[AdaptiveLearning] Generating question for topic "${topic.topic_name}", filter: ${topicFilter}`);

      // Generate question using QuestionGeneratorService with topic filter
      console.log(`[AdaptiveLearning] Calling questionGenerator.generateQuestion...`);
      const question = this.questionGenerator.generateQuestion(
        difficultyLevel,
        topic.chapter_id || 1,
        null, // No seed (fully random)
        cognitiveDomain,
        representationType,
        topicFilter // NEW: Pass topic filter
      );
      console.log(`[AdaptiveLearning] Question generated:`, question ? 'SUCCESS' : 'FAILED');

      return {
        question: question.question_text,
        options: question.options,
        questionId: question.id,
        hint: question.hint,
        difficulty: difficultyLevel,
        cognitiveDomain: question.cognitive_domain,
        representationType: question.representation_type,
        metadata: {
          type: question.type,
          parameters: question.parameters,
          generated_at: question.generated_at
        }
      };
    } catch (error) {
      console.error('[AdaptiveLearning] Error generating question:', error);
      throw error;
    }
  }
  
  /**
   * Map topic name to question type filter
   */
  getTopicFilter(topicName) {
    const topicMap = {
      // Match by topic name (from database)
      'Interior Angles of Polygons': 'polygon_interior',
      'Geometric Proofs and Reasoning': 'proof|congruent',
      'Geometry Word Problems': null, // Word problems can use any type
      'Polygon Identification': 'polygon_identify|polygon_types',
      'Plane and 3D Figures': 'plane_vs_solid|volume|surface_area',
      'Perimeter and Area of Polygons': 'perimeter|area|rectangle|square|triangle|parallelogram|trapezoid',
      'Kinds of Angles': 'angle_type|complementary|supplementary',
      'Basic Geometric Figures': 'identify_lines|circle_parts|polygon_identify|line_segment|intersecting|perpendicular|skew|parallel',
      'Volume of Space Figures': 'volume',
      'Circumference and Area of a Circle': 'circle',
      'Complementary and Supplementary Angles': 'complementary|supplementary',
      'Parts of a Circle': 'circle_parts|circle_circumference',
      'Points, Lines, and Planes': 'point_definition|line_segment|ray_definition|plane_definition|collinear|coplanar|intersecting|perpendicular|skew'
    };
    
    return topicMap[topicName] || null;
  }

  /**
   * Get student's current state and performance with AI insights (OLD VERSION)
   */
  async getStudentStateOld(userId, topicId) {
    try {
      const state = await this.repo.getStudentDifficulty(userId, topicId);
      const history = await this.repo.getPerformanceHistory(userId, topicId, 10);
      
      // Generate AI predictions
      const prediction = this.predictNextPerformance(state);
      
      // Get learning pattern analysis
      const pattern = await this.analyzeLearningPattern(userId, topicId);
      
      // Get Q-values for current state
      const stateKey = this.getStateKey(state);
      const qValues = this.getQValuesForState(stateKey);
      
      // Determine current cognitive domain
      const cognitiveDomain = this.determineCognitiveDomain(state);

      return {
        currentDifficulty: state.difficulty_level,
        difficultyLabel: this.getDifficultyLabel(state.difficulty_level),
        currentCognitiveDomain: cognitiveDomain,
        cognitiveDomainLabel: this.questionGenerator.getCognitiveDomainLabel(cognitiveDomain),
        cognitiveDomainDescription: this.questionGenerator.getCognitiveDomainDescription(cognitiveDomain),
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
        
        // Cognitive domain progression info
        cognitiveDomainProgression: {
          current: cognitiveDomain,
          available: this.questionGenerator.getDomainsForDifficulty(state.difficulty_level),
          progressionPath: this.DOMAIN_PROGRESSION
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
  async getResearchStats(topicId = null) {
    try {
      return await this.repo.getResearchStatistics(topicId);
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
    const crypto = require('crypto');
    return crypto.randomUUID();
  }

  // ================================================================
  // TOPIC UNLOCKING SYSTEM
  // ================================================================

  /**
   * Get all topics with unlock status for a user
   */
  async getTopicsWithProgress(userId) {
    try {
      // Get all topics
      const allTopics = await this.repo.getAllTopics();
      
      // Get user's progress for all topics
      const progress = await this.repo.getAllTopicProgress(userId);
      
      // If user has no progress, initialize it
      if (!progress || progress.length === 0) {
        await this.repo.initializeTopicsForUser(userId);
        return await this.getTopicsWithProgress(userId); // Retry after initialization
      }

      // Merge topics with progress
      const topicsWithProgress = allTopics.map(topic => {
        const topicProgress = progress.find(p => p.topic_id === topic.id);
        
        return {
          ...topic,
          unlocked: topicProgress?.unlocked || false,
          mastered: topicProgress?.mastered || false,
          mastery_level: topicProgress?.mastery_level || 0,
          mastery_percentage: topicProgress?.mastery_percentage || 0
        };
      });

      return topicsWithProgress;
    } catch (error) {
      console.error('[AdaptiveLearning] Error getting topics with progress:', error);
      throw error;
    }
  }

  /**
   * Check and unlock next topic if current mastery >= 3
   */
  async checkAndUnlockNextTopic(userId, topicId, currentMasteryLevel) {
    try {
      console.log('[checkAndUnlockNextTopic] Called with:', { userId, topicId, currentMasteryLevel });
      
      // Check if mastery level >= 3 (proficient)
      if (currentMasteryLevel < 3) {
        console.log('[checkAndUnlockNextTopic] Mastery level < 3, not ready to unlock');
        return null; // Not ready to unlock
      }

      console.log('[checkAndUnlockNextTopic] Mastery level >= 3, proceeding to unlock...');

      // Get current topic progress
      const currentProgress = await this.repo.getTopicProgress(userId, topicId);
      
      // Update current topic progress
      await this.repo.updateTopicProgress(userId, topicId, {
        mastery_level: currentMasteryLevel,
        mastery_percentage: currentMasteryLevel * 20, // Convert 0-5 to 0-100
        mastered: currentMasteryLevel >= 5,
        mastered_at: currentMasteryLevel >= 5 ? new Date().toISOString() : null
      });

      // Unlock next topic
      const unlockResult = await this.repo.unlockNextTopic(userId, topicId);
      
      if (unlockResult) {
        console.log('[checkAndUnlockNextTopic] Successfully unlocked:', unlockResult.topic.topic_name);
        return {
          unlocked: true,
          topic: unlockResult.topic,
          message: `Great job! You've unlocked "${unlockResult.topic.topic_name}"!`
        };
      }

      console.log('[checkAndUnlockNextTopic] No next topic to unlock');
      return null; // No next topic (already at end)
    } catch (error) {
      console.error('[AdaptiveLearning] Error checking/unlocking topic:', error);
      return null; // Don't fail the whole flow
    }
  }

  /**
   * Convert mastery percentage (0-100) to mastery level (0-5)
   */
  getMasteryLevel(masteryPercentage) {
    if (masteryPercentage >= 90) return 5;
    if (masteryPercentage >= 75) return 4;
    if (masteryPercentage >= 60) return 3;
    if (masteryPercentage >= 40) return 2;
    if (masteryPercentage >= 20) return 1;
    return 0;
  }

  /**
   * Check if topic is unlocked for user
   */
  async isTopicUnlocked(userId, topicId) {
    try {
      const progress = await this.repo.getTopicProgress(userId, topicId);
      return progress?.unlocked || false;
    } catch (error) {
      console.error('[AdaptiveLearning] Error checking topic unlock:', error);
      return false;
    }
  }

  // ================================================================
  // QUESTION GENERATION & UNIQUENESS
  // ================================================================

  /**
   * Generate a new question (parametric or AI-based)
   * Ensures uniqueness within session
   */
  async generateQuestion(userId, topicId, difficultyLevel, sessionId, excludeQuestionIds = []) {
    try {
      const topic = await this.repo.getTopicById(topicId);
      if (!topic) {
        throw new Error('Topic not found');
      }

      // Get shown questions in this session
      const shownQuestions = await this.repo.getShownQuestionsInSession(userId, topicId, sessionId);
      const shownQuestionIds = shownQuestions.map(q => q.question_id);
      const allExcluded = [...excludeQuestionIds, ...shownQuestionIds];

      let question = null;

      // For difficulty 4-5, use Groq (via aiQuestionGenerator) for complex questions
      if (difficultyLevel >= 4 && this.aiQuestionGenerator) {
        try {
          const state = await this.repo.getStudentDifficulty(userId, topicId);
          const cognitiveDomain = state?.cognitive_domain || 'analytical_thinking';

          // Add 10-second timeout to Groq API call
          const groqPromise = this.aiQuestionGenerator.generateQuestion({
            topicName: topic.topic_name,
            difficultyLevel,
            cognitiveDomain,
            excludeQuestionIds: allExcluded
          });
          
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Groq API timeout')), 10000)
          );
          
          question = await Promise.race([groqPromise, timeoutPromise]);

          if (question) {
            console.log('[AdaptiveLearning] Generated Groq question for mastery level 4-5:', question.questionId);
          }
        } catch (aiError) {
          console.warn('[AdaptiveLearning] Groq generation failed, falling back to parametric:', aiError.message);
        }
      }

      // Fallback to parametric templates (or for difficulty 1-3)
      if (!question) {
        // Get student state for cognitive domain
        const state = await this.repo.getStudentDifficulty(userId, topicId);
        const cognitiveDomain = this.determineCognitiveDomain(state);
        
        // Get topic filter to match questions to topic
        const topicFilter = this.getTopicFilter(topic.topic_name);
        
        question = await this.questionGenerator.generateQuestion(
          difficultyLevel,           // difficulty level (1-5)
          topic.chapter_id || 1,     // chapter ID
          null,                      // seed (random)
          cognitiveDomain,           // cognitive domain
          'text',                    // representation type
          topicFilter                // topic filter (e.g., "polygon_interior")
        );

        if (question) {
          question.generatedBy = 'parametric';
          // Keep the deterministic ID generated by QuestionGeneratorService
          // DON'T override it with random timestamp - this breaks duplicate detection
          console.log('[AdaptiveLearning] Generated parametric question:', question.questionId || question.id);
        }
      }

      if (!question) {
        throw new Error('Failed to generate question');
      }

      // Ensure question has a questionId field (parametric uses 'id', AI uses 'questionId')
      const questionId = question.questionId || question.id;
      if (!questionId) {
        throw new Error('Generated question missing ID');
      }

      // Add to question history
      await this.repo.addToQuestionHistory(
        userId,
        topicId,
        sessionId,
        questionId,
        question.questionType || question.type || 'unknown',
        difficultyLevel,
        null, // Not answered yet
        question
      );

      return question;

    } catch (error) {
      console.error('[AdaptiveLearning] Error generating question:', error);
      throw error;
    }
  }

  /**
   * Generate similar question (same type, different parameters)
   * Used after 2nd wrong attempt
   */
  async generateSimilarQuestion(userId, topicId, previousQuestion, sessionId) {
    try {
      if (!previousQuestion) {
        // No previous question, generate new one
        const state = await this.repo.getStudentDifficulty(userId, topicId);
        return await this.generateQuestion(
          userId,
          topicId,
          state.difficulty_level,
          sessionId
        );
      }

      // Generate similar question with same type/difficulty
      const question = await this.questionGenerator.generateSimilarQuestion(
        previousQuestion.questionType,
        previousQuestion.difficultyLevel || 3
      );

      if (question) {
        question.questionId = `similar_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        question.generatedBy = 'parametric_similar';

        // Add to history
        await this.repo.addToQuestionHistory(
          userId,
          topicId,
          sessionId,
          question.questionId,
          question.questionType,
          question.difficultyLevel,
          null,
          question
        );

        return question;
      }

      // Fallback: generate completely new question
      const state = await this.repo.getStudentDifficulty(userId, topicId);
      return await this.generateQuestion(
        userId,
        topicId,
        state.difficulty_level,
        sessionId
      );

    } catch (error) {
      console.error('[AdaptiveLearning] Error generating similar question:', error);
      throw error;
    }
  }

  /**
   * Track question attempt and determine if hint is needed
   */
  async trackAttemptAndCheckHint(userId, questionId, topicId, sessionId, isCorrect, questionData) {
    try {
      // Track attempt
      const attempt = await this.repo.trackQuestionAttempt(
        userId,
        questionId,
        topicId,
        sessionId,
        isCorrect,
        questionData
      );

      // Get current attempt count
      const attemptCount = await this.repo.getQuestionAttemptCount(userId, questionId, sessionId);

      return {
        attemptCount,
        showHint: !isCorrect && attemptCount >= 1, // Show hint on first wrong attempt
        generateSimilar: !isCorrect && attemptCount >= 2, // Generate similar after 2nd wrong
        keepQuestion: !isCorrect && attemptCount < 2 // Keep same question for retry
      };

    } catch (error) {
      console.error('[AdaptiveLearning] Error tracking attempt:', error);
      return {
        attemptCount: 1,
        showHint: !isCorrect,
        generateSimilar: false,
        keepQuestion: !isCorrect
      };
    }
  }
}

module.exports = AdaptiveLearningService;
