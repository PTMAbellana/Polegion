class UserCastleProgress {
    constructor({
        id,
        user_id,
        castle_id,
        unlocked,
        completed,
        total_xp_earned,
        completion_percentage,
        started_at,
        completed_at,
        created_at,
        updated_at
    }) {
        this.id = id;
        this.user_id = user_id;
        this.castle_id = castle_id;
        this.unlocked = unlocked;
        this.completed = completed;
        this.total_xp_earned = total_xp_earned;
        this.completion_percentage = completion_percentage;
        this.started_at = started_at;
        this.completed_at = completed_at;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    static fromDb(row) {
        return new UserCastleProgress(row);
    }

    static fromDatabase(row) {
        return new UserCastleProgress(row);
    }

    toJSON() {
        return {
            id: this.id,
            user_id: this.user_id,
            castle_id: this.castle_id,
            unlocked: this.unlocked,
            completed: this.completed,
            total_xp_earned: this.total_xp_earned,
            completion_percentage: this.completion_percentage,
            started_at: this.started_at,
            completed_at: this.completed_at,
            created_at: this.created_at,
            updated_at: this.updated_at
        };
    }
}

module.exports = UserCastleProgress;