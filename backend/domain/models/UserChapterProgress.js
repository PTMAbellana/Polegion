class UserChapterProgress {
    constructor({
        id,
        user_id,
        chapter_id,
        unlocked,
        completed,
        xp_earned,
        quiz_passed,
        started_at,
        completed_at,
        created_at,
        updated_at
    }) {
        this.id = id;
        this.userId = user_id;
        this.chapterId = chapter_id;
        this.unlocked = unlocked;
        this.completed = completed;
        this.xpEarned = xp_earned;
        this.quizPassed = quiz_passed;
        this.startedAt = started_at;
        this.completedAt = completed_at;
        this.createdAt = created_at;
        this.updatedAt = updated_at;
    }

    static fromDatabase(row) {
        return new UserChapterProgress({
            id: row.id,
            user_id: row.user_id,
            chapter_id: row.chapter_id,
            unlocked: row.unlocked,
            completed: row.completed,
            xp_earned: row.xp_earned,
            quiz_passed: row.quiz_passed,
            started_at: row.started_at,
            completed_at: row.completed_at,
            created_at: row.created_at,
            updated_at: row.updated_at
        });
    }

    toJSON() {
        return {
            id: this.id,
            user_id: this.userId,
            chapter_id: this.chapterId,
            unlocked: this.unlocked,
            completed: this.completed,
            xp_earned: this.xpEarned,
            quiz_passed: this.quizPassed,
            started_at: this.startedAt,
            completed_at: this.completedAt,
            created_at: this.createdAt,
            updated_at: this.updatedAt
        };
    }
}

module.exports = UserChapterProgress;