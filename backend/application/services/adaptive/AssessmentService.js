class AssessmentService {
    constructor(assessmentRepo, userCastleProgressRepo = null, chapterRepo = null, userChapterProgressRepo = null) {
        this.assessmentRepo = assessmentRepo;
        this.userCastleProgressRepo = userCastleProgressRepo;
        this.chapterRepo = chapterRepo;
        this.userChapterProgressRepo = userChapterProgressRepo;
        
        // Define the 6 categories for assessments
        this.categories = [
            'Knowledge Recall',
            'Concept Understanding',
            'Procedural Skills',
            'Analytical Thinking',
            'Problem-Solving',
            'Higher-Order Thinking'
        ];
    }

    /**
     * Generate a new assessment with 30 questions for pretest (5 per category) or 60 for posttest (10 per category)
     * @param {string} userId - User UUID
     * @param {string} testType - 'pretest' or 'posttest'
     * @returns {Promise<Object>} Assessment with questions array
     */
    async generateAssessment(userId, testType) {
        try {
            // Check if user has already completed this test
            const hasCompleted = await this.assessmentRepo.hasCompletedTest(userId, testType);
            if (hasCompleted) {
                throw new Error(`User has already completed the ${testType}`);
            }

            const questions = [];

            // Pretest: 5 questions per category, Posttest: 10 questions per category
            const questionsPerCategory = testType === 'pretest' ? 5 : 10;

            // Get random questions from each category
            for (const category of this.categories) {
                const categoryQuestions = await this.assessmentRepo.getQuestionsByCategory(
                    category,
                    testType,
                    questionsPerCategory
                );

                if (categoryQuestions.length < questionsPerCategory) {
                    console.warn(`Warning: Only ${categoryQuestions.length} questions found for ${category}`);
                }

                questions.push(...categoryQuestions);
            }

            // Shuffle all questions to randomize presentation order
            const shuffledQuestions = this.shuffleArray(questions);

            // Format questions for frontend (remove correct_answer)
            const formattedQuestions = shuffledQuestions.map((q, index) => ({
                id: q.id,
                questionId: q.question_id,
                number: index + 1,
                category: q.category,
                question: q.question,
                options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
                difficulty: q.difficulty,
                points: q.points
            }));

            return {
                userId,
                testType,
                questions: formattedQuestions,
                totalQuestions: formattedQuestions.length,
                generatedAt: new Date().toISOString()
            };

        } catch (error) {
            console.error('generateAssessment error:', error);
            throw error;
        }
    }

    /**
     * Submit and grade assessment answers
     * @param {string} userId - User UUID
     * @param {string} testType - 'pretest' or 'posttest'
     * @param {Array} answers - Array of {questionId, answer}
     * @param {string} startTime - ISO timestamp when started
     * @param {string} endTime - ISO timestamp when ended
     * @param {number} duration - Duration in seconds
     * @returns {Promise<Object>} Grading results with score breakdown
     */
    async submitAssessment(userId, testType, answers, startTime = null, endTime = null, duration = 0) {
        try {
            console.log('📝 Submit Assessment Request:');
            console.log('  userId:', userId);
            console.log('  testType:', testType);
            console.log('  answers count:', answers.length);
            console.log('  startTime:', startTime);
            console.log('  endTime:', endTime);
            console.log('  duration:', duration);

            if (!answers || answers.length === 0) {
                throw new Error('No answers provided for submission');
            }

            // Fetch the correct answers for all submitted questions
            const questionIds = answers.map(a => a.questionId);
            console.log('🔍 Fetching questions for IDs:', questionIds);
            
            const { data: questions, error } = await this.assessmentRepo.supabase
                .from('assessment_questions')
                .select('*')
                .in('question_id', questionIds);

            if (error) {
                console.error('❌ Error fetching questions:', error);
                throw new Error(`Database error fetching questions: ${error.message}`);
            }

            if (!questions || questions.length === 0) {
                console.error('❌ No questions found for provided IDs');
                throw new Error('No matching questions found in database');
            }

            console.log('✅ Fetched', questions.length, 'questions from database');

            // Create a map for quick lookup
            const questionsMap = {};
            questions.forEach(q => {
                questionsMap[q.question_id] = q;
            });

            // Grade each answer
            const gradedAnswers = [];
            const categoryScores = {};

            // Initialize category scores
            this.categories.forEach(category => {
                categoryScores[category] = {
                    correct: 0,
                    total: 0,
                    score: 0,
                    maxScore: 0
                };
            });

            let totalScore = 0;
            let maxScore = 0;

            answers.forEach(answer => {
                const question = questionsMap[answer.questionId];
                if (!question) {
                    console.warn(`Question ${answer.questionId} not found in database`);
                    return;
                }

                const isCorrect = answer.answer === question.correct_answer;
                const pointsEarned = isCorrect ? question.points : 0;

                gradedAnswers.push({
                    user_id: userId,
                    test_type: testType,
                    question_id: question.id,
                    user_answer: answer.answer,
                    is_correct: isCorrect,
                    points_earned: pointsEarned
                });

                // Update category scores
                const category = question.category;
                if (categoryScores[category]) {
                    categoryScores[category].total += 1;
                    categoryScores[category].maxScore += question.points;
                    if (isCorrect) {
                        categoryScores[category].correct += 1;
                        categoryScores[category].score += pointsEarned;
                    }
                }

                totalScore += pointsEarned;
                maxScore += question.points;
            });

            // Calculate percentages for each category
            Object.keys(categoryScores).forEach(category => {
                const catData = categoryScores[category];
                catData.percentage = catData.maxScore > 0 
                    ? Math.round((catData.score / catData.maxScore) * 100) 
                    : 0;
            });

            console.log('📊 Grading complete:');
            console.log('  Total correct:', gradedAnswers.filter(a => a.is_correct).length, '/', answers.length);
            console.log('  Total score:', totalScore, '/', maxScore);

            // Save all attempts in bulk
            console.log('💾 Saving', gradedAnswers.length, 'attempts...');
            try {
                await this.assessmentRepo.saveBulkAttempts(gradedAnswers);
                console.log('✅ Attempts saved successfully');
            } catch (error) {
                console.error('❌ Error saving attempts:', error);
                throw new Error(`Failed to save assessment attempts: ${error.message}`);
            }

            // Save overall results
            const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;

            console.log('💾 Saving overall results...');
            try {
                const results = await this.assessmentRepo.saveResults({
                    userId,
                    testType,
                    totalScore,
                    maxScore,
                    percentage: parseFloat(percentage.toFixed(2)),
                    categoryScores,
                    startTime,
                    endTime,
                    duration
                });
                console.log('✅ Overall results saved successfully');
            } catch (error) {
                console.error('❌ Error saving results:', error);
                throw new Error(`Failed to save assessment results: ${error.message}`);
            }

            // UNLOCK PROGRESSION: Handle castle unlocking after assessment
            try {
                await this.handleCastleUnlockAfterAssessment(userId, testType);
            } catch (error) {
                console.warn('⚠️ Castle unlock failed (non-critical):', error.message);
                // Don't throw - assessment was successful even if unlock fails
            }

            return {
                success: true,
                totalScore,
                maxScore,
                percentage: parseFloat(percentage.toFixed(2)),
                correctAnswers: gradedAnswers.filter(a => a.is_correct).length,
                totalQuestions: answers.length,
                categoryScores,
                completedAt: new Date().toISOString()
            };

        } catch (error) {
            console.error('❌ submitAssessment service error:', error);
            throw error;
        }
    }

    /**
     * Get assessment results for a user
     * @param {string} userId - User UUID
     * @param {string} testType - 'pretest' or 'posttest'
     * @returns {Promise<Object|null>} Assessment results or null
     */
    async getAssessmentResults(userId, testType) {
        try {
            const results = await this.assessmentRepo.getResultsByUser(userId, testType);
            
            if (!results) {
                return null;
            }

            // Parse category_scores if it's a string
            if (typeof results.category_scores === 'string') {
                results.category_scores = JSON.parse(results.category_scores);
            }

            return {
                testType: results.test_type,
                totalScore: results.total_score,
                maxScore: results.max_score,
                percentage: parseFloat(results.percentage),
                categoryScores: results.category_scores,
                completedAt: results.completed_at
            };

        } catch (error) {
            console.error('getAssessmentResults error:', error);
            throw error;
        }
    }

    /**
     * Get comparison data between pretest and posttest
     * @param {string} userId - User UUID
     * @returns {Promise<Object>} Comparison data with improvement metrics
     */
    async getComparisonData(userId) {
        try {
            const { pretest, posttest } = await this.assessmentRepo.getComparisonResults(userId);

            if (!pretest) {
                throw new Error('Pretest results not found');
            }

            if (!posttest) {
                return {
                    hasPretest: true,
                    hasPosttest: false,
                    pretest: this.formatResults(pretest),
                    message: 'Complete the posttest to see comparison'
                };
            }

            // Parse category scores if needed
            const pretestScores = typeof pretest.category_scores === 'string' 
                ? JSON.parse(pretest.category_scores) 
                : pretest.category_scores;

            const posttestScores = typeof posttest.category_scores === 'string'
                ? JSON.parse(posttest.category_scores)
                : posttest.category_scores;

            // Calculate improvements
            const categoryImprovements = {};
            this.categories.forEach(category => {
                const pretestCat = pretestScores[category] || { percentage: 0 };
                const posttestCat = posttestScores[category] || { percentage: 0 };

                categoryImprovements[category] = {
                    pretest: pretestCat.percentage,
                    posttest: posttestCat.percentage,
                    improvement: posttestCat.percentage - pretestCat.percentage,
                    improvementPercentage: pretestCat.percentage > 0
                        ? ((posttestCat.percentage - pretestCat.percentage) / pretestCat.percentage) * 100
                        : 0
                };
            });

            const overallImprovement = parseFloat(posttest.percentage) - parseFloat(pretest.percentage);

            return {
                hasPretest: true,
                hasPosttest: true,
                pretest: this.formatResults(pretest),
                posttest: this.formatResults(posttest),
                overallImprovement: parseFloat(overallImprovement.toFixed(2)),
                categoryImprovements,
                completedAt: {
                    pretest: pretest.completed_at,
                    posttest: posttest.completed_at
                }
            };

        } catch (error) {
            console.error('getComparisonData error:', error);
            throw error;
        }
    }

    /**
     * Format results object for consistent response
     * @param {Object} results - Raw results from database
     * @returns {Object} Formatted results
     */
    formatResults(results) {
        const categoryScores = typeof results.category_scores === 'string'
            ? JSON.parse(results.category_scores)
            : results.category_scores;

        return {
            totalScore: results.total_score,
            maxScore: results.max_score,
            percentage: parseFloat(results.percentage),
            categoryScores,
            completedAt: results.completed_at
        };
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

    /**
     * Handle castle unlocking after assessment completion
     * - Pretest (Castle 0) completion → Unlock Castle 1
     * - Posttest (Castle 6) completion → Mark as final completion
     * @param {string} userId - User UUID
     * @param {string} testType - 'pretest' or 'posttest'
     */
    async handleCastleUnlockAfterAssessment(userId, testType) {
        try {
            if (!this.userCastleProgressRepo) {
                console.log('[AssessmentService] userCastleProgressRepo not available, skipping castle unlock');
                return;
            }

            console.log(`[AssessmentService] Handling castle unlock for ${testType}`);

            // Get all castles ordered by unlock_order
            const { data: castles } = await this.assessmentRepo.supabase
                .from('castles')
                .select('*')
                .order('unlock_order', { ascending: true });

            if (!castles || castles.length === 0) {
                console.log('[AssessmentService] No castles found');
                return;
            }

            if (testType === 'pretest') {
                // Completing Castle 0 (Pretest) → Unlock Castle 1
                console.log('[AssessmentService] Pretest completed, unlocking Castle 1');
                
                const castle0 = castles.find(c => c.unlock_order === 0);
                const castle1 = castles.find(c => c.unlock_order === 1);

                if (!castle0 || !castle1) {
                    console.log('[AssessmentService] Castle 0 or Castle 1 not found');
                    return;
                }

                // Mark Castle 0 as completed
                const castle0Progress = await this.userCastleProgressRepo.getUserCastleProgressByUserAndCastle(userId, castle0.id);
                if (castle0Progress) {
                    await this.userCastleProgressRepo.updateUserCastleProgress(castle0Progress.id, {
                        completed: true,
                        completion_percentage: 100,
                        completed_at: new Date().toISOString()
                    });
                    console.log('[AssessmentService] Castle 0 marked as completed');
                }

                // Unlock Castle 1
                let castle1Progress = await this.userCastleProgressRepo.getUserCastleProgressByUserAndCastle(userId, castle1.id);
                
                if (castle1Progress) {
                    await this.userCastleProgressRepo.updateUserCastleProgress(castle1Progress.id, {
                        unlocked: true
                    });
                    console.log('[AssessmentService] Castle 1 unlocked (updated existing)');
                } else {
                    await this.userCastleProgressRepo.createUserCastleProgress({
                        user_id: userId,
                        castle_id: castle1.id,
                        unlocked: true,
                        completed: false,
                        total_xp_earned: 0,
                        completion_percentage: 0,
                        started_at: new Date().toISOString()
                    });
                    console.log('[AssessmentService] Castle 1 unlocked (created new)');
                }

                // Clear castle cache for this user to ensure frontend gets fresh data
                const cache = require('../../cache');
                cache.clearUserCache(userId);
                console.log('[AssessmentService] Cleared castle cache for user after pretest');

                // Unlock first chapter of Castle 1
                if (this.chapterRepo && this.userChapterProgressRepo) {
                    const castle1Chapters = await this.chapterRepo.getChaptersByCastleId(castle1.id);
                    if (castle1Chapters && castle1Chapters.length > 0) {
                        const sortedChapters = castle1Chapters.sort((a, b) => a.chapterNumber - b.chapterNumber);
                        const firstChapter = sortedChapters[0];

                        const firstChapterProgress = await this.userChapterProgressRepo.getUserChapterProgressByUserAndChapter(userId, firstChapter.id);
                        
                        if (firstChapterProgress) {
                            await this.userChapterProgressRepo.updateUserChapterProgress(firstChapterProgress.id, {
                                unlocked: true
                            });
                        } else {
                            await this.userChapterProgressRepo.createUserChapterProgress({
                                user_id: userId,
                                chapter_id: firstChapter.id,
                                unlocked: true,
                                completed: false
                            });
                        }
                        console.log('[AssessmentService] First chapter of Castle 1 unlocked');
                    }
                }

            } else if (testType === 'posttest') {
                // Completing Castle 6 (Posttest) → Mark as final completion
                console.log('[AssessmentService] Posttest completed, marking Castle 6 as completed');
                
                const castle6 = castles.find(c => c.unlock_order === 6);

                if (!castle6) {
                    console.log('[AssessmentService] Castle 6 not found');
                    return;
                }

                // Mark Castle 6 as completed AND ensure it stays unlocked
                const castle6Progress = await this.userCastleProgressRepo.getUserCastleProgressByUserAndCastle(userId, castle6.id);
                if (castle6Progress) {
                    await this.userCastleProgressRepo.updateUserCastleProgress(castle6Progress.id, {
                        unlocked: true, // Keep castle unlocked after completion
                        completed: true,
                        completion_percentage: 100,
                        completed_at: new Date().toISOString()
                    });
                    console.log('[AssessmentService] Castle 6 marked as completed and unlocked - Journey complete!');
                }

                // Clear castle cache for this user to ensure frontend gets fresh data
                const cache = require('../../cache');
                cache.clearUserCache(userId);
                console.log('[AssessmentService] Cleared castle cache for user after posttest');
            }

        } catch (error) {
            console.error('[AssessmentService] Error handling castle unlock:', error);
            // Don't throw - assessment was successful even if unlock fails
        }
    }
}

module.exports = AssessmentService;
