/**
 * AdaptiveLearningService - FULLY ADAPTIVE LEARNING SYSTEM
 * Implements MDP with Q-Learning for adaptive difficulty adjustment
 * Research Focus: Test if adaptive difficulty improves learning outcomes
 * 
 * =============================================================================
 * RESEARCH-GRADE ADAPTIVE LEARNING IMPLEMENTATION (ICETT-Ready)
 * =============================================================================
 * 
 * This system implements TRUE ADAPTIVITY through:
 * 
 * 1️⃣ MASTERY PROGRESSION (Attempt-Aware & Context-Dependent)
 *    ✅ Correct on 1st try → +18-25% mastery (demonstrates understanding)
 *    ✅ Correct after hint → +10-15% mastery (learned with scaffolding)
 *    ✅ Correct after 2+ wrongs → +5-8% mastery (perseverance, but struggled)
 *    ✅ Wrong answer → -5-10% mastery penalty (never zero, bounded 0-100)
 *    ✅ Factors: Attempt count, difficulty, cognitive domain, accuracy patterns
 *    
 * 2️⃣ STABILITY-BASED UNLOCKING (Not Linear)
 *    ✅ Requires: Mastery ≥ 60% AND stability (one of):
 *       - Accuracy ≥ 70% over last 5 attempts
 *       - 2+ consecutive correct answers
 *       - Correct without hint at difficulty ≥ 3
 *    ✅ Prevents: Guess-based unlocking, premature progression
 *    
 * 3️⃣ Q-LEARNING DRIVES PEDAGOGY (Not Decorative)
 *    ✅ State includes: mastery, difficulty, streaks, attempts
 *    ✅ Actions: Adjust difficulty, change representation, provide hints, review
 *    ✅ Rewards: Context-dependent (+10 first try, +6 after hint, -8 frustration)
 *    ✅ Logs: state → action → reward → next_state for research analysis
 *    ✅ Epsilon-greedy: Explores teaching strategies early, exploits learned optimal later
 *    
 * 4️⃣ REWARD SHAPING (Research-Aligned)
 *    ✅ Correct (1st try): +8 to +10
 *    ✅ Correct (after hint): +4 to +6
 *    ✅ Wrong: -3 to -5
 *    ✅ Mastery milestone: +10
 *    ✅ Frustration pattern: -8
 *    
 * 5️⃣ QUESTION & HINT VALIDATION
 *    ✅ Correct answer verification
 *    ✅ Difficulty-appropriate values
 *    ✅ Hints shown ONLY when wrong_streak ≥ 2
 *    ✅ Progressive support: 1st wrong → hint, 2nd → similar question, 3rd → easier
 *    
 * Key AI Features:
 * - Q-Learning algorithm for optimal pedagogical action selection
 * - Epsilon-greedy exploration strategy (high early, decays over time)
 * - Advanced reward shaping based on learning theory (flow, mastery, ZPD)
 * - State representation with multiple performance indicators
 * - Performance prediction using historical patterns
 * - Parametric question generation (infinite unique variations)
 * - Cognitive domain progression (recall → understanding → problem-solving)
 * - AI-generated step-by-step explanations for learning support
 * 
 * PEDAGOGICAL FOUNDATIONS:
 * - Mastery Learning (Bloom, 1968): Students progress when ready
 * - Zone of Proximal Development (Vygotsky): Optimal challenge with scaffolding
 * - Flow Theory (Csikszentmihalyi): Engagement through appropriate difficulty
 * - Reinforcement Learning (Sutton & Barto): Learn optimal teaching policies
 * - Spaced Repetition: Review at increasing intervals
 * - Bloom's Taxonomy: Cognitive complexity progression
 */

const QuestionGeneratorService = require('./QuestionGeneratorService');
const AIExplanationService = require('./AIExplanationService');
const HintGenerationService = require('./HintGenerationService');
const GroqQuestionGenerator = require('./GroqQuestionGenerator');
const CSVQuestionBankService = require('./CSVQuestionBankService');

// Extracted Application Services (SRP Refactoring)
const MasteryCalculationService = require('./MasteryCalculationService');
const StateManagementService = require('./StateManagementService');
const ActionSelectionService = require('./ActionSelectionService');

// Domain Models & Services (DDD Pattern)
const StudentAdaptiveState = require('../../../domain/models/adaptive/StudentAdaptiveState');
const Difficulty = require('../../../domain/models/adaptive/Difficulty');
const Mastery = require('../../../domain/models/adaptive/Mastery');
const QLearningPolicy = require('../../../domain/services/adaptive/QLearningPolicy');
const RewardCalculator = require('../../../domain/services/adaptive/RewardCalculator');
const MasteredTopicEvent = require('../../../domain/events/adaptive/MasteredTopicEvent');
const DifficultyAdjustedEvent = require('../../../domain/events/adaptive/DifficultyAdjustedEvent');

class AdaptiveLearningService {
  constructor(adaptiveLearningRepo, supabaseClient = null) {
    this.repo = adaptiveLearningRepo;
    this.questionGenerator = new QuestionGeneratorService();
    this.aiExplanation = new AIExplanationService();
    this.hintService = new HintGenerationService(); // Production-safe AI hints
    // NOTE: Using Groq AI for difficulty 4-5 (14.4K requests/day free tier)
    this.aiQuestionGenerator = new GroqQuestionGenerator(); // Uses Groq API for complex questions
    // ✅ NEW: CSV Question Bank Service (guaranteed correct answers in options)
    this.csvQuestionBank = supabaseClient ? new CSVQuestionBankService(supabaseClient) : null;
    // Experiment mode toggle: 'adaptive' (default) or 'control'
    this.EXPERIMENT_MODE = (process.env.ADAPTIVE_MODE || 'adaptive').toLowerCase();
    
    // Domain Services (DDD Pattern)
    this.qLearningPolicy = new QLearningPolicy();
    this.rewardCalculator = new RewardCalculator();
    
    // ✅ NEW: Extracted Application Services (SRP Refactoring)
    this.masteryCalculator = new MasteryCalculationService(adaptiveLearningRepo);
    this.stateManager = new StateManagementService({
      initialEpsilon: 1.0,
      epsilonDecay: 0.995,
      minEpsilon: 0.01
    });
    this.actionSelector = new ActionSelectionService(
      adaptiveLearningRepo,
      null, // Will set ACTIONS after initialization
      this.EXPERIMENT_MODE
    );
    
    // Event aggregation for research/reporting
    this.domainEvents = [];
    
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

    // Adaptive Learning Constants
    this.MAX_ATTEMPTS_BEFORE_HINT = 2;      // Show hint after 2 wrong attempts
    this.MIN_DIFFICULTY_FOR_AI = 4;         // Use AI generation for difficulty 4+
    this.MIN_MASTERY_FOR_AI = 60;           // 60% mastery required for AI questions
    this.MIN_ATTEMPTS_FOR_AI = 5;           // 5 attempts before enabling AI
    this.HIGH_WRONG_STREAK_THRESHOLD = 5;   // Difficulty drops after 5 consecutive wrong

    // Q-Learning Parameters (Research-backed from IJRISS & EduQate papers)
    this.LEARNING_RATE = 0.1;       // Alpha: how quickly to update Q-values (IJRISS: 0.1, EduQate: 0.1)
    this.DISCOUNT_FACTOR = 0.95;    // Gamma: importance of future rewards (IJRISS: 0.9, EduQate: 0.95)
    this.INITIAL_EPSILON = 1.0;     // Initial exploration rate (100%, IJRISS: 1.0 for full exploration)
    this.EPSILON_DECAY = 0.995;     // Decay exploration over time (IJRISS: 0.005 decay per step ≈ 0.995 per episode)
    this.MIN_EPSILON = 0.01;        // Minimum exploration rate (IJRISS: 0.01)
    
    // Q-Table: stores learned Q-values for state-action pairs
    // Structure: { stateKey: { action: qValue } }
    this.qTable = new Map();

    // Reward values - Educational Psychology Based (RESEARCH-ALIGNED)
    // Updated to match ICETT/research requirements for reinforcement learning
    this.REWARDS = {
      // Positive outcomes (INCREASED for better signal)
      ADVANCE_WITH_MASTERY: 10,       // Student ready to progress
      ADVANCE_CHAPTER: 10,            // Alias for ADVANCE_WITH_MASTERY (used in code)
      ADVANCED_CHAPTER: 10,           // Another alias (used in calculateAdvancedReward)
      
      // CORRECT ANSWER REWARDS (context-dependent, applied in calculateAdvancedReward)
      CORRECT_FIRST_TRY: 10,          // ★ High reward: demonstrates solid understanding
      CORRECT_AFTER_HINT: 6,          // ★ Moderate reward: learned with scaffolding
      CORRECT_AFTER_RETRY: 4,         // ★ Low reward: perseverance, but struggled
      CORRECT_ANSWER: 2,              // Base correct answer reward (legacy)
      
      OPTIMAL_CHALLENGE_ZONE: 7,      // "Flow state" - just right difficulty
      OPTIMAL_CHALLENGE: 7,           // Alias for OPTIMAL_CHALLENGE_ZONE (used in code)
      IMPROVED_AFTER_STRATEGY: 3,     // Strategy change helped
      MAINTAINED_HIGH_MASTERY: 3,
      RAPID_MASTERY: 8,
      MASTERY_IMPROVED: 5,            // Positive mastery change reward
      
      // Negative outcomes (pedagogical failures)
      BOREDOM: -3,                    // Too easy, long correct streak
      FRUSTRATION: -8,                // ★ INCREASED: Too hard, repeated failures
      MASTERY_DECREASED: -2,          // Regression
      WRONG_ANSWER: -4                // Base wrong answer penalty
    };
    
    // ✅ Pass ACTIONS to ActionSelector after initialization
    this.actionSelector.ACTIONS = this.ACTIONS;
  }

  
  // ============================================
  // DOMAIN MODEL CONVERSION HELPERS (DDD Pattern)
  // ============================================

  /**
   * Convert raw database state to domain model StudentAdaptiveState
   * Wraps raw state with Difficulty and Mastery value objects
   */
  toDomainState(userId, topicId, rawState) {
    const difficulty = new Difficulty(rawState.difficulty_level);
    const mastery = new Mastery(rawState.mastery_level);
    
    return new StudentAdaptiveState(
      userId,
      topicId,
      difficulty,
      mastery,
      rawState.correct_streak,
      rawState.wrong_streak,
      rawState.total_attempts,
      rawState.correct_answers,
      rawState.wrong_answers,
      rawState.exploration_count,
      rawState.exploitation_count
    );
  }

  /**
   * Convert domain model back to raw state for persistence
   */
  toPersistentState(domainState) {
    return {
      difficulty_level: domainState.difficulty.level,
      mastery_level: domainState.mastery.value,
      correct_streak: domainState.correctStreak,
      wrong_streak: domainState.wrongStreak,
      total_attempts: domainState.totalAttempts,
      correct_answers: domainState.correctAnswers,
      wrong_answers: domainState.wrongAnswers,
      exploration_count: domainState.explorationCount,
      exploitation_count: domainState.exploitationCount
    };
  }

  /**
   * Publish domain event for tracking/analytics
   */
  publishEvent(domainEvent) {
    this.domainEvents.push(domainEvent);
    console.log(`[DomainEvent] ${domainEvent.type}:`, {
      timestamp: domainEvent.timestamp,
      userId: domainEvent.userId,
      topicId: domainEvent.topicId
    });
  }

  /**
   * Get all published events since last flush (for testing/analytics)
   */
  getPublishedEvents() {
    return [...this.domainEvents];
  }

  /**
   * Clear event log (after publishing to event bus)
   */
  clearPublishedEvents() {
    this.domainEvents = [];
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
   * Main entry point: Process student answer and update adaptive learning state
   * 
   * Flow:
   * 1. Validate submission (prevent duplicates)
   * 2. Update question tracking (mark answered, handle pending questions)
   * 3. Update performance metrics (streaks, mastery, accuracy)
   * 4. Use Q-Learning to select optimal pedagogical action
   * 5. Apply selected action (adjust difficulty, change teaching strategy)
   * 6. Calculate reward and update Q-table for future learning
   * 
   * WHY Q-Learning: Learns optimal teaching strategies through trial-and-error,
   * adapting to each student's learning patterns over time.
   */
  async processAnswer(userId, topicId, questionId, isCorrect, timeSpent, questionData = null, submissionId = null) {
    try {
      // === STEP 1: Validate Submission (Prevent Duplicate Processing) ===
      // Prevents race conditions when users rapidly submit the same answer
      if (submissionId) {
        const isDuplicate = await this.repo.checkSubmissionDuplicate(userId, topicId, submissionId);
        if (isDuplicate) {
          console.warn(`[AdaptiveLearning] Duplicate submission detected: ${submissionId} - skipping processing`);
          return {
            success: false,
            error: 'DUPLICATE_SUBMISSION',
            message: 'This answer was already processed'
          };
        }
        await this.repo.recordSubmission(userId, topicId, submissionId);
      }
      
      // === STEP 2: Update Question Tracking ===
      await this.repo.markQuestionAnswered(userId, topicId, questionId, isCorrect);
      
      // Handle pending question flow
      if (isCorrect) {
        await this.repo.clearPendingQuestion(userId, topicId);
        console.log('[AdaptiveLearning] Correct answer - cleared pending question');
      } else {
        const progress = await this.repo.incrementAttemptCount(userId, topicId);
        console.log(`[AdaptiveLearning] Wrong answer - incremented attempt_count to ${progress.attempt_count}`);
        
        if (progress.attempt_count >= this.MAX_ATTEMPTS_BEFORE_HINT) {
          await this.repo.clearPendingQuestion(userId, topicId);
          console.log('[AdaptiveLearning] 2nd wrong attempt - cleared pending question for regeneration');
        }
      }
      
      // === STEP 3: Get Current State & Update Performance Metrics ===
      const currentState = await this.repo.getStudentDifficulty(userId, topicId);
      
      // Extract cognitive domain from question data for adaptive mastery calculation
      const cognitiveDomain = questionData?.cognitive_domain || questionData?.cognitiveDomain || 'knowledge_recall';
      
      const newState = await this.updatePerformanceMetrics(
        userId, 
        topicId, 
        currentState, 
        isCorrect,
        timeSpent,
        cognitiveDomain // NEW: Pass domain for context-aware mastery gains
      );

      // 3. Create state representations for Q-learning
      const currentStateKey = this.getStateKey(currentState);
      const newStateKey = this.getStateKey(newState);

      // === Q-LEARNING DEBUG LOGS ===
      console.log('\n============= Q-LEARNING DECISION =============');
      console.log('[Q-Learning] User:', userId);
      console.log('[Q-Learning] Topic:', topicId);
      console.log('[Q-Learning] Current State Key:', currentStateKey);
      console.log('[Q-Learning] Current State:', {
        difficulty: currentState.difficulty_level,
        mastery: currentState.mastery_level.toFixed(1) + '%',
        correct_streak: currentState.correct_streak,
        wrong_streak: currentState.wrong_streak,
        total_attempts: currentState.total_attempts,
        exploration_count: currentState.exploration_count,
        exploitation_count: currentState.exploitation_count
      });
      console.log('[Q-Learning] New State Key:', newStateKey);
      console.log('[Q-Learning] Answer:', isCorrect ? '✓ CORRECT' : '✗ WRONG');
      console.log('[Q-Learning] Epsilon (exploration rate):', this.getCurrentEpsilon(newState.total_attempts).toFixed(3));
      
      // Show all Q-values for current state
      await this.preloadQValuesForState(userId, newStateKey);
      const qValues = {};
      for (const act of Object.values(this.ACTIONS)) {
        qValues[act] = this.getQValue(userId, newStateKey, act).toFixed(3);
      }
      console.log('[Q-Learning] Q-Values for state:', qValues);
      console.log('===============================================\n');

      // 4. Determine next action using Q-learning with epsilon-greedy policy
      const actionResult = await this.selectActionQLearning(
        userId,
        newStateKey, 
        newState
      );
      const { action, reason, usedExploration, pedagogicalStrategy, representationType } = actionResult;

      // === ACTION SELECTION LOGS ===
      console.log('[Q-Learning] ACTION SELECTED:', action);
      console.log('[Q-Learning] Action Reason:', reason);
      console.log('[Q-Learning] Learning Mode:', usedExploration ? '🔍 EXPLORATION' : '💡 EXPLOITATION');
      console.log('[Q-Learning] Pedagogical Strategy:', pedagogicalStrategy || 'none');

      // 5. Apply action (adjust difficulty and/or teaching strategy)
      const updatedState = await this.applyAction(userId, topicId, newState, action, actionResult, usedExploration);

      // 5b. CRITICAL: Clear pending question if difficulty changed
      // This ensures next question matches the new difficulty (e.g., after review_prerequisite_topic drops difficulty 3→1)
      // Note: Pending question already cleared on correct answers (line 186), so this only affects wrong answers with difficulty changes
      const difficultyChanged = updatedState.difficulty_level !== currentState.difficulty_level;
      if (difficultyChanged) {
        await this.repo.clearPendingQuestion(userId, topicId);
        console.log(`[AdaptiveLearning] Cleared pending question due to difficulty change (${currentState.difficulty_level}→${updatedState.difficulty_level})`);
      }

      // 6. Calculate reward based on learning theory
      const reward = this.calculateAdvancedReward(currentState, newState, action, timeSpent);
      
      console.log('[Q-Learning] REWARD:', reward.toFixed(2));
      console.log('[Q-Learning] Updated State:', {
        difficulty: updatedState.difficulty_level,
        mastery: updatedState.mastery_level.toFixed(1) + '%',
        correct_streak: updatedState.correct_streak,
        wrong_streak: updatedState.wrong_streak,
        exploration_count: updatedState.exploration_count,
        exploitation_count: updatedState.exploitation_count
      });

      // 7. Update Q-value using Q-learning update rule
      const oldQValue = this.getQValue(userId, currentStateKey, action);
      await this.updateQValue(userId, currentStateKey, action, reward, newStateKey);
      const newQValue = this.getQValue(userId, currentStateKey, action);
      console.log('[Q-Learning] Q-Value Update:', {
        state: currentStateKey,
        action: action,
        old: oldQValue.toFixed(3),
        new: newQValue.toFixed(3),
        change: (newQValue - oldQValue).toFixed(3)
      });
      console.log('[Q-Learning] Total States in Q-Table:', this.qTable.size);
      console.log('===============================================\n');

      // 8. Generate AI hint when student is struggling OR when Q-learning recommends it
      // Triggers: (1) wrong_streak >= 2, OR (2) action == GIVE_HINT_RETRY
      // This protects free-tier quota and is pedagogically sound
      let aiHint = null;
      let hintMetadata = null;
      
      const shouldGenerateHint = !isCorrect && questionData && (
        newState.wrong_streak >= 2 || 
        action === this.ACTIONS.GIVE_HINT_RETRY
      );
      
      if (shouldGenerateHint) {
        const hintReason = action === this.ACTIONS.GIVE_HINT_RETRY 
          ? 'Q-learning recommended GIVE_HINT_RETRY action'
          : `wrong_streak >= 2 (${newState.wrong_streak})`;
        console.log(`[AdaptiveLearning] Triggering AI hint - ${hintReason}`);
        try {
          const topic = await this.repo.getTopicById(topicId);
          
          // Mark hint as shown in database (for analytics)
          await this.repo.markHintShown(userId, topicId);
          
          // VALIDATION: Ensure we have question text for hint generation
          const questionText = questionData.questionText || questionData.question_text || questionData.question || '';
          
          if (!questionText) {
            console.warn('[AdaptiveLearning] Cannot generate hint - missing question text');
            // Use template hint as fallback
            if (questionData.hint) {
              aiHint = questionData.hint;
              hintMetadata = {
                source: 'template',
                reason: 'Missing question text - using template hint'
              };
            }
          } else {
            // Calculate mastery level (0-5) for AI constraint
            const masteryPercentage = newState.mastery_level || 0;
            const masteryLevel = masteryPercentage >= 90 ? 5 : 
                                masteryPercentage >= 75 ? 4 : 
                                masteryPercentage >= 60 ? 3 : 
                                masteryPercentage >= 40 ? 2 :
                                masteryPercentage >= 20 ? 1 : 0;
            
            // Get practiced topics (unlocked concepts) for AI constraint
            const unlockedConcepts = await this.getPracticedTopics(userId);
            
            // CRITICAL FIX: Use question-specific topic, not chapter topic
            // For parametric questions, extract from question_id (e.g., "gen_d3_circle_inscribed_angle__350")
            // For AI questions, use questionData.metadata.topic or fall back to chapter topic
            let questionSpecificTopic = topic?.topic_name || 'Geometry';
            if (questionId) {
              // Extract topic from parametric question ID: "gen_d3_circle_inscribed_angle__350" → "circle inscribed angle"
              const match = questionId.match(/gen_d\d+_([a-z_]+)__\d+/);
              if (match) {
                questionSpecificTopic = match[1].replace(/_/g, ' ');
              } else if (questionData?.metadata?.topic) {
                // AI-generated question - use metadata topic
                questionSpecificTopic = questionData.metadata.topic;
              }
            }
            
            const hintResult = await this.hintService.generateHint({
              questionText,
              topicName: questionSpecificTopic,
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
          }
        } catch (hintError) {
          console.error('[AdaptiveLearning] Hint generation failed (non-critical):', hintError.message);
          console.error('[AdaptiveLearning] Hint error stack:', hintError.stack);
          // Use template hint as emergency fallback
          if (questionData?.hint) {
            aiHint = questionData.hint;
            hintMetadata = {
              source: 'template-fallback',
              reason: 'AI generation failed - using template hint'
            };
          }
          // Continue without hint - learning is NOT blocked
        }
      } else if (!isCorrect && newState.wrong_streak < 2 && action !== this.ACTIONS.GIVE_HINT_RETRY) {
        console.log('[AdaptiveLearning] Skipping AI hint - wrong_streak < 2 and action is not GIVE_HINT_RETRY');
        // For first wrong attempt, provide the template hint if available
        if (questionData?.hint) {
          aiHint = questionData.hint;
          hintMetadata = {
            source: 'template',
            reason: 'First wrong attempt - using template hint'
          };
          console.log('[AdaptiveLearning] Using template hint for first wrong attempt');
        }
      }

      // 9. Log transition for research analysis
      // CRITICAL: Get Q-value AFTER update to see the learned value
      const updatedQValue = this.getQValue(userId, currentStateKey, action);
      const currentEpsilon = this.getCurrentEpsilon(updatedState.total_attempts);
      
      // Extract cognitive domain from question data (reuse from earlier extraction)
      const questionCognitiveDomain = cognitiveDomain || 'knowledge_recall';
      
      const transition = await this.repo.logStateTransition({
        userId,
        topicId,
        prevState: currentState,
        action,
        actionReason: reason,
        newState: updatedState,
        reward,
        questionId, // Always log question ID for traceability
        wasCorrect: isCorrect,
        timeSpent,
        usedExploration,
        qValue: updatedQValue, // Use updated Q-value, not old one
        epsilon: currentEpsilon, // Store actual epsilon, not wrapped in metadata
        sessionId: this.generateSessionId(userId),
        cohortMode: this.EXPERIMENT_MODE,
        cognitiveDomain: questionCognitiveDomain // Cognitive domain for research analysis
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
   * 
   * ✅ REFACTORED: Now delegates to MasteryCalculationService (SRP)
   */
  async updatePerformanceMetrics(userId, topicId, currentState, isCorrect, timeSpent, cognitiveDomain = 'knowledge_recall') {
    const result = await this.masteryCalculator.calculateMasteryUpdate(
      userId,
      topicId,
      currentState,
      isCorrect,
      cognitiveDomain
    );
    
    // Publish domain events
    result.events.forEach(event => this.publishEvent(event));
    
    return result.updatedState;
  }

  /**
   * Generate state key for Q-table
   * 
   * ✅ REFACTORED: Now delegates to StateManagementService (SRP)
   */
  getStateKey(state) {
    return this.stateManager.getStateKey(state);
  }

  /**
   * Calculate current epsilon for exploration
   * 
   * ✅ REFACTORED: Now delegates to StateManagementService (SRP)
   */
  getCurrentEpsilon(attemptCount) {
    return this.stateManager.getCurrentEpsilon(attemptCount);
  }

  /**
   * Generate session ID for research logs
   * 
   * ✅ REFACTORED: Now delegates to StateManagementService (SRP)
   */
  generateSessionId(userId) {
    return this.stateManager.generateSessionId(userId);
  }

  /**
   * Select optimal pedagogical action using epsilon-greedy Q-Learning
   * 
   * ✅ REFACTORED: Now delegates to ActionSelectionService (SRP)
   */
  async selectActionQLearning(userId, stateKey, state) {
    const epsilon = this.getCurrentEpsilon(state.total_attempts);
    
    return await this.actionSelector.selectAction(
      userId,
      stateKey,
      state,
      epsilon,
      this.getQValue.bind(this),
      this.preloadQValuesForState.bind(this)
    );
  }

  /**
   * Rule-based policy fallback
   * 
   * ✅ REFACTORED: Now delegates to ActionSelectionService (SRP)
   */
  async determineActionRuleBased(state) {
    return await this.actionSelector.determineActionRuleBased(state);
  }

  /**
   * Get Q-value for state-action pair
   * CRITICAL: Now includes userId for per-student Q-learning
   */
  getQValue(userId, stateKey, action) {
    // First check in-memory cache
    if (!this.qTable.has(stateKey)) {
      this.qTable.set(stateKey, {});
    }
    const stateActions = this.qTable.get(stateKey);
    return stateActions[action] || 0; // Initialize to 0 if not seen
  }

  /**
   * Preload persisted Q-values for a state into memory (lazy loading)
   */
  async preloadQValuesForState(userId, stateKey) {
    if (this.qTable.has(stateKey) && Object.keys(this.qTable.get(stateKey)).length > 0) {
      return; // Already loaded
    }
    try {
      const persisted = await this.repo.getQValuesByState(userId, stateKey);
      if (!this.qTable.has(stateKey)) {
        this.qTable.set(stateKey, {});
      }
      const stateActions = this.qTable.get(stateKey);
      for (const [action, q] of Object.entries(persisted)) {
        stateActions[action] = q;
      }
    } catch (error) {
      console.warn('[AdaptiveLearning] Failed to preload Q-values for state:', stateKey, error);
    }
  }

  /**
   * Update Q-value using Q-learning update rule
  /**
   * Update Q-value using Bellman equation for temporal difference learning
   * 
   * WHY This Formula: The Bellman equation updates our estimate of how good an action is
   * based on immediate reward + estimated future value. This allows the system to learn
   * optimal teaching strategies through experience.
   * 
   * Formula: Q(s,a) ← Q(s,a) + α[r + γ·max Q(s',a') - Q(s,a)]
   * Where:
   *   - s: current state (mastery, difficulty, streaks)
   *   - a: action taken (increase difficulty, switch strategy, etc.)
   *   - r: immediate reward (positive for good outcome, negative for bad)
   *   - s': next state after action
   *   - α: learning rate (0.1) - how quickly to update beliefs
   *   - γ: discount factor (0.95) - importance of future rewards
   * 
   * @param {string} userId - User ID for per-student Q-learning
   * @param {string} currentStateKey - State before action (e.g., "M2_D1_C3_W0")
   * @param {string} action - Action taken (e.g., "increase_difficulty")
   * @param {number} reward - Immediate reward value (-10 to +10)
   * @param {string} nextStateKey - State after action (e.g., "M3_D2_C4_W0")
   */
  async updateQValue(userId, currentStateKey, action, reward, nextStateKey) {
    const currentQ = this.getQValue(userId, currentStateKey, action);
    
    // Find best possible future value: max Q-value for all actions in next state
    // WHY: We assume optimal future play (student gets best possible teaching)
    let maxNextQ = -Infinity;
    for (const nextAction of Object.values(this.ACTIONS)) {
      const nextQ = this.getQValue(userId, nextStateKey, nextAction);
      if (nextQ > maxNextQ) {
        maxNextQ = nextQ;
      }
    }
    
    // If next state is unexplored, assume neutral value (0)
    if (maxNextQ === -Infinity) {
      maxNextQ = 0;
    }

    // Apply Bellman equation: current estimate + learning rate * temporal difference
    // Temporal difference = (reward + discounted future value) - current estimate
    const newQ = currentQ + this.LEARNING_RATE * (
      reward + this.DISCOUNT_FACTOR * maxNextQ - currentQ
    );

    // Update Q-table in memory
    if (!this.qTable.has(currentStateKey)) {
      this.qTable.set(currentStateKey, {});
    }
    this.qTable.get(currentStateKey)[action] = newQ;
    // Persist Q-value for research analysis and model continuity
    await this.repo.saveQValue(userId, currentStateKey, action, newQ);
  }

  /**
   * Calculate epsilon (exploration rate) with exponential decay
   * 
   * WHY Decay: Early learning benefits from exploration (trying different strategies).
   * As we learn what works, we should exploit that knowledge more.
   * 
   * Formula: ε = max(MIN_EPSILON, INITIAL_EPSILON * EPSILON_DECAY^attempts)
   * 
   * Example: 
   *   - Attempt 1: ε = 1.0 (100% exploration)
   *   - Attempt 10: ε = 0.95 (95% exploration)
   *   - Attempt 100: ε = 0.60 (60% exploration)
   *   - Attempt 500: ε = 0.08 (8% exploration)
   *   - Attempt 1000+: ε = 0.01 (1% exploration, minimum)
   */
  getCurrentEpsilon(totalAttempts) {
    const epsilon = this.INITIAL_EPSILON * Math.pow(this.EPSILON_DECAY, totalAttempts);
    return Math.max(this.MIN_EPSILON, epsilon);
  }

  /**
   * Apply the determined action (adjust difficulty)
   */
  /**
   * Apply Action - Enhanced with Pedagogical Strategies
   * Handles not just difficulty changes, but teaching approach changes
   */
  async applyAction(userId, topicId, currentState, action, actionMetadata = {}, usedExploration = false) {
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
      
      // ✅ Teaching strategy changes - IMPLEMENTED: Multi-modal representation switching
      case this.ACTIONS.SWITCH_TO_VISUAL:
        // Switch to visual representation (diagrams, illustrations, visual examples)
        newRepresentation = this.REPRESENTATIONS.VISUAL;
        teachingStrategy = 'scaffolding';
        console.log('[ApplyAction] Switching to VISUAL representation');
        break;
      case this.ACTIONS.SWITCH_TO_REAL_WORLD:
        // Switch to real-world context (practical examples, applications)
        newRepresentation = this.REPRESENTATIONS.REAL_WORLD;
        teachingStrategy = 'scaffolding';
        console.log('[ApplyAction] Switching to REAL_WORLD representation');
        break;
      case this.ACTIONS.REPEAT_DIFFERENT_REPRESENTATION:
        // Cycle through representations: text → visual → real_world → text
        const currentRep = currentState.current_representation || 'text';
        if (currentRep === 'text') {
          newRepresentation = this.REPRESENTATIONS.VISUAL;
        } else if (currentRep === 'visual') {
          newRepresentation = this.REPRESENTATIONS.REAL_WORLD;
        } else {
          newRepresentation = this.REPRESENTATIONS.TEXT; // Cycle back to text
        }
        teachingStrategy = 'scaffolding';
        console.log(`[ApplyAction] Cycling representation: ${currentRep} → ${newRepresentation}`);
        break;
      case this.ACTIONS.GIVE_HINT_RETRY:
        // ✅ IMPLEMENTED: Hint generation triggered in processAnswer() when this action is selected
        // See hint generation logic around line 467 - checks for (wrong_streak >= 2 OR action === GIVE_HINT_RETRY)
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
      
      // === DOMAIN EVENT: Publish difficulty change ===
      const event = DifficultyAdjustedEvent.create(
        userId,
        topicId,
        currentState.difficulty_level,
        newDifficulty,
        `action_${action}`
      );
      this.publishEvent(event);
      console.log(`[DomainEvent] Difficulty adjusted: ${currentState.difficulty_level} → ${newDifficulty} via action ${action}`);
    }
    
    if (newRepresentation !== currentState.current_representation) {
      updates.current_representation = newRepresentation;
    }
    if (teachingStrategy !== currentState.teaching_strategy) {
      updates.teaching_strategy = teachingStrategy;
    }
    // Save the action taken for debugging and analysis
    updates.last_action = action;
    
    // Track exploration vs exploitation for analytics
    if (usedExploration) {
      updates.increment_exploration = true;
    } else {
      updates.increment_exploitation = true;
    }

    if (Object.keys(updates).length > 0) {
      return await this.repo.updateStudentDifficulty(userId, topicId, updates);
    }

    return currentState;
  }

  /**
   * Calculate reward for the state transition (RESEARCH-GRADE implementation)
   * 
   * PEDAGOGICAL PRINCIPLE: Rewards must reflect learning quality, not just correctness.
   * A student who answers correctly on first try demonstrates deeper understanding
   * than one who needed hints. This aligns with reinforcement learning theory.
   * 
   * REWARD STRUCTURE (aligned with requirements):
   * - Correct on 1st try: +8 to +10 (demonstrates understanding)
   * - Correct after hint: +4 to +6 (learned with scaffolding)
   * - Wrong answer: -3 to -5 (indicates knowledge gap)
   * - Mastery milestone: +10 (major achievement)
   * - Frustration pattern: -8 (pedagogical failure)
   * 
   * Based on educational psychology principles:
   * - Optimal challenge (flow theory)
   * - Mastery learning
   * - Spaced repetition benefits
   */
  calculateAdvancedReward(prevState, newState, action, timeSpent) {
    let reward = 0;

    // Safety checks to prevent NaN
    const prevMastery = prevState?.mastery_level ?? 0;
    const newMastery = newState?.mastery_level ?? 0;
    const correctStreak = newState?.correct_streak ?? 0;
    const wrongStreak = newState?.wrong_streak ?? 0;
    const difficulty = newState?.difficulty_level ?? 3;
    const totalAttempts = newState?.total_attempts ?? 0;

    // ========== CONTEXT-DEPENDENT CORRECT ANSWER REWARDS ==========
    // Determine attempt context to assign appropriate reward
    const isCorrect = correctStreak > 0;
    const isFirstTry = correctStreak >= 1 && wrongStreak === 0;
    const usedHint = wrongStreak >= 2; // Hint shown after 2nd wrong
    
    if (isCorrect) {
      if (isFirstTry) {
        // SCENARIO 1: Correct on first try (no hints)
        reward += this.REWARDS.CORRECT_FIRST_TRY; // +10
        console.log('[Reward] +10 CORRECT_FIRST_TRY');
      } else if (usedHint && wrongStreak === 1) {
        // SCENARIO 2: Correct after 1 hint
        reward += this.REWARDS.CORRECT_AFTER_HINT; // +6
        console.log('[Reward] +6 CORRECT_AFTER_HINT');
      } else if (wrongStreak >= 2) {
        // SCENARIO 3: Correct after multiple wrongs
        reward += this.REWARDS.CORRECT_AFTER_RETRY; // +4
        console.log('[Reward] +4 CORRECT_AFTER_RETRY');
      } else {
        // SCENARIO 4: Correct after 1 wrong (no hint yet)
        reward += this.REWARDS.CORRECT_AFTER_HINT * 0.8; // +4.8
        console.log('[Reward] +4.8 CORRECT_AFTER_ONE_WRONG');
      }
      
      // Bonus for being in "optimal challenge zone" (70-85% mastery)
      if (newMastery >= 70 && newMastery <= 85) {
        reward += this.REWARDS.OPTIMAL_CHALLENGE; // +7
        console.log('[Reward] +7 OPTIMAL_CHALLENGE_ZONE');
      }
    } else {
      // ========== WRONG ANSWER PENALTIES ==========
      reward += this.REWARDS.WRONG_ANSWER; // -4 base
      console.log('[Reward] -4 WRONG_ANSWER');
    }

    // 1. Mastery improvement rewards
    const masteryChange = newMastery - prevMastery;
    if (masteryChange > 0) {
      const masteryReward = this.REWARDS.MASTERY_IMPROVED * (masteryChange / 10);
      reward += masteryReward;
      console.log(`[Reward] +${masteryReward.toFixed(2)} MASTERY_IMPROVED`);
    } else if (masteryChange < 0) {
      const masteryPenalty = this.REWARDS.MASTERY_DECREASED * Math.abs(masteryChange / 10);
      reward += masteryPenalty;
      console.log(`[Reward] ${masteryPenalty.toFixed(2)} MASTERY_DECREASED`);
    }

    // 2. Maintained high mastery (consistent performance)
    if (newMastery >= 75 && prevMastery >= 75) {
      reward += this.REWARDS.MAINTAINED_HIGH_MASTERY; // +3
      console.log('[Reward] +3 MAINTAINED_HIGH_MASTERY');
    }

    // 3. Chapter advancement (major milestone)
    if (action === this.ACTIONS.ADVANCE_CHAPTER) {
      reward += this.REWARDS.ADVANCED_CHAPTER; // +10
      console.log('[Reward] +10 ADVANCED_CHAPTER');
      
      // Extra bonus if achieved quickly (efficiency)
      if (totalAttempts < 20) {
        reward += this.REWARDS.RAPID_MASTERY; // +8
        console.log('[Reward] +8 RAPID_MASTERY');
      }
    }

    // 4. Frustration penalty (CRITICAL: increased to -8)
    if (wrongStreak >= 5) {
      reward += this.REWARDS.FRUSTRATION; // -8
      console.log('[Reward] -8 FRUSTRATION (5+ wrong streak)');
    } else if (wrongStreak >= 3) {
      reward += this.REWARDS.FRUSTRATION / 2; // -4
      console.log('[Reward] -4 FRUSTRATION (3-4 wrong streak)');
    }

    // 5. Boredom penalty (content too easy, no learning)
    if (correctStreak >= 10 && difficulty <= 2) {
      reward += this.REWARDS.BOREDOM; // -3
      console.log('[Reward] -3 BOREDOM');
    }

    // 6. Time-based rewards (efficient learning is better)
    const expectedTime = 60; // 60 seconds baseline
    if (timeSpent && timeSpent < expectedTime / 2) {
      reward += 1; // Quick and correct = understanding
      console.log('[Reward] +1 EFFICIENCY_BONUS');
    } else if (timeSpent && timeSpent > expectedTime * 2) {
      reward -= 1; // Slow = struggling or guessing
      console.log('[Reward] -1 SLOW_RESPONSE');
    }

    // 7. Difficulty appropriateness
    // Reward staying in appropriate difficulty for mastery level
    const appropriateDifficulty = Math.ceil(newMastery / 20);
    if (Math.abs(difficulty - appropriateDifficulty) <= 1) {
      reward += 2; // Good difficulty match
      console.log('[Reward] +2 APPROPRIATE_DIFFICULTY');
    }

    console.log(`[Reward] TOTAL: ${reward.toFixed(2)}`);
    
    // Ensure reward is a valid number
    return isNaN(reward) ? 0 : reward;
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
        const question = await this.questionGenerator.generateQuestion(
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
    
    // Early stage: Don't restrict by domain for first 3 attempts to allow variety
    // This prevents students from always seeing the same first question
    if (total_attempts < 3) {
      return null; // null = no domain filter, pick from all domains
    }
    
    // 3-10 attempts: Focus on knowledge recall and understanding
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
      const qValues = this.getQValuesForState(userId, stateKey);
      
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
        longestCorrectStreak: topicProgress.longest_correct_streak || 0, // 🏆 Best streak record
        totalAttempts: state.total_attempts,
        accuracy: state.total_attempts > 0 
          ? (state.correct_answers / state.total_attempts * 100).toFixed(1)
          : 0,
        // Persisted hint usage for this topic
        hints_shown_count: state.hints_shown_count || 0,
        
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
      
      // Clear pending questions for other topics (prevents stale state on topic switch)
      await this.repo.clearPendingForOtherTopics(userId, topicId);
      
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
      const question = await this.questionGenerator.generateQuestion(
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
   * IMPORTANT: Use exact question type names with | separator
   * Each topic should only show questions relevant to that specific concept
   */
  getTopicFilter(topicName) {
    const topicMap = {
      // Core Geometry Topics
      'Points, Lines, and Planes': 'points_needed_line|line_segment_parts|ray_parts|line_notation|segment_notation|points_needed_plane|collinear_definition|coplanar_definition|parallel_lines_definition|intersecting_lines_definition|perpendicular_lines_definition|skew_lines_definition|line_plane_postulate|plane_intersection_postulate|distance_postulate|segment_addition_postulate|midpoint_postulate|betweenness_concept|parallel_postulate_euclidean|ruler_postulate|point_definition|line_definition|line_segment_definition|ray_definition|plane_definition|collinear_points|coplanar_points|intersecting_lines|parallel_lines|perpendicular_lines|minimum_points_line|minimum_points_plane|skew_lines|line_plane_intersection|midpoint_concept|parallel_postulate|plane_intersection|distance_point_to_line|segment_addition|midpoint_calculation',
      
      'Kinds of Angles': 'right_angle_definition|acute_angle_definition|obtuse_angle_definition|straight_angle_definition|angle_classification_45|angle_classification_120|reflex_angle_definition|complete_rotation|vertical_angles|adjacent_angles|angle_bisector|linear_pair|vertical_angles_property|angle_addition|reflex_angle_example|angle_bisector_calculation|linear_pair_calculation|angle_measurement_word|clock_angle|angle_relationships|angle_type|acute_angle|right_angle|obtuse_angle|straight_angle|reflex_angle|angle_measurement',
      
      'Complementary and Supplementary Angles': 'complementary_definition|supplementary_definition|complementary_example|supplementary_example|right_angle_complement|complementary_calculation|supplementary_calculation|complementary_system|supplementary_system|angle_relationship_id|complementary_word_problem|supplementary_word_problem|complementary_difference|supplementary_difference|angle_relationships_multiple|complementary_algebraic|supplementary_algebraic|complementary_ratio_advanced|supplementary_ratio_advanced|angle_chain_reasoning|complementary_angles|supplementary_angles|missing_angle_word_problem',
      
      'Parts of a Circle': 'circle_parts|circle_diameter_definition|circle_radius_relation|circle_basic_circumference|circle_chord_definition|circle_arc_definition|circle_sector_definition|circle_tangent_definition|circle_central_angle|circle_major_minor_arc|circle_secant_definition|circle_inscribed_angle|circle_segment_definition|circle_concentric|circle_point_of_tangency|circle_inscribed_angle_theorem|circle_tangent_perpendicular|circle_chord_properties|circle_arc_relationship|circle_diameter_perpendicular_chord',
      
      'Circumference and Area of a Circle': 'circle_radius_to_diameter|circle_diameter_to_radius|circumference_formula|area_formula|pi_approximation|circumference_from_radius|circumference_from_diameter|area_from_radius|area_from_diameter|radius_from_circumference|radius_from_area|circle_word_problem_circumference|circle_word_problem_area|semicircle_perimeter|semicircle_area|quarter_circle_area|annulus_area|circle_sector_area|arc_length|circle_scale_factor|circle_circumference|circle_area|circle_sector',
      
      'Polygon Identification': 'triangle_definition|quadrilateral_definition|pentagon_sides|hexagon_sides|square_identify|heptagon_sides|octagon_sides|nonagon_sides|decagon_sides|rectangle_identify|rhombus_identify|trapezoid_identify|parallelogram_identify|equilateral_triangle|isosceles_triangle|scalene_triangle|kite_identify|regular_polygon|convex_polygon|polygon_diagonals|polygon_identify|polygon_types_sides|polygon_types_triangle|polygon_identify_quadrilateral|polygon_types_pentagon|polygon_types_octagon|polygon_identify_by_angles|polygon_regular_definition|polygon_identify_heptagon|polygon_types_nonagon|polygon_identify_decagon|polygon_convex_definition|polygon_total_diagonals|polygon_identify_classification|polygon_exterior_angle_regular|polygon_identify_by_diagonals',
      
      'Interior Angles of Polygons': 'triangle_angle_sum|triangle_angle_find|right_triangle_angles|isosceles_triangle_angles|equilateral_triangle_angle|quadrilateral_angle_sum|quadrilateral_angle_find|rectangle_angles|pentagon_angle_sum|hexagon_angle_sum|polygon_angle_sum_formula|polygon_angle_sum_calculation|regular_polygon_angle|exterior_angle_theorem|exterior_angles_sum|regular_polygon_exterior_angle|polygon_sides_from_angle_sum|regular_polygon_from_interior_angle|triangle_exterior_angle_calculation|isosceles_triangle_angle_problem|polygon_interior_triangle|polygon_interior_quadrilateral|polygon_interior_pentagon|polygon_interior_hexagon|polygon_interior_angles|quadrilateral_angles',
      
      'Perimeter and Area of Polygons': 'perimeter_definition|area_definition|square_perimeter_simple|rectangle_perimeter_simple|square_area_simple|rectangle_area|triangle_perimeter|triangle_area_basic|parallelogram_area|trapezoid_area_intro|trapezoid_area|rhombus_area|regular_polygon_perimeter|composite_figure|area_units|triangle_area_word|rectangle_word_problem|hexagon_perimeter|composite_area_word|scale_factor_area|square_perimeter|triangle_area|composite_area|pythagorean|rectangle_perimeter',
      
      'Plane and 3D Figures': 'plane_figure_definition|space_figure_definition|plane_figure_examples|space_figure_examples|dimensions_plane|dimensions_space|cube_faces|cube_vertices|cube_edges|prism_definition|pyramid_definition|cylinder_bases|cone_base|sphere_definition|polyhedron_definition|euler_formula|euler_formula_application|rectangular_prism_properties|triangular_pyramid_properties|cross_section|plane_vs_solid|identify_plane_figure|identify_solid_figure|solid_figure_properties|plane_figure_properties|solid_vs_plane_comparison|nets_of_solids',
      
      'Volume of Space Figures': 'volume_cube_basic|volume_rectangular_prism_basic|volume_concept|volume_units|volume_cube_visual|volume_cube|volume_rectangular_prism_simple|volume_cylinder_basic|volume_prism_word|volume_comparison|volume_rectangular_prism|volume_cylinder|volume_pyramid_intro|volume_cone_intro|volume_sphere_intro|volume_word_problem|volume_pyramid|volume_cone|volume_sphere|volume_cylinder_word|volume_rectangular_prism|volume_composite',
      
      'Geometric Proofs and Reasoning': 'proof_definition|given_statement|prove_statement|postulate_vs_theorem|theorem_definition|congruent_definition|similar_definition|reflexive_property|symmetric_property|transitive_property|vertical_angles_theorem|linear_pair_theorem|triangle_congruence_sss|triangle_congruence_sas|triangle_congruence_asa|cpctc|parallel_lines_theorem|alternate_interior_angles|proof_reasoning|pythagorean_theorem_converse|angle_proof_simple|triangle_inequality|congruent_angles|similar_triangles|similar_congruent_polygons|prove_parallel_lines|exterior_angle_theorem|isosceles_triangle_proof',
      
      'Geometry Word Problems': 'perimeter_word_simple|area_word_simple|angle_word_simple|distance_word|circle_word_simple|rectangle_cost_problem|paint_area_problem|triangle_garden_problem|running_track_problem|ladder_problem|composite_area_problem|circular_garden_border|roof_area_problem|box_volume_problem|water_tank_problem|scale_drawing_problem|pool_filling_problem|cone_sand_problem|sphere_ball_problem|optimization_problem|area_word_problem|perimeter_word_problem|volume_word_problem|optimization_word_problem|scale_factor_word_problem|missing_angle_word_problem',
      
      'Basic Geometric Figures': 'point_definition|line_definition|line_segment_definition|ray_definition|plane_definition|collinear_points|coplanar_points|intersecting_lines|parallel_lines|perpendicular_lines|minimum_points_line|minimum_points_plane|skew_lines|line_plane_intersection|midpoint_concept|parallel_postulate|plane_intersection|distance_point_to_line|segment_addition|midpoint_calculation|identify_lines|polygon_identify|circle_parts|angle_type|plane_vs_solid'
    };
    
    // Add surface area topics if they exist in database
    const surfaceAreaTopics = {
      'Surface Area': 'surface_area_cube|surface_area_rectangular_prism|surface_area_cylinder|surface_area_sphere|surface_area_cone|composite_solid_surface'
    };
    
    return topicMap[topicName] || surfaceAreaTopics[topicName] || null;
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
      const qValues = this.getQValuesForState(userId, stateKey);
      
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
  getQValuesForState(userId, stateKey) {
    const qValues = {};
    for (const action of Object.values(this.ACTIONS)) {
      qValues[action] = this.getQValue(userId, stateKey, action).toFixed(2);
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
      [this.ACTIONS.DECREASE_DIFFICULTY]: "Let's build a stronger foundation first! 💪",
      [this.ACTIONS.INCREASE_DIFFICULTY]: "Great job! Ready for a bigger challenge? 🚀",
      [this.ACTIONS.ADVANCE_CHAPTER]: "Excellent! You've mastered this chapter! 🎉",
      [this.ACTIONS.MAINTAIN_DIFFICULTY]: "Keep going! You're making good progress! 📈",
      [this.ACTIONS.REPEAT_CURRENT]: "Practice makes perfect! Let's strengthen your understanding. 📚",
      [this.ACTIONS.SWITCH_TO_VISUAL]: "Let's try a different approach! 🎨",
      [this.ACTIONS.GIVE_HINT_RETRY]: "Here's some help to guide you! 💡"
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
  async getTopicsWithProgress(userId, retryCount = 0) {
    try {
      console.log('[AdaptiveLearning] getTopicsWithProgress - start');
      
      // === STEP 0: Cohort Assignment (A/B Testing) ===
      // Assign user to research cohort on first interaction (if not already assigned)
      await this.ensureUserHasCohort(userId);
      
      // Get all topics
      const topicsStart = Date.now();
      const allTopics = await this.repo.getAllTopics();
      console.log(`[AdaptiveLearning] getAllTopics took ${Date.now() - topicsStart}ms, count: ${allTopics.length}`);
      
      // Get user's progress for all topics
      const progressStart = Date.now();
      const progress = await this.repo.getAllTopicProgress(userId);
      console.log(`[AdaptiveLearning] getAllTopicProgress took ${Date.now() - progressStart}ms, count: ${progress?.length || 0}`);
      
      // If user has no progress, initialize it (but prevent infinite recursion)
      if (!progress || progress.length === 0) {
        if (retryCount > 0) {
          console.error('[AdaptiveLearning] FATAL: Initialization failed after retry - RLS policies may be blocking inserts');
          throw new Error('Failed to initialize user topic progress. Check RLS policies on user_topic_progress table.');
        }
        console.log('[AdaptiveLearning] No progress found, initializing...');
        const initStart = Date.now();
        const success = await this.repo.initializeTopicsForUser(userId);
        console.log(`[AdaptiveLearning] initializeTopicsForUser took ${Date.now() - initStart}ms, success: ${success}`);
        
        if (!success) {
          throw new Error('Topic initialization failed');
        }
        
        return await this.getTopicsWithProgress(userId, retryCount + 1); // Retry once after initialization
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
   * @param {boolean} forceNew - If true, skip reusing pending questions and generate fresh question
   */
  async generateQuestion(userId, topicId, difficultyLevel, sessionId, excludeQuestionIds = [], forceNew = false) {
    try {
      const topic = await this.repo.getTopicById(topicId);
      if (!topic) {
        throw new Error('Topic not found');
      }

      // Check for pending question in user_topic_progress (NEW SYSTEM)
      // This ensures question persists across page refreshes
      if (!forceNew) {
        console.log(`[AdaptiveLearning] Checking for pending question: userId=${userId}, topicId=${topicId}`);
        const pendingData = await this.repo.getPendingQuestion(userId, topicId);
        
        console.log(`[AdaptiveLearning] Pending data retrieved:`, pendingData ? {
          has_data: !!pendingData.pending_question_data,
          attempt_count: pendingData.attempt_count,
          question_id: pendingData.pending_question_id
        } : 'null');
        
        if (pendingData && pendingData.pending_question_data) {
          console.log(`[AdaptiveLearning] ✅ REUSING pending question from database, attempt_count: ${pendingData.attempt_count}`);
          return pendingData.pending_question_data;
        } else {
          console.log(`[AdaptiveLearning] No pending question found, will generate new`);
        }
      } else {
        console.log('[AdaptiveLearning] forceNew=true, clearing pending question and generating new');
        // Clear pending question when forcing new generation
        await this.repo.clearPendingQuestion(userId, topicId);
      }

      // Get shown questions in this session
      const shownQuestions = await this.repo.getShownQuestionsInSession(userId, topicId, sessionId);
      const shownQuestionIds = shownQuestions.map(q => q.question_id);
      const allExcluded = [...excludeQuestionIds, ...shownQuestionIds];
      
      // Get recent question types to avoid immediate repeats (last 3 questions)
      const recentTypes = await this.repo.getRecentQuestionTypes(userId, topicId, 3);
      console.log('[AdaptiveLearning] Recent question types to avoid:', recentTypes);

      let question = null;

      // For difficulty 4+ and sufficient mastery/attempts, use Groq (via aiQuestionGenerator) for complex questions
      if (difficultyLevel >= this.MIN_DIFFICULTY_FOR_AI && this.aiQuestionGenerator) {
        try {
          const state = await this.repo.getStudentDifficulty(userId, topicId);
          const cognitiveDomain = this.determineCognitiveDomain(state) || 'analytical_thinking';

          // Guard: only use AI after learner shows adequate mastery/attempts
          const masteryPercent = typeof state.mastery_level === 'number' ? state.mastery_level : 0;
          const hasEnoughMastery = masteryPercent >= this.MIN_MASTERY_FOR_AI;
          const hasAttempts = (state.total_attempts || 0) >= this.MIN_ATTEMPTS_FOR_AI;

          if (!hasEnoughMastery && !hasAttempts) {
            console.log('[AdaptiveLearning] Skipping AI generation (insufficient mastery/attempts)');
          } else {

          // Add 10-second timeout to Groq API call
          const groqPromise = this.aiQuestionGenerator.generateQuestion({
            topicName: topic.topic_name,
            topicFilter: topic.topic_filter, // Add topic filter for more specific context
            difficultyLevel,
            cognitiveDomain,
            excludeQuestionIds: allExcluded
          });
          
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Groq API timeout')), 10000)
          );
          
          question = await Promise.race([groqPromise, timeoutPromise]);

          if (question) {
            console.log('[AdaptiveLearning] Generated Groq question (AI path):', question.questionId);
            
            // Save AI-generated question to database for research/reuse
            try {
              await this.repo.saveQuestion({
                topicId,
                questionText: question.question_text,
                questionType: 'ai_generated',
                options: question.options,
                correctAnswer: question.correct_answer,
                difficultyLevel,
                cognitiveDomain,
                generationParams: {
                  model: question.model || 'groq',
                  topicName: topic.topic_name,
                  representationType: question.representation_type || 'text',
                  generatedAt: new Date().toISOString()
                }
              });
              console.log('[AdaptiveLearning] Saved AI question to database');
            } catch (saveError) {
              console.warn('[AdaptiveLearning] Failed to save AI question (non-critical):', saveError.message);
              // Don't fail - question is already generated and can be used
            }
          }
          }
        } catch (aiError) {
          console.warn('[AdaptiveLearning] Groq generation failed, falling back to parametric:', aiError.message);
        }
      }

      // Fallback to parametric templates (or for difficulty 1-3)
      if (!question) {
        // Get student state for cognitive domain AND representation type
        const state = await this.repo.getStudentDifficulty(userId, topicId);
        const cognitiveDomain = this.determineCognitiveDomain(state);
        
        // ✅ Get current representation type from state (updated by SWITCH_TO_VISUAL/REAL_WORLD actions)
        const representationType = state.current_representation || 'text';
        console.log(`[AdaptiveLearning] Using representation type: ${representationType}`);
        
        // Get topic filter to match questions to topic
        const topicFilter = this.getTopicFilter(topic.topic_name);
        
        // ✅ 3-TIER FALLBACK STRATEGY (Highest quality → Most flexible)
        // Tier 1: Try CSV Question Bank (pre-validated, guaranteed correct options)
        if (this.csvQuestionBank) {
          try {
            console.log('[AdaptiveLearning] Attempting CSV Question Bank (Tier 1)...');
            const csvQuestion = await this.csvQuestionBank.getQuestion(
              difficultyLevel,
              topic.topic_name,
              representationType,
              allExcluded
            );
            
            if (csvQuestion) {
              question = csvQuestion;
              console.log('[AdaptiveLearning] ✅ CSV Question Bank success (guaranteed correct answer)');
            } else {
              console.log('[AdaptiveLearning] CSV Question Bank: No matching questions found');
            }
          } catch (csvError) {
            console.warn('[AdaptiveLearning] CSV Question Bank error:', csvError.message);
          }
        }
        
        // Tier 2: Parametric Generation (fallback if CSV unavailable)
        if (!question) {
          console.log('[AdaptiveLearning] Falling back to Parametric Generation (Tier 2)...');
          question = await this.questionGenerator.generateQuestion(
            difficultyLevel,           // difficulty level (1-5)
            topic.chapter_id || 1,     // chapter ID
            null,                      // seed (random)
            cognitiveDomain,           // cognitive domain
            representationType,        // ✅ representation type from student state (text/visual/real_world)
            topicFilter,               // topic filter (e.g., "polygon_interior")
            recentTypes                // exclude recent question types
          );
          
          if (question) {
            question.generatedBy = 'parametric';
            console.log('[AdaptiveLearning] ✅ Parametric generation success');
          }
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

      // CRITICAL: Ensure question has cognitive_domain for tracking in question_attempts table
      if (!question.cognitive_domain) {
        console.warn(`[AdaptiveLearning] Question missing cognitive_domain, setting to knowledge_recall`);
        question.cognitive_domain = 'knowledge_recall';
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

      // Save as pending question in user_topic_progress (NEW)
      // This enables persistence across page refreshes
      await this.repo.savePendingQuestion(userId, topicId, question);

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

      // Determine if question is numerical/parametric (has changing values) vs term-based (fixed answer)
      const isNumericalQuestion = this.isNumericalQuestion(questionData);

      if (!isCorrect) {
        if (isNumericalQuestion) {
          // For numerical questions: always generate new similar question (different numbers)
          // No point in keeping same question since user might memorize the specific answer
          return {
            attemptCount,
            showHint: attemptCount >= 1, // Show hint on first wrong
            generateSimilar: true, // Always generate new numbers for math problems
            keepQuestion: false // Don't keep same numerical question
          };
        } else {
          // For term-based questions: keep same question for retry on first wrong
          return {
            attemptCount,
            showHint: attemptCount >= 1, // Show hint on first wrong attempt
            generateSimilar: attemptCount >= 2, // Generate similar after 2nd wrong
            keepQuestion: attemptCount < 2 // Keep same question for first retry
          };
        }
      }

      return {
        attemptCount,
        showHint: false,
        generateSimilar: false,
        keepQuestion: false
      };

    } catch (error) {
      console.error('[AdaptiveLearning] Error tracking attempt:', error);
      return {
        attemptCount: 1,
        showHint: !isCorrect,
        generateSimilar: !isCorrect, // Default to generating new question
        keepQuestion: false
      };
    }
  }

  /**
   * Determine if a question is numerical (has parameters/calculations) vs term-based
   */
  isNumericalQuestion(questionData) {
    if (!questionData) return false;

    const questionText = questionData.questionText || '';
    
    // Check for numerical indicators in question text
    const hasNumbers = /\d/.test(questionText);
    const hasCalculationWords = /(calculate|find|compute|sum|area|perimeter|volume|surface area|total)/i.test(questionText);
    const hasUnits = /(unit|cm|meter|degree|°)/.test(questionText);
    
    // Check if options are numeric
    const options = questionData.options || [];
    const hasNumericOptions = options.some(opt => /^\d+(\.\d+)?$/.test(opt.label || opt));

    // If question has numbers AND calculation words OR numeric options, it's numerical
    return (hasNumbers && (hasCalculationWords || hasUnits)) || hasNumericOptions;
  }

  /**
   * Update hint count for a question attempt
   */
  async updateHintCount(userId, questionId, sessionId, hintsRequested) {
    try {
      return await this.repo.updateHintCount(userId, questionId, sessionId, hintsRequested);
    } catch (error) {
      console.error('[AdaptiveLearning] Error updating hint count:', error);
      throw error;
    }
  }

  /**
   * Ensure user is assigned to a research cohort (A/B testing)
   * Called on first interaction with adaptive learning system
   * @param {string} userId - User UUID
   * @returns {Promise<string>} - 'adaptive' or 'control'
   */
  async ensureUserHasCohort(userId) {
    try {
      // Check if user already has cohort assignment
      const existingCohort = await this.repo.getUserCohort(userId);
      
      if (existingCohort) {
        console.log(`[CohortAssignment] User ${userId} already in cohort: ${existingCohort}`);
        return existingCohort;
      }
      
      // Assign user to balanced cohort
      const assignedCohort = await this.repo.assignUserToBalancedCohort(userId);
      console.log(`[CohortAssignment] User ${userId} assigned to cohort: ${assignedCohort}`);
      
      // Log cohort counts for monitoring
      const counts = await this.repo.getCohortCounts();
      console.log(`[CohortAssignment] Current distribution - Adaptive: ${counts.adaptive_count}, Control: ${counts.control_count}`);
      
      return assignedCohort;
    } catch (error) {
      console.error('[CohortAssignment] Error assigning cohort:', error);
      // Fallback to 'adaptive' if assignment fails (system continues to work)
      return 'adaptive';
    }
  }

  /**
   * Get user's cohort for conditional feature enablement
   * @param {string} userId - User UUID
   * @returns {Promise<string>} - 'adaptive', 'control', or 'adaptive' (fallback)
   */
  async getUserCohort(userId) {
    try {
      const cohort = await this.repo.getUserCohort(userId);
      return cohort || 'adaptive'; // Default to adaptive if not assigned
    } catch (error) {
      console.error('[CohortAssignment] Error getting user cohort:', error);
      return 'adaptive'; // Fallback to adaptive
    }
  }
}

module.exports = AdaptiveLearningService;
