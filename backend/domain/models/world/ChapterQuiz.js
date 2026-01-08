class ChapterQuiz {
    constructor({
        id,
        chapter_id,
        title,
        description,
        quiz_config,
        xp_reward,
        passing_score,
        time_limit,
        created_at
    }) {
        this.id = id;
        this.chapter_id = chapter_id;
        this.title = title;
        this.description = description;
        this.quiz_config = quiz_config;
        this.xp_reward = xp_reward;
        this.passing_score = passing_score;
        this.time_limit = time_limit;
        this.created_at = created_at;
    }

    static fromDb(row) {
        return new ChapterQuiz(row);
    }

    static fromDatabase(row) {
        return new ChapterQuiz(row);
    }

    toJSON() {
        return {
            id: this.id,
            chapter_id: this.chapter_id,
            title: this.title,
            description: this.description,
            quiz_config: this.quiz_config,
            xp_reward: this.xp_reward,
            passing_score: this.passing_score,
            time_limit: this.time_limit,
            created_at: this.created_at
        };
    }
}

module.exports = ChapterQuiz;