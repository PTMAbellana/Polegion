/**
 * StudentAdaptiveState Aggregate Root
 * Encapsulates the adaptive learning state for a student-topic pair
 * Enforces invariants and business rules for difficulty progression
 */
const Difficulty = require('./Difficulty');
const Mastery = require('./Mastery');

class StudentAdaptiveState {
  constructor(userId, topicId, difficulty, mastery, correctStreak, wrongStreak, totalAttempts = 0) {
    if (!userId || !topicId) {
      throw new Error('userId and topicId are required');
    }
    if (!(difficulty instanceof Difficulty)) {
      throw new Error('difficulty must be a Difficulty instance');
    }
    if (!(mastery instanceof Mastery)) {
      throw new Error('mastery must be a Mastery instance');
    }

    this.userId = userId;
    this.topicId = topicId;
    this.difficulty = difficulty;
    this.mastery = mastery;
    this.correctStreak = Math.max(0, correctStreak || 0);
    this.wrongStreak = Math.max(0, wrongStreak || 0);
    this.totalAttempts = Math.max(0, totalAttempts || 0);
  }

  /**
   * Student answered correctly - update state accordingly
   */
  recordCorrectAnswer() {
    const newState = new StudentAdaptiveState(
      this.userId,
      this.topicId,
      this.difficulty,
      this.mastery,
      this.correctStreak + 1,
      0, // Reset wrong streak
      this.totalAttempts + 1
    );
    return newState;
  }

  /**
   * Student answered incorrectly - update state accordingly
   */
  recordWrongAnswer() {
    const newState = new StudentAdaptiveState(
      this.userId,
      this.topicId,
      this.difficulty,
      this.mastery,
      0, // Reset correct streak
      this.wrongStreak + 1,
      this.totalAttempts + 1
    );
    return newState;
  }

  /**
   * Apply difficulty change (after MDP decision)
   */
  withDifficulty(newDifficulty) {
    if (!(newDifficulty instanceof Difficulty)) {
      throw new Error('Must pass a Difficulty instance');
    }
    return new StudentAdaptiveState(
      this.userId,
      this.topicId,
      newDifficulty,
      this.mastery,
      this.correctStreak,
      this.wrongStreak,
      this.totalAttempts
    );
  }

  /**
   * Apply mastery change (after assessment)
   */
  withMastery(newMastery) {
    if (!(newMastery instanceof Mastery)) {
      throw new Error('Must pass a Mastery instance');
    }
    return new StudentAdaptiveState(
      this.userId,
      this.topicId,
      this.difficulty,
      newMastery,
      this.correctStreak,
      this.wrongStreak,
      this.totalAttempts
    );
  }

  /**
   * Determine if student needs help (struggling)
   */
  needsHelp() {
    return this.wrongStreak >= 3 || (this.mastery.isBeginner() && this.totalAttempts > 5);
  }

  /**
   * Determine if student is learning effectively
   */
  isLearning() {
    return this.correctStreak > 0 && this.difficulty.level >= 2;
  }

  /**
   * Determine if student is ready to advance to next topic
   */
  isReadyToAdvance() {
    return this.mastery.canAdvance();
  }

  /**
   * Reset streaks only (for a new question)
   */
  resetStreaks() {
    return new StudentAdaptiveState(
      this.userId,
      this.topicId,
      this.difficulty,
      this.mastery,
      0,
      0,
      this.totalAttempts
    );
  }

  /**
   * Get state key for Q-learning table
   * Format: M{mastery_bucket}_D{difficulty}_C{correct_streak}_W{wrong_streak}
   */
  getStateKey() {
    const masteryBucket = Math.floor(this.mastery.value / 20); // 0-5 buckets
    const cStreak = Math.min(this.correctStreak, 5); // Cap at 5
    const wStreak = Math.min(this.wrongStreak, 5);  // Cap at 5
    return `M${masteryBucket}_D${this.difficulty.level}_C${cStreak}_W${wStreak}`;
  }

  /**
   * Get current effectiveness ratio
   */
  getSuccessRate() {
    if (this.totalAttempts === 0) return 0;
    const correct = Math.round(this.mastery.value); // Approximate from mastery
    return correct / this.totalAttempts;
  }

  /**
   * String representation for logging
   */
  toString() {
    return `StudentAdaptiveState(user=${this.userId}, topic=${this.topicId}, ` +
           `difficulty=${this.difficulty.level}, mastery=${this.mastery.value}%, ` +
           `streaks=${this.correctStreak}/${this.wrongStreak})`;
  }

  /**
   * Convert to plain object for database storage
   */
  toPersistent() {
    return {
      user_id: this.userId,
      topic_id: this.topicId,
      difficulty_level: this.difficulty.level,
      mastery_level: this.mastery.value,
      correct_streak: this.correctStreak,
      wrong_streak: this.wrongStreak,
      total_attempts: this.totalAttempts
    };
  }

  /**
   * Create from database record
   */
  static fromPersistent(record) {
    return new StudentAdaptiveState(
      record.user_id,
      record.topic_id,
      new Difficulty(record.difficulty_level),
      new Mastery(record.mastery_level),
      record.correct_streak,
      record.wrong_streak,
      record.total_attempts
    );
  }
}

module.exports = StudentAdaptiveState;
