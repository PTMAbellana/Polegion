class Chapter {
    constructor({
        id,
        castle_id,
        title,
        description,
        chapter_number,
        xp_reward,
        created_at
    }) {
        this.id = id;
        this.castleId = castle_id;
        this.title = title;
        this.description = description;
        this.chapterNumber = chapter_number;
        this.xpReward = xp_reward;
        this.createdAt = created_at;
    }

    static fromDatabase(row) {
        return new Chapter({
            id: row.id,
            castle_id: row.castle_id,
            title: row.title,
            description: row.description,
            chapter_number: row.chapter_number,
            xp_reward: row.xp_reward,
            created_at: row.created_at
        });
    }

    toJSON() {
        return {
            id: this.id,
            castle_id: this.castleId,
            title: this.title,
            description: this.description,
            chapter_number: this.chapterNumber,
            xp_reward: this.xpReward,
            created_at: this.createdAt
        };
    }
}

module.exports = Chapter;