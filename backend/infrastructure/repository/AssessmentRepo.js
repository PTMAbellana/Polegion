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
            console.log(`[AssessmentRepo] Fetching questions - category: "${category}", testType: "${testType}", limit: ${limit}`);
            
            const { data, error } = await this.supabase
                .from('assessment_questions')
                .select('*')
                .eq('category', category)
                .eq('test_type', testType)
                .limit(limit * 3); // Get more than needed for random selection

            if (error) {
                console.error('[AssessmentRepo] Database error:', error);
                console.error('[AssessmentRepo] Error details:', {
                    message: error.message,
                    code: error.code,
                    details: error.details,
                    hint: error.hint
                });
                throw error;
            }

            console.log(`[AssessmentRepo] Found ${data?.length || 0} questions for category "${category}"`);
            
            if (!data || data.length === 0) {
                console.warn(`[AssessmentRepo] No questions found. Check:
                    1. Questions exist in database: SELECT COUNT(*) FROM assessment_questions WHERE category='${category}' AND test_type='${testType}';
                    2. RLS policies allow reading: Check if assessment_questions table has proper SELECT policy
                    3. Category name spelling matches exactly (case-sensitive)`);
            }

            // Shuffle and return only the requested limit
            return this.shuffleArray(data || []).slice(0, limit);
        } catch (error) {
            console.error('[AssessmentRepo] getQuestionsByCategory error:', error);
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
     * @returns {Promise<Array>} Created/updated attempt records
     */
    async saveBulkAttempts(attempts) {
        try {
            const { data, error } = await this.supabase
                .from('user_assessment_attempts')
                .upsert(attempts, {
                    onConflict: 'user_id,test_type,question_id'
                })
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
            // Build insert object with base fields
            const insertData = {
                user_id: resultsData.userId,
                test_type: resultsData.testType,
                total_score: resultsData.totalScore,
                max_score: resultsData.maxScore,
                percentage: resultsData.percentage,
                category_scores: resultsData.categoryScores
            };

            // Add time tracking fields if they exist in the schema
            // (These are optional until migration is run)
            if (resultsData.startTime) {
                insertData.started_at = resultsData.startTime;
            }
            if (resultsData.endTime) {
                insertData.ended_at = resultsData.endTime;
            }
            if (resultsData.duration !== undefined) {
                insertData.duration_seconds = resultsData.duration;
            }

            console.log('💾 Saving assessment results:', JSON.stringify(insertData, null, 2));

            const { data, error } = await this.supabase
                .from('user_assessment_results')
                .upsert(insertData, {
                    onConflict: 'user_id,test_type'
                })
                .select()
                .single();

            if (error) {
                console.error('❌ Error saving results:', error);
                console.error('❌ Insert data was:', insertData);
                throw error;
            }

            console.log('✅ Results saved successfully');
            return data;
        } catch (error) {
            console.error('❌ saveResults error:', error);
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
