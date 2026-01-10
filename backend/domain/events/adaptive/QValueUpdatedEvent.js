/**
 * Domain Event: Q-Value Updated Event
 * Fired when Q-learning algorithm updates a Q-value
 */
class QValueUpdatedEvent {
  constructor(stateKey, action, oldQValue, newQValue, reward, episode, timestamp = new Date()) {
    this.type = 'QValueUpdated';
    this.stateKey = stateKey;
    this.action = action;
    this.oldQValue = oldQValue;
    this.newQValue = newQValue;
    this.reward = reward;
    this.episode = episode;                   // For tracking learning progress
    this.timestamp = timestamp;
    this.version = 1;
  }

  static create(stateKey, action, oldQValue, newQValue, reward, episode) {
    return new QValueUpdatedEvent(stateKey, action, oldQValue, newQValue, reward, episode);
  }

  getQValueImprovement() {
    return this.newQValue - this.oldQValue;
  }

  toPersistent() {
    return {
      event_type: this.type,
      data: {
        stateKey: this.stateKey,
        action: this.action,
        oldQValue: this.oldQValue,
        newQValue: this.newQValue,
        reward: this.reward,
        episode: this.episode
      },
      timestamp: this.timestamp
    };
  }
}

module.exports = QValueUpdatedEvent;
