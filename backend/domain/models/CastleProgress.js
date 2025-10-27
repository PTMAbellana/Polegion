class CastleProgress {
  constructor({
    id,
    userId,
    castleId,
    unlocked,
    completed,
    totalXpEarned,
    completionPercentage,
    startedAt,
    completedAt,
    createdAt,
    updatedAt
  }) {
    this.id = id;
    this.userId = userId;
    this.castleId = castleId;
    this.unlocked = unlocked;
    this.completed = completed;
    this.totalXpEarned = totalXpEarned;
    this.completionPercentage = completionPercentage;
    this.startedAt = startedAt;
    this.completedAt = completedAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromDatabase(data) {
    return new CastleProgress({
      id: data.id,
      userId: data.user_id,
      castleId: data.castle_id,
      unlocked: data.unlocked,
      completed: data.completed,
      totalXpEarned: data.total_xp_earned,
      completionPercentage: data.completion_percentage,
      startedAt: data.started_at,
      completedAt: data.completed_at,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    });
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      castleId: this.castleId,
      unlocked: this.unlocked,
      completed: this.completed,
      totalXpEarned: this.totalXpEarned,
      completionPercentage: this.completionPercentage,
      startedAt: this.startedAt,
      completedAt: this.completedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = CastleProgress;