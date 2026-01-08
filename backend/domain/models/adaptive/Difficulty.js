/**
 * Difficulty Value Object
 * Encapsulates difficulty level with invariant enforcement
 * Part of StudentAdaptiveState aggregate
 */
class Difficulty {
  static MIN = 1;
  static MAX = 5;

  constructor(level) {
    if (!Number.isInteger(level) || level < this.constructor.MIN || level > this.constructor.MAX) {
      throw new Error(`Difficulty must be an integer between ${this.constructor.MIN} and ${this.constructor.MAX}`);
    }
    this.level = level;
  }

  /**
   * Increase difficulty by 1 (capped at MAX)
   */
  increase() {
    return new Difficulty(Math.min(this.level + 1, this.constructor.MAX));
  }

  /**
   * Decrease difficulty by 1 (floored at MIN)
   */
  decrease() {
    return new Difficulty(Math.max(this.level - 1, this.constructor.MIN));
  }

  /**
   * Check if at minimum difficulty (needs extra help)
   */
  isMinimum() {
    return this.level === this.constructor.MIN;
  }

  /**
   * Check if at maximum difficulty (expert level)
   */
  isMaximum() {
    return this.level === this.constructor.MAX;
  }

  /**
   * Get descriptive label
   */
  getLabel() {
    const labels = {
      1: 'Very Easy',
      2: 'Easy',
      3: 'Medium',
      4: 'Hard',
      5: 'Very Hard'
    };
    return labels[this.level];
  }

  /**
   * Equality check
   */
  equals(other) {
    return other instanceof Difficulty && this.level === other.level;
  }

  /**
   * String representation
   */
  toString() {
    return `Difficulty(${this.level} - ${this.getLabel()})`;
  }
}

module.exports = Difficulty;
