const cache = require('../cache');
const userQuizAttemptModel = require('../../domain/models/UserQuizAttempt');

class UserQuizAttemptService {
    constructor(userQuizAttemptRepo, chapterQuizService, xpService, leaderboardService) {
        this.userQuizAttemptRepo = userQuizAttemptRepo;
        this.chapterQuizService = chapterQuizService;
        this.xpService = xpService;
        this.leaderboardService = leaderboardService;
        this.CACHE_TTL = 10 * 60 * 1000;
    }

    _invalidateUserQuizAttemptCache(attemptId = null) {
        if (attemptId) {
            cache.delete(cache.generateKey('user_quiz_attempt', attemptId));
        }
        cache.delete(cache.generateKey('all_user_quiz_attempts'));
    }

    async createUserQuizAttempt(data) {
        // Get the quiz to calculate score
        const quiz = await this.chapterQuizService.getChapterQuizById(data.chapter_quiz_id);
        if (!quiz) {
            throw new Error('Quiz not found');
        }
        
        console.log('[UserQuizAttemptService] Quiz config:', JSON.stringify(quiz.quiz_config, null, 2));
        console.log('[UserQuizAttemptService] User answers:', JSON.stringify(data.answers, null, 2));
        
        // Calculate score based on answers
        let score = 0;
        let totalPoints = 0;
        
        if (quiz.quiz_config && quiz.quiz_config.questions) {
            quiz.quiz_config.questions.forEach((question, index) => {
                totalPoints += question.points || 0;
                
                // Frontend sends answers with keys like "question1", "question2", etc.
                // Map to the question by index (question1 = index 0, question2 = index 1, etc.)
                const questionKey = `question${index + 1}`;
                const userAnswer = data.answers[questionKey] || data.answers[question.id];
                
                console.log(`[UserQuizAttemptService] Q${index + 1}: user="${userAnswer}", correct="${question.correctAnswer}", match=${userAnswer === question.correctAnswer}`);
                
                if (userAnswer === question.correctAnswer) {
                    score += question.points || 0;
                }
            });
        }
        
        console.log(`[UserQuizAttemptService] Total score: ${score}/${totalPoints}`);
        
        // Calculate percentage
        const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;
        const passed = percentage >= (quiz.passing_score || 70);
        
        // Award XP proportionally based on score, not pass/fail
        // XP = (points_earned / total_points) * quiz.xp_reward
        const xpEarned = totalPoints > 0 ? Math.round((score / totalPoints) * (quiz.xp_reward || 0)) : 0;
        
        console.log(`[UserQuizAttemptService] Percentage: ${percentage}%, Passed: ${passed}, XP: ${xpEarned}`);
        
        // Get previous attempts to determine attempt number
        const { data: previousAttempts, error: countError } = await this.userQuizAttemptRepo.supabase
            .from('user_quiz_attempts')
            .select('id', { count: 'exact', head: false })
            .eq('user_id', data.user_id)
            .eq('chapter_quiz_id', data.chapter_quiz_id);
        
        if (countError) {
            console.error('Error counting previous attempts:', countError);
        }
        
        const attemptNumber = (previousAttempts?.length || 0) + 1;
        
        // Create the attempt
        const attemptData = {
            ...data,
            score: percentage,
            passing_score: quiz.passing_score || 70,
            passed,
            xp_earned: xpEarned,
            attempt_number: attemptNumber,
            attempted_at: new Date()
        };
        
        const result = await this.userQuizAttemptRepo.createUserQuizAttempt(attemptData);
        this._invalidateUserQuizAttemptCache();
        return result;
    }

    async getUserQuizAttemptById(attemptId) {
        const cacheKey = cache.generateKey('user_quiz_attempt', attemptId);
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        const attempt = await this.userQuizAttemptRepo.getUserQuizAttemptById(attemptId);
        cache.set(cacheKey, attempt);
        return attempt;
    }

    async getAllUserQuizAttempts() {
        const cacheKey = cache.generateKey('all_user_quiz_attempts');
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        const attempts = await this.userQuizAttemptRepo.getAllUserQuizAttempts();
        cache.set(cacheKey, attempts);
        return attempts;
    }

    async updateUserQuizAttempt(attemptId, data) {
        const result = await this.userQuizAttemptRepo.updateUserQuizAttempt(attemptId, data);
        this._invalidateUserQuizAttemptCache(attemptId);
        return result;
    }

    async deleteUserQuizAttempt(attemptId) {
        const result = await this.userQuizAttemptRepo.deleteUserQuizAttempt(attemptId);
        this._invalidateUserQuizAttemptCache(attemptId);
        return result;
    }
}

module.exports = UserQuizAttemptService;