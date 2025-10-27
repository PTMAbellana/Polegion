class Castle {
  constructor({
    id,
    name,
    region,
    description,
    difficulty,
    terrain,
    imageNumber,
    totalXp,
    unlockOrder,
    route,
    createdAt
  }) {
    this.id = id;
    this.name = name;
    this.region = region;
    this.description = description;
    this.difficulty = difficulty;
    this.terrain = terrain;
    this.imageNumber = imageNumber;
    this.totalXp = totalXp;
    this.unlockOrder = unlockOrder;
    this.route = route;
    this.createdAt = createdAt;
  }

  static fromDatabase(data) {
    return new Castle({
      id: data.id,
      name: data.name,
      region: data.region,
      description: data.description,
      difficulty: data.difficulty,
      terrain: data.terrain,
      imageNumber: data.image_number,
      totalXp: data.total_xp,
      unlockOrder: data.unlock_order,
      route: data.route,
      createdAt: data.created_at
    });
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      region: this.region,
      description: this.description,
      difficulty: this.difficulty,
      terrain: this.terrain,
      imageNumber: this.imageNumber,
      totalXp: this.totalXp,
      unlockOrder: this.unlockOrder,
      route: this.route,
      createdAt: this.createdAt
    };
  }
}

module.exports = Castle;