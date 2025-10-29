class ProgressController {
    constructor(progressService) {
        this.progressService = progressService;
    }

    async getUserProgress(req, res) {
        try {
            const { userId, castleId } = req.params;
            
            console.log(`[ProgressController] Getting progress for user ${userId}, castle ${castleId}`);

            if (!userId || !castleId) {
                return res.status(400).json({
                    success: false,
                    message: 'User ID and Castle ID are required'
                });
            }

            const progress = await this.progressService.getUserCastleProgress(userId, castleId);

            return res.status(200).json({
                success: true,
                data: progress
            });
        } catch (error) {
            console.error('[ProgressController] Error getting user progress:', error);
            
            // Return detailed error for debugging
            return res.status(500).json({
                success: false,
                message: error.message || 'Failed to get user progress',
                error: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    }

    /**
     * POST /progress/user/:userId/chapter/:chapterId/complete
     * Complete a chapter
     */
    async completeChapter(req, res) {
        try {
            const { userId, chapterId } = req.params;
            const { quiz_score, xp_earned } = req.body;

            console.log(`[ProgressController] Completing chapter ${chapterId} for user ${userId}`);

            const result = await this.progressService.completeChapter(
                userId,
                chapterId,
                quiz_score || 0,
                xp_earned || 0
            );

            return res.status(200).json({
                success: true,
                data: result,
                message: 'Chapter completed successfully'
            });
        } catch (error) {
            console.error('[ProgressController] Error:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Failed to complete chapter',
                error: error.message
            });
        }
    }

    /**
     * GET /progress/overview/:userId
     * Get overview of all castle progress
     */
    async getProgressOverview(req, res) {
        try {
            const { userId } = req.params;

            const overview = await this.progressService.getProgressOverview(userId);

            return res.status(200).json({
                success: true,
                data: overview,
                message: 'Progress overview fetched successfully'
            });
        } catch (error) {
            console.error('[ProgressController] Error:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Failed to fetch overview',
                error: error.message
            });
        }
    }

    /**
     * GET /progress/castles/:userId
     * Get all castle progress
     */
    async getCastleProgress(req, res) {
        try {
            const { userId } = req.params;

            const progress = await this.progressService.getCastleProgress(userId);

            return res.status(200).json({
                success: true,
                data: progress,
                message: 'Castle progress fetched successfully'
            });
        } catch (error) {
            console.error('[ProgressController] Error:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Failed to fetch castle progress',
                error: error.message
            });
        }
    }

    /**
     * GET /progress/chapters/:castleId/:userId
     * Get chapter progress for a castle
     */
    async getChapterProgress(req, res) {
        try {
            const { userId, castleId } = req.params;

            const progress = await this.progressService.getChapterProgress(userId, castleId);

            return res.status(200).json({
                success: true,
                data: progress,
                message: 'Chapter progress fetched successfully'
            });
        } catch (error) {
            console.error('[ProgressController] Error:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Failed to fetch chapter progress',
                error: error.message
            });
        }
    }

    /**
     * PATCH /progress/user/:userId/chapter/:chapterId
     * Update chapter progress
     */
    async updateChapterProgress(req, res) {
        try {
            const { userId, chapterId } = req.params;
            const progressData = req.body;

            const result = await this.progressService.updateChapterProgressData(
                userId,
                chapterId,
                progressData
            );

            return res.status(200).json({
                success: true,
                data: result,
                message: 'Chapter progress updated successfully'
            });
        } catch (error) {
            console.error('[ProgressController] Error:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Failed to update chapter progress',
                error: error.message
            });
        }
    }

    /**
     * POST /progress/minigames/:minigameId/attempt
     * Record minigame attempt
     */
    async recordMinigameAttempt(req, res) {
        try {
            const { minigameId } = req.params;
            const { userId, ...attemptData } = req.body;

            const result = await this.progressService.recordMinigameAttempt(
                userId,
                minigameId,
                attemptData
            );

            return res.status(201).json({
                success: true,
                data: result,
                message: 'Minigame attempt recorded successfully'
            });
        } catch (error) {
            console.error('[ProgressController] Error:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Failed to record minigame attempt',
                error: error.message
            });
        }
    }

    /**
     * POST /progress/quizzes/:chapterQuizId/attempt
     * Record quiz attempt
     */
    async recordQuizAttempt(req, res) {
        try {
            const { chapterQuizId } = req.params;
            const { userId, ...quizData } = req.body;

            const result = await this.progressService.recordQuizAttempt(
                userId,
                chapterQuizId,
                quizData
            );

            return res.status(201).json({
                success: true,
                data: result,
                message: 'Quiz attempt recorded successfully'
            });
        } catch (error) {
            console.error('[ProgressController] Error:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Failed to record quiz attempt',
                error: error.message
            });
        }
    }

    /**
     * Start a chapter
     * POST /api/progress/chapters/:chapterId/start
     */
    async startChapter(req, res) {
        try {
            if (!req.user || !req.user.id) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }

            const userId = req.user.id;
            const { chapterId } = req.params;

            const progress = await this.progressService.startChapter(userId, chapterId);

            res.status(200).json({
                success: true,
                data: progress
            });
        } catch (error) {
            console.error('Start chapter error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Award lesson XP
     * POST /api/progress/chapters/:chapterId/xp/lesson
     */
    async awardLessonXP(req, res) {
        try {
            if (!req.user || !req.user.id) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }

            const userId = req.user.id;
            const { chapterId } = req.params;
            const { xpAmount } = req.body;

            const result = await this.progressService.awardChapterXP(
                userId,
                chapterId,
                xpAmount,
                'lesson'
            );

            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error('Award lesson XP error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = ProgressController;