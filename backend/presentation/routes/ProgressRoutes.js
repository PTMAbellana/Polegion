const express = require('express');

class ProgressRoutes {
  constructor(progressController, authMiddleware) {
    this.progressController = progressController;
    this.authMiddleware = authMiddleware;
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.use(this.authMiddleware.protect);

    /**
     * @swagger
     * /progress/user/{userId}/castle/{castleId}:
     *   get:
     *     tags: [Progress]
     *     summary: Get user progress for a specific castle
     *     description: Retrieve user's progress including castle and chapter progress
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: userId
     *         required: true
     *         schema:
     *           type: string
     *         description: User ID
     *         example: user-uuid-123
     *       - in: path
     *         name: castleId
     *         required: true
     *         schema:
     *           type: string
     *         description: Castle ID
     *         example: castle-uuid-123
     *     responses:
     *       200:
     *         description: User progress retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success: { type: boolean, example: true }
     *                 data:
     *                   type: object
     *                   properties:
     *                     castleProgress: { type: object }
     *                     chapterProgress: { type: array, items: { type: object } }
     *                     chapters: { type: array, items: { type: object } }
     *       401:
     *         $ref: '#/components/responses/UnauthorizedError'
     *       404:
     *         $ref: '#/components/responses/NotFoundError'
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    this.router.route('/user/:userId/castle/:castleId')
      .get((req, res) => this.progressController.getUserProgress(req, res));

    /**
     * @swagger
     * /progress/chapter/{chapterId}/complete:
     *   post:
     *     tags: [Progress]
     *     summary: Mark a chapter as completed
     *     description: Complete a chapter and unlock the next one
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: chapterId
     *         required: true
     *         schema:
     *           type: string
     *         description: Chapter ID
     *         example: chapter-uuid-123
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [userId, quizScore, xpEarned]
     *             properties:
     *               userId:
     *                 type: string
     *                 example: user-uuid-123
     *               quizScore:
     *                 type: number
     *                 example: 85
     *                 description: Quiz score percentage
     *               xpEarned:
     *                 type: number
     *                 example: 100
     *                 description: XP earned from chapter
     *     responses:
     *       200:
     *         description: Chapter marked as completed
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success: { type: boolean, example: true }
     *                 data: { type: object }
     *                 message: { type: string, example: "Chapter completed successfully" }
     *       400:
     *         $ref: '#/components/responses/BadRequestError'
     *       401:
     *         $ref: '#/components/responses/UnauthorizedError'
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    this.router.route('/chapter/:chapterId/complete')
      .post((req, res) => this.progressController.completeChapter(req, res));

    /**
     * @swagger
     * /progress/castle/{castleId}/unlock:
     *   post:
     *     tags: [Progress]
     *     summary: Unlock a castle for a user
     *     description: Unlock a castle if prerequisites are met
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: castleId
     *         required: true
     *         schema:
     *           type: string
     *         description: Castle ID
     *         example: castle-uuid-123
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [userId]
     *             properties:
     *               userId:
     *                 type: string
     *                 example: user-uuid-123
     *     responses:
     *       200:
     *         description: Castle unlocked successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success: { type: boolean, example: true }
     *                 data: { type: object }
     *                 message: { type: string, example: "Castle unlocked successfully" }
     *       400:
     *         $ref: '#/components/responses/BadRequestError'
     *       401:
     *         $ref: '#/components/responses/UnauthorizedError'
     *       403:
     *         description: Castle locked - prerequisites not met
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    this.router.route('/castle/:castleId/unlock')
      .post((req, res) => this.progressController.unlockCastle(req, res));

    /**
     * @swagger
     * /progress/minigame/{minigameId}/attempt:
     *   post:
     *     tags: [Progress]
     *     summary: Record a minigame attempt
     *     description: Save user's minigame attempt and award XP
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: minigameId
     *         required: true
     *         schema:
     *           type: string
     *         description: Minigame ID
     *         example: minigame-uuid-123
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [userId, score, timeTaken]
     *             properties:
     *               userId:
     *                 type: string
     *                 example: user-uuid-123
     *               score:
     *                 type: number
     *                 example: 95
     *               timeTaken:
     *                 type: number
     *                 example: 120
     *                 description: Time in seconds
     *               completed:
     *                 type: boolean
     *                 example: true
     *               attemptData:
     *                 type: object
     *                 description: Additional game-specific data
     *     responses:
     *       201:
     *         description: Minigame attempt recorded
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success: { type: boolean, example: true }
     *                 data: { type: object }
     *                 message: { type: string, example: "Minigame attempt recorded" }
     *       400:
     *         $ref: '#/components/responses/BadRequestError'
     *       401:
     *         $ref: '#/components/responses/UnauthorizedError'
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    this.router.route('/minigame/:minigameId/attempt')
      .post((req, res) => this.progressController.recordMinigameAttempt(req, res));

    /**
     * @swagger
     * /progress/quiz/{chapterQuizId}/attempt:
     *   post:
     *     tags: [Progress]
     *     summary: Record a quiz attempt
     *     description: Save user's quiz attempt and award XP if passed
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: chapterQuizId
     *         required: true
     *         schema:
     *           type: string
     *         description: Chapter Quiz ID
     *         example: quiz-uuid-123
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [userId, score, answers]
     *             properties:
     *               userId:
     *                 type: string
     *                 example: user-uuid-123
     *               score:
     *                 type: number
     *                 example: 85
     *               answers:
     *                 type: object
     *                 description: User's quiz answers
     *               timeTaken:
     *                 type: number
     *                 example: 300
     *                 description: Time in seconds
     *     responses:
     *       201:
     *         description: Quiz attempt recorded
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success: { type: boolean, example: true }
     *                 data: { type: object }
     *                 message: { type: string, example: "Quiz attempt recorded" }
     *       400:
     *         $ref: '#/components/responses/BadRequestError'
     *       401:
     *         $ref: '#/components/responses/UnauthorizedError'
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    this.router.route('/quiz/:chapterQuizId/attempt')
      .post((req, res) => this.progressController.recordQuizAttempt(req, res));

    // New routes
    this.router.post('/chapters/:chapterId/start', (req, res) =>
      this.progressController.startChapter(req, res)
    );

    this.router.post('/chapters/:chapterId/xp/lesson', (req, res) =>
      this.progressController.awardLessonXP(req, res)
    );
  }

  getRouter() {
    return this.router;
  }
}

module.exports = ProgressRoutes;