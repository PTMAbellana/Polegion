const BaseRepo = require('./BaseRepo');

class AssessmentRepo extends BaseRepo {
    constructor(supabase) {
        super(supabase);
    }

    /**
     * Get random questions by category and test type
     * @param {string} category - Category name (e.g., 'Knowledge Recall')
     * @param {string} testType - 'pretest' or 'posttest'
     * @param {number} limit - Number of questions to retrieve
     * @returns {Promise<Array>} Array of question objects
     */
    async getQuestionsByCategory(category, testType, limit = 10) {
        try {
            const { data, error } = await this.supabase
                .from('assessment_questions')
                .select('*')
                .eq('category', category)
                .eq('test_type', testType)
                .limit(limit * 3); // Get more than needed for random selection

            if (error) {
                console.error('Error fetching questions:', error);
                throw error;
            }

            // Shuffle and return only the requested limit
            return this.shuffleArray(data).slice(0, limit);
        } catch (error) {
            console.error('getQuestionsByCategory error:', error);
            throw error;
        }
    }

    /**
     * Save assessment attempt with questions shown
     * @param {Object} attemptData - Attempt information
     * @returns {Promise<Object>} Created attempt record
     */
    async saveAttempt(attemptData) {
        try {
            const { data, error } = await this.supabase
                .from('user_assessment_attempts')
                .insert({
                    user_id: attemptData.userId,
                    test_type: attemptData.testType,
                    question_id: attemptData.questionId,
                    user_answer: attemptData.userAnswer,
                    is_correct: attemptData.isCorrect,
                    points_earned: attemptData.pointsEarned
                })
                .select()
                .single();

            if (error) {
                console.error('Error saving attempt:', error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error('saveAttempt error:', error);
            throw error;
        }
    }

    /**
     * Save multiple attempts in bulk
     * @param {Array} attempts - Array of attempt objects
     * @returns {Promise<Array>} Created attempt records
     */
    async saveBulkAttempts(attempts) {
        try {
            const { data, error } = await this.supabase
                .from('user_assessment_attempts')
                .insert(attempts)
                .select();

            if (error) {
                console.error('Error saving bulk attempts:', error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error('saveBulkAttempts error:', error);
            throw error;
        }
    }

    /**
     * Save assessment results
     * @param {Object} resultsData - Results information
     * @returns {Promise<Object>} Created results record
     */
    async saveResults(resultsData) {
        try {
            const { data, error } = await this.supabase
                .from('user_assessment_results')
                .upsert({
                    user_id: resultsData.userId,
                    test_type: resultsData.testType,
                    total_score: resultsData.totalScore,
                    max_score: resultsData.maxScore,
                    percentage: resultsData.percentage,
                    category_scores: resultsData.categoryScores
                }, {
                    onConflict: 'user_id,test_type'
                })
                .select()
                .single();

            if (error) {
                console.error('Error saving results:', error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error('saveResults error:', error);
            throw error;
        }
    }

    /**
     * Get results by user and test type
     * @param {string} userId - User UUID
     * @param {string} testType - 'pretest' or 'posttest'
     * @returns {Promise<Object|null>} Results object or null
     */
    async getResultsByUser(userId, testType) {
        try {
            const { data, error } = await this.supabase
                .from('user_assessment_results')
                .select('*')
                .eq('user_id', userId)
                .eq('test_type', testType)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    // No results found
                    return null;
                }
                console.error('Error fetching results:', error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error('getResultsByUser error:', error);
            throw error;
        }
    }

    /**
     * Get both pretest and posttest results for a user
     * @param {string} userId - User UUID
     * @returns {Promise<Object>} Object with pretest and posttest results
     */
    async getComparisonResults(userId) {
        try {
            const { data, error } = await this.supabase
                .from('user_assessment_results')
                .select('*')
                .eq('user_id', userId)
                .in('test_type', ['pretest', 'posttest']);

            if (error) {
                console.error('Error fetching comparison results:', error);
                throw error;
            }

            const pretest = data.find(r => r.test_type === 'pretest');
            const posttest = data.find(r => r.test_type === 'posttest');

            return { pretest, posttest };
        } catch (error) {
            console.error('getComparisonResults error:', error);
            throw error;
        }
    }

    /**
     * Get all attempts for a specific test
     * @param {string} userId - User UUID
     * @param {string} testType - 'pretest' or 'posttest'
     * @returns {Promise<Array>} Array of attempt records
     */
    async getAttemptsByUser(userId, testType) {
        try {
            const { data, error } = await this.supabase
                .from('user_assessment_attempts')
                .select('*')
                .eq('user_id', userId)
                .eq('test_type', testType)
                .order('answered_at', { ascending: true });

            if (error) {
                console.error('Error fetching attempts:', error);
                throw error;
            }

            return data || [];
        } catch (error) {
            console.error('getAttemptsByUser error:', error);
            throw error;
        }
    }

    /**
     * Check if user has already completed a test
     * @param {string} userId - User UUID
     * @param {string} testType - 'pretest' or 'posttest'
     * @returns {Promise<boolean>} True if completed
     */
    async hasCompletedTest(userId, testType) {
        try {
            const { data, error } = await this.supabase
                .from('user_assessment_results')
                .select('id')
                .eq('user_id', userId)
                .eq('test_type', testType)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error('Error checking completion:', error);
                throw error;
            }

            return !!data;
        } catch (error) {
            console.error('hasCompletedTest error:', error);
            throw error;
        }
    }

    /**
     * Shuffle array using Fisher-Yates algorithm
     * @param {Array} array - Array to shuffle
     * @returns {Array} Shuffled array
     */
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}

module.exports = AssessmentRepo;
