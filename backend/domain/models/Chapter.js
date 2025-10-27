class Chapter {
  constructor({
    id,
    castleId,
    title,
    description,
    chapterNumber,
    xpReward,
    content,
    createdAt
  }) {
    this.id = id;
    this.castleId = castleId;
    this.title = title;
    this.description = description;
    this.chapterNumber = chapterNumber;
    this.xpReward = xpReward;
    this.content = content;
    this.createdAt = createdAt;
  }

  static fromDatabase(data) {
    return new Chapter({
      id: data.id,
      castleId: data.castle_id,
      title: data.title,
      description: data.description,
      chapterNumber: data.chapter_number,
      xpReward: data.xp_reward,
      content: data.content,
      createdAt: data.created_at
    });
  }

  toJSON() {
    return {
      id: this.id,
      castleId: this.castleId,
      title: this.title,
      description: this.description,
      chapterNumber: this.chapterNumber,
      xpReward: this.xpReward,
      content: this.content,
      createdAt: this.createdAt
    };
  }
}

module.exports = Chapter;