/**
 * Domain Event: Mastered Topic Event
 * Fired when a student reaches mastery on a topic
 */
class MasteredTopicEvent {
  constructor(userId, topicId, masteryLevel, timestamp = new Date()) {
    this.type = 'MasteredTopic';
    this.userId = userId;
    this.topicId = topicId;
    this.masteryLevel = masteryLevel; // 0-100
    this.timestamp = timestamp;
    this.version = 1;
  }

  static create(userId, topicId, masteryLevel) {
    return new MasteredTopicEvent(userId, topicId, masteryLevel);
  }

  toPersistent() {
    return {
      event_type: this.type,
      user_id: this.userId,
      topic_id: this.topicId,
      data: {
        masteryLevel: this.masteryLevel
      },
      timestamp: this.timestamp
    };
  }
}

module.exports = MasteredTopicEvent;
