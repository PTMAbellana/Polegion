/**
 * Mastery Value Object
 * Encapsulates mastery level (0-100%) with learning thresholds
 * Part of StudentAdaptiveState aggregate
 */
class Mastery {
  static BEGINNER_THRESHOLD = 30;    // < 30%: needs foundation
  static INTERMEDIATE_THRESHOLD = 50; // 30-50%: understanding building
  static ADVANCED_THRESHOLD = 80;     // 80%+: ready to progress
  static EXPERT_THRESHOLD = 95;       // 95%+: mastery achieved

  constructor(percentage) {
    if (!Number.isFinite(percentage) || percentage < 0 || percentage > 100) {
      throw new Error('Mastery must be a number between 0 and 100');
    }
    this.value = Math.round(percentage * 100) / 100; // Round to 2 decimals
  }

  /**
   * Check if student is a beginner (needs foundational help)
   */
  isBeginner() {
    return this.value < this.constructor.BEGINNER_THRESHOLD;
  }

  /**
   * Check if student is at intermediate level
   */
  isIntermediate() {
    return this.value >= this.constructor.BEGINNER_THRESHOLD &&
           this.value < this.constructor.ADVANCED_THRESHOLD;
  }

  /**
   * Check if student is advanced (can progress)
   */
  isAdvanced() {
    return this.value >= this.constructor.ADVANCED_THRESHOLD &&
           this.value < this.constructor.EXPERT_THRESHOLD;
  }

  /**
   * Check if student has achieved mastery
   */
  isExpert() {
    return this.value >= this.constructor.EXPERT_THRESHOLD;
  }

  /**
   * Check if ready to unlock next topic
   */
  canAdvance() {
    return this.isAdvanced() || this.isExpert();
  }

  /**
   * Get proficiency level label
   */
  getLevel() {
    if (this.isBeginner()) return 'Beginner';
    if (this.isIntermediate()) return 'Intermediate';
    if (this.isAdvanced()) return 'Advanced';
    return 'Expert';
  }

  /**
   * Calculate improvement from previous mastery
   */
  improvementFrom(previousMastery) {
    if (!(previousMastery instanceof Mastery)) {
      throw new Error('Must compare with another Mastery instance');
    }
    return this.value - previousMastery.value;
  }

  /**
   * Check if significant improvement
   */
  hasSignificantImprovement(previousMastery) {
    return this.improvementFrom(previousMastery) >= 5;
  }

  /**
   * Equality check
   */
  equals(other) {
    return other instanceof Mastery && this.value === other.value;
  }

  /**
   * String representation
   */
  toString() {
    return `Mastery(${this.value}% - ${this.getLevel()})`;
  }
}

module.exports = Mastery;
