/**
 * Domain Event: Difficulty Adjusted Event
 * Fired when adaptive system adjusts difficulty for a student
 */
class DifficultyAdjustedEvent {
  constructor(userId, topicId, oldDifficulty, newDifficulty, reason, timestamp = new Date()) {
    this.type = 'DifficultyAdjusted';
    this.userId = userId;
    this.topicId = topicId;
    this.oldDifficulty = oldDifficulty;       // 1-5
    this.newDifficulty = newDifficulty;       // 1-5
    this.reason = reason;                     // 'mastery_increased' | 'frustration_detected' | 'strategy_change' | etc.
    this.timestamp = timestamp;
    this.version = 1;
  }

  static create(userId, topicId, oldDifficulty, newDifficulty, reason) {
    return new DifficultyAdjustedEvent(userId, topicId, oldDifficulty, newDifficulty, reason);
  }

  toPersistent() {
    return {
      event_type: this.type,
      user_id: this.userId,
      topic_id: this.topicId,
      data: {
        oldDifficulty: this.oldDifficulty,
        newDifficulty: this.newDifficulty,
        reason: this.reason
      },
      timestamp: this.timestamp
    };
  }
}

module.exports = DifficultyAdjustedEvent;
