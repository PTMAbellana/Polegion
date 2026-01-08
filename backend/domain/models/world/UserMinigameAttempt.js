class UserMinigameAttempt {
    constructor({
        id,
        user_id,
        minigame_id,
        score,
        time_taken,
        xp_earned,
        completed,
        attempt_data,
        attempted_at,
        created_at
    }) {
        this.id = id;
        this.user_id = user_id;
        this.minigame_id = minigame_id;
        this.score = score;
        this.time_taken = time_taken;
        this.xp_earned = xp_earned;
        this.completed = completed;
        this.attempt_data = attempt_data;
        this.attempted_at = attempted_at;
        this.created_at = created_at;
    }

    static fromDb(row) {
        return new UserMinigameAttempt(row);
    }

    static fromDatabase(row) {
        return new UserMinigameAttempt(row);
    }

    toJSON() {
        return {
            id: this.id,
            userId: this.user_id,
            minigameId: this.minigame_id,
            score: this.score,
            timeTaken: this.time_taken,
            xpEarned: this.xp_earned,
            completed: this.completed,
            attemptData: this.attempt_data,
            attemptedAt: this.attempted_at,
            createdAt: this.created_at
        };
    }
}

module.exports = UserMinigameAttempt;