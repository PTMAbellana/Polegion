/**
 * Mastery Calculation Service
 * 
 * SINGLE RESPONSIBILITY: Calculate context-aware mastery progression
 * 
 * Extracted from AdaptiveLearningService to follow SRP.
 * Handles all mastery gain/penalty logic based on attempt context,
 * difficulty, cognitive domain, and performance patterns.
 * 
 * RESEARCH-DEFENSIBLE MASTERY PROGRESSION:
 * - Correct on 1st try (no hint) → HIGH mastery gain (+18-25%)
 * - Correct after 1 hint → MODERATE mastery gain (+10-15%)
 * - Correct after 2+ wrongs → LOW mastery gain (+5-8%)
 * - Wrong answer → SMALL mastery penalty (-5-10%)
 * - Mastery bounded: 0-100%
 */

const Mastery = require('../../../domain/models/adaptive/Mastery');
const MasteredTopicEvent = require('../../../domain/events/adaptive/MasteredTopicEvent');

class MasteryCalculationService {
  constructor(adaptiveLearningRepo) {
    this.repo = adaptiveLearningRepo;
    
    // Cognitive domain difficulty multipliers
    this.DOMAIN_MULTIPLIERS = {
      'knowledge_recall': 1.0,        // Basic recall
      'concept_understanding': 1.1,   // Understanding relationships
      'procedural_skills': 1.15,      // Multi-step procedures
      'analytical_thinking': 1.25,    // Analysis and reasoning
      'problem_solving': 1.35,        // Complex problem solving
      'higher_order_thinking': 1.5    // Creative/evaluative thinking
    };
  }

  /**
   * Update student's performance metrics based on answer
   * 
   * Factors considered:
   * 1. Attempt count for this question (1st try vs retry)
   * 2. Difficulty level (higher difficulty = more mastery gain)
   * 3. Hint usage (tracked via wrong_streak)
   * 4. Cognitive domain (procedural < analytical < problem-solving)
   * 5. Recent accuracy pattern (consistency bonus/penalty)
   */
  async calculateMasteryUpdate(userId, topicId, currentState, isCorrect, cognitiveDomain = 'knowledge_recall') {
    const totalAttempts = currentState.total_attempts + 1;
    const correctAnswers = currentState.correct_answers + (isCorrect ? 1 : 0);
    const wrongAnswers = currentState.wrong_answers + (isCorrect ? 0 : 1);
    const correctStreak = isCorrect ? currentState.correct_streak + 1 : 0;
    const wrongStreak = !isCorrect ? currentState.wrong_streak + 1 : 0;

    console.log(`[MasteryCalc] Answer: ${isCorrect ? 'CORRECT' : 'WRONG'}, correctStreak: ${correctStreak}, wrongStreak: ${wrongStreak}`);

    const oldMasteryLevel = currentState.mastery_level || 0;
    const difficultyLevel = currentState.difficulty_level || 3;
    
    // Calculate mastery change based on context
    const masteryChange = this._calculateMasteryChange(
      isCorrect,
      correctStreak,
      wrongStreak,
      difficultyLevel,
      cognitiveDomain,
      oldMasteryLevel
    );
    
    // Apply mastery change with bounds and sample size protection
    let masteryLevel = this._applyMasteryChange(oldMasteryLevel, masteryChange, totalAttempts);
    
    console.log(`[MasteryCalc] Final: ${oldMasteryLevel.toFixed(1)}% → ${masteryLevel.toFixed(1)}% (Δ${masteryChange.toFixed(1)}%)`);

    const updates = {
      total_attempts: totalAttempts,
      correct_answers: correctAnswers,
      wrong_answers: wrongAnswers,
      correct_streak: correctStreak,
      wrong_streak: wrongStreak,
      mastery_level: masteryLevel
    };

    // Update adaptive_learning_state
    const updatedState = await this.repo.updateStudentDifficulty(userId, topicId, updates);
    
    // SYNC: Also update user_topic_progress.mastery_percentage
    await this.repo.updateTopicMastery(userId, topicId, masteryLevel);
    
    // Update longest streak if current streak beat the record
    if (isCorrect && correctStreak > 0) {
      await this.repo.updateLongestStreak(userId, topicId, correctStreak);
    }

    return {
      updatedState,
      masteryChange,
      events: this._generateMasteryEvents(userId, topicId, currentState.mastery_level, masteryLevel)
    };
  }

  /**
   * Calculate mastery change based on attempt context
   * @private
   */
  _calculateMasteryChange(isCorrect, correctStreak, wrongStreak, difficultyLevel, cognitiveDomain, oldMasteryLevel) {
    let masteryChange = 0;
    
    // Determine attempt context
    const isFirstTry = wrongStreak === 0 && correctStreak >= 1;
    const usedHint = wrongStreak >= 2;
    const multipleWrongs = wrongStreak >= 2;
    
    const domainMultiplier = this.DOMAIN_MULTIPLIERS[cognitiveDomain] || 1.0;
    
    if (isCorrect) {
      if (isFirstTry) {
        // SCENARIO 1: Correct on FIRST TRY
        const baseGain = 18 + (difficultyLevel * 1.4);
        masteryChange = baseGain * domainMultiplier;
        console.log(`[MasteryCalc] ✅ First try: +${masteryChange.toFixed(1)}% (diff ${difficultyLevel})`);
        
      } else if (usedHint && wrongStreak === 1) {
        // SCENARIO 2: Correct after 1 HINT
        const baseGain = 10 + (difficultyLevel * 1.0);
        masteryChange = baseGain * domainMultiplier;
        console.log(`[MasteryCalc] ✅ After hint: +${masteryChange.toFixed(1)}%`);
        
      } else if (multipleWrongs) {
        // SCENARIO 3: Correct after MULTIPLE WRONGS
        const baseGain = 5 + (difficultyLevel * 0.6);
        masteryChange = baseGain * domainMultiplier * 0.8;
        console.log(`[MasteryCalc] ✅ After ${wrongStreak} wrongs: +${masteryChange.toFixed(1)}%`);
        
      } else {
        // SCENARIO 4: Correct after 1 wrong
        const baseGain = 12 + (difficultyLevel * 0.8);
        masteryChange = baseGain * domainMultiplier;
        console.log(`[MasteryCalc] ✅ After 1 wrong: +${masteryChange.toFixed(1)}%`);
      }
      
      // Consistency bonus
      if (correctStreak >= 3) {
        const consistencyBonus = Math.min(correctStreak * 0.5, 3);
        masteryChange += consistencyBonus;
        console.log(`[MasteryCalc] 🎯 Consistency bonus: +${consistencyBonus.toFixed(1)}%`);
      }
      
    } else {
      // Wrong answer penalties (graduated)
      if (wrongStreak === 1) {
        masteryChange = -5;
        console.log(`[MasteryCalc] ❌ First mistake: ${masteryChange}%`);
      } else if (wrongStreak === 2) {
        masteryChange = -7;
        console.log(`[MasteryCalc] ❌ Second mistake: ${masteryChange}%`);
      } else {
        masteryChange = -10;
        console.log(`[MasteryCalc] ❌ ${wrongStreak} mistakes: ${masteryChange}%`);
      }
      
      // Beginner protection
      if (oldMasteryLevel < 30) {
        masteryChange = masteryChange * 0.5;
        console.log(`[MasteryCalc] 🛡️ Beginner protection: ${masteryChange.toFixed(1)}%`);
      }
    }
    
    return masteryChange;
  }

  /**
   * Apply mastery change with bounds and sample size protection
   * @private
   */
  _applyMasteryChange(oldMasteryLevel, masteryChange, totalAttempts) {
    let masteryLevel = oldMasteryLevel + masteryChange;
    masteryLevel = Math.max(0, Math.min(100, masteryLevel));
    
    // Sample size protection
    let masteryCapByAttempts = 100;
    if (totalAttempts === 1) masteryCapByAttempts = 25;
    else if (totalAttempts === 2) masteryCapByAttempts = 45;
    else if (totalAttempts === 3) masteryCapByAttempts = 65;
    else if (totalAttempts < 5) masteryCapByAttempts = 75;
    else if (totalAttempts < 8) masteryCapByAttempts = 85;
    
    return Math.min(masteryLevel, masteryCapByAttempts);
  }

  /**
   * Generate domain events for mastery milestones
   * @private
   */
  _generateMasteryEvents(userId, topicId, oldMasteryValue, newMasteryValue) {
    const events = [];
    const oldMastery = new Mastery(oldMasteryValue);
    const newMastery = new Mastery(newMasteryValue);

    if (!oldMastery.isAdvanced() && newMastery.isAdvanced()) {
      events.push(MasteredTopicEvent.create(userId, topicId, newMasteryValue));
      console.log(`[MasteryCalc] 🎓 Student reached Advanced mastery`);
    }

    if (!oldMastery.isExpert() && newMastery.isExpert()) {
      events.push(MasteredTopicEvent.create(userId, topicId, newMasteryValue));
      console.log(`[MasteryCalc] 🏆 Student reached Expert mastery`);
    }

    return events;
  }
}

module.exports = MasteryCalculationService;
