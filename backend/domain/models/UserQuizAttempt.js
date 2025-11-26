class UserQuizAttempt {
    constructor({
        id,
        user_id,
        chapter_quiz_id,
        score,
        passing_score,
        passed,
        xp_earned,
        answers,
        time_taken,
        attempt_number,
        attempted_at,
        created_at
    }) {
        this.id = id;
        this.user_id = user_id;
        this.chapter_quiz_id = chapter_quiz_id;
        this.score = score;
        this.passing_score = passing_score;
        this.passed = passed;
        this.xp_earned = xp_earned;
        this.answers = answers;
        this.time_taken = time_taken;
        this.attempt_number = attempt_number;
        this.attempted_at = attempted_at;
        this.created_at = created_at;
    }

    static fromDb(row) {
        return new UserQuizAttempt(row);
    }

    static fromDatabase(row) {
        return new UserQuizAttempt(row);
    }

    toJSON() {
        return {
            id: this.id,
            userId: this.user_id,
            chapterQuizId: this.chapter_quiz_id,
            score: this.score,
            passingScore: this.passing_score,
            passed: this.passed,
            xpEarned: this.xp_earned,
            answers: this.answers,
            timeTaken: this.time_taken,
            attemptNumber: this.attempt_number,
            attemptedAt: this.attempted_at,
            createdAt: this.created_at
        };
    }
}

module.exports = UserQuizAttempt;