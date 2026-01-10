class Minigame {
    constructor({
        id,
        chapter_id,
        title,
        description,
        game_type,
        game_config,
        xp_reward,
        time_limit,
        order_index,
        created_at
    }) {
        this.id = id;
        this.chapter_id = chapter_id;
        this.title = title;
        this.description = description;
        this.game_type = game_type;
        this.game_config = game_config;
        this.xp_reward = xp_reward;
        this.time_limit = time_limit;
        this.order_index = order_index;
        this.created_at = created_at;
    }

    static fromDb(row) {
        return new Minigame(row);
    }

    static fromDatabase(row) {
        return new Minigame(row);
    }

    toJSON() {
        return {
            id: this.id,
            chapter_id: this.chapter_id,
            title: this.title,
            description: this.description,
            game_type: this.game_type,
            game_config: this.game_config,
            xp_reward: this.xp_reward,
            time_limit: this.time_limit,
            order_index: this.order_index,
            created_at: this.created_at
        };
    }
}

module.exports = Minigame;