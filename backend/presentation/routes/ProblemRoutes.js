const express = require('express');

class ProblemRoutes {
  constructor(problemController, authMiddleware) {
    this.problemController = problemController;
    this.authMiddleware = authMiddleware;
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.use(this.authMiddleware.protect)

    /**
     * @swagger
     * /problems/room-code/{room_code}:
     *   get:
     *     tags: [Problems]
     *     summary: Get room problems by code
     *     description: Retrieve all problems in a room using room code
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: room_code
     *         required: true
     *         schema:
     *           type: string
     *         description: Room code
     *         example: ROOM123
     *     responses:
     *       200:
     *         description: Problems retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message: { type: string, example: "Problems retrieved successfully" }
     *                 problems: { type: array, items: { type: object } }
     *       401:
     *         $ref: '#/components/responses/UnauthorizedError'
     *       404:
     *         $ref: '#/components/responses/NotFoundError'
     */
    this.router.route('/room-code/:room_code')
      .get(this.problemController.getRoomProblemsByCode)

    /**
     * @swagger
     * /problems/update-timer/{problem_id}:
     *   put:
     *     tags: [Problems]
     *     summary: Update problem timer
     *     description: Update the time limit for a specific problem
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: problem_id
     *         required: true
     *         schema:
     *           type: string
     *         description: Problem ID
     *         example: problem-uuid-123
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [timeLimit]
     *             properties:
     *               timeLimit:
     *                 type: integer
     *                 example: 1800
     *                 description: Time limit in seconds
     *     responses:
     *       200:
     *         description: Timer updated successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message: { type: string, example: "Timer updated successfully" }
     *                 problem: { type: object }
     *       400:
     *         $ref: '#/components/responses/BadRequestError'
     *       401:
     *         $ref: '#/components/responses/UnauthorizedError'
     *       404:
     *         $ref: '#/components/responses/NotFoundError'
     */
    this.router.route('/update-timer/:problem_id')
      .put(this.problemController.updateTimer)

    /**
     * @swagger
     * /problems/compe-problems/{competition_id}:
     *   get:
     *     tags: [Problems]
     *     summary: Get all competition problems
     *     description: Retrieve all problems associated with a competition
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: competition_id
     *         required: true
     *         schema:
     *           type: string
     *         description: Competition ID
     *         example: compe-uuid-123
     *     responses:
     *       200:
     *         description: Competition problems retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message: { type: string, example: "Competition problems retrieved successfully" }
     *                 problems: { type: array, items: { type: object } }
     *       401:
     *         $ref: '#/components/responses/UnauthorizedError'
     *       404:
     *         $ref: '#/components/responses/NotFoundError'
     */
    this.router.route('/compe-problems/:competition_id')
      .get(this.problemController.getAllCompeProblems)

    /**
     * @swagger
     * /problems:
     *   post:
     *     tags: [Problems]
     *     summary: Create a new problem
     *     description: Create a new programming problem
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [title, description, difficulty]
     *             properties:
     *               title:
     *                 type: string
     *                 example: Two Sum Problem
     *               description:
     *                 type: string
     *                 example: Given an array of integers...
     *               difficulty:
     *                 type: string
     *                 enum: [EASY, MEDIUM, HARD]
     *                 example: EASY
     *               points:
     *                 type: integer
     *                 example: 100
     *               timeLimit:
     *                 type: integer
     *                 example: 60
     *     responses:
     *       201:
     *         description: Problem created successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message: { type: string, example: "Problem created successfully" }
     *                 problem: { type: object }
     *       400:
     *         $ref: '#/components/responses/BadRequestError'
     *       401:
     *         $ref: '#/components/responses/UnauthorizedError'
     */
    this.router.route('/')
      .post(this.problemController.createProblem)

    /**
     * @swagger
     * /problems/{room_id}:
     *   get:
     *     tags: [Problems]
     *     summary: Get room problems
     *     description: Retrieve all problems in a specific room
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: room_id
     *         required: true
     *         schema:
     *           type: string
     *         description: Room ID
     *         example: room-uuid-123
     *     responses:
     *       200:
     *         description: Room problems retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message: { type: string, example: "Room problems retrieved successfully" }
     *                 problems: { type: array, items: { type: object } }
     *       401:
     *         $ref: '#/components/responses/UnauthorizedError'
     *       404:
     *         $ref: '#/components/responses/NotFoundError'
     */
    this.router.route('/:room_id')
      .get(this.problemController.getRoomProblems)

    /**
     * @swagger
     * /problems/{problem_id}:
     *   get:
     *     tags: [Problems]
     *     summary: Get specific problem
     *     description: Retrieve details of a specific problem
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: problem_id
     *         required: true
     *         schema:
     *           type: string
     *         description: Problem ID
     *         example: problem-uuid-123
     *     responses:
     *       200:
     *         description: Problem retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message: { type: string, example: "Problem retrieved successfully" }
     *                 problem: { type: object }
     *       401:
     *         $ref: '#/components/responses/UnauthorizedError'
     *       404:
     *         $ref: '#/components/responses/NotFoundError'
     *   put:
     *     tags: [Problems]
     *     summary: Update problem
     *     description: Update an existing problem
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: problem_id
     *         required: true
     *         schema:
     *           type: string
     *         description: Problem ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               title:
     *                 type: string
     *                 example: Updated Problem Title
     *               description:
     *                 type: string
     *                 example: Updated problem description...
     *               difficulty:
     *                 type: string
     *                 enum: [EASY, MEDIUM, HARD]
     *                 example: MEDIUM
     *               points:
     *                 type: integer
     *                 example: 150
     *               timeLimit:
     *                 type: integer
     *                 example: 120
     *     responses:
     *       200:
     *         description: Problem updated successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message: { type: string, example: "Problem updated successfully" }
     *                 problem: { type: object }
     *       400:
     *         $ref: '#/components/responses/BadRequestError'
     *       401:
     *         $ref: '#/components/responses/UnauthorizedError'
     *       404:
     *         $ref: '#/components/responses/NotFoundError'
     *   delete:
     *     tags: [Problems]
     *     summary: Delete problem
     *     description: Delete a specific problem
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: problem_id
     *         required: true
     *         schema:
     *           type: string
     *         description: Problem ID
     *     responses:
     *       200:
     *         description: Problem deleted successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message: { type: string, example: "Problem deleted successfully" }
     *       401:
     *         $ref: '#/components/responses/UnauthorizedError'
     *       404:
     *         $ref: '#/components/responses/NotFoundError'
     */
    this.router.route('/:problem_id')
      .get(this.problemController.getProblem)
      .delete(this.problemController.deleteProblem)
      .put(this.problemController.updateProblem)
  
    /**
     * @swagger
     * /problems/{problem_id}/{competition_id}:
     *   post:
     *     tags: [Problems]
     *     summary: Add problem to competition
     *     description: Add a problem to a specific competition
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: problem_id
     *         required: true
     *         schema:
     *           type: string
     *         description: Problem ID
     *         example: problem-uuid-123
     *       - in: path
     *         name: competition_id
     *         required: true
     *         schema:
     *           type: string
     *         description: Competition ID
     *         example: compe-uuid-123
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               order:
     *                 type: integer
     *                 example: 1
     *                 description: Order of problem in competition
     *     responses:
     *       201:
     *         description: Problem added to competition successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message: { type: string, example: "Problem added to competition successfully" }
     *                 compeProblem: { type: object }
     *       400:
     *         $ref: '#/components/responses/BadRequestError'
     *       401:
     *         $ref: '#/components/responses/UnauthorizedError'
     *       404:
     *         $ref: '#/components/responses/NotFoundError'
     *   delete:
     *     tags: [Problems]
     *     summary: Remove problem from competition
     *     description: Remove a problem from a specific competition
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: problem_id
     *         required: true
     *         schema:
     *           type: string
     *         description: Problem ID
     *       - in: path
     *         name: competition_id
     *         required: true
     *         schema:
     *           type: string
     *         description: Competition ID
     *     responses:
     *       200:
     *         description: Problem removed from competition successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message: { type: string, example: "Problem removed from competition successfully" }
     *       401:
     *         $ref: '#/components/responses/UnauthorizedError'
     *       404:
     *         $ref: '#/components/responses/NotFoundError'
     */

    /**
     * @swagger
     * /problems/{problem_id}/attempt:
     *   post:
     *     tags: [Problems]
     *     summary: Submit a solution for a public problem
     *     description: Submit and grade a solution attempt for a public problem
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: problem_id
     *         required: true
     *         schema:
     *           type: string
     *         description: Problem ID
     *         example: problem-uuid-123
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [solution]
     *             properties:
     *               solution:
     *                 type: object
     *                 description: Student's submitted solution containing shapes array and time spent
     *                 properties:
     *                   shapes:
     *                     type: array
     *                     items:
     *                       type: object
     *                       properties:
     *                         type: { type: string, example: "square" }
     *                         area: { type: number, example: 25.5 }
     *                         sideLengths: { type: array, items: { type: number } }
     *                   time_spent: { type: integer, example: 120 }
     *                 example: { "shapes": [{ "type": "square", "area": 25.5, "sideLengths": [5, 5, 5, 5] }], "time_spent": 120 }
     *     responses:
     *       200:
     *         description: Submission graded successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message: { type: string, example: "Submission graded successfully" }
     *                 data:
     *                   type: object
     *                   properties:
     *                     is_correct: { type: boolean }
     *                     score: { type: number }
     *                     feedback: { type: string }
     *                     validation_details: { type: object }
     *                     attempt_number: { type: integer }
     *                     xp_gained: { type: integer }
     *       401:
     *         $ref: '#/components/responses/UnauthorizedError'
     *       403:
     *         description: Not a participant in this room
     *       404:
     *         description: Problem not found or not public
     */
    this.router.route('/:problem_id/attempt')
      .post(this.problemController.submitPublicProblemAttempt)

    this.router.route('/:problem_id/:competition_id')
      .post(this.problemController.addCompeProblem)
      .delete(this.problemController.removeCompeProblem)

    /**
     * @swagger
     * /problems/compe-problem/{compe_prob_id}:
     *   get:
     *     tags: [Problems]
     *     summary: Get current competition problem
     *     description: Get specific competition problem details
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: compe_prob_id
     *         required: true
     *         schema:
     *           type: string
     *         description: Competition Problem ID
     *         example: compe-prob-uuid-123
     *     responses:
     *       200:
     *         description: Competition problem retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message: { type: string, example: "Competition problem retrieved successfully" }
     *                 compeProblem: { type: object }
     *       401:
     *         $ref: '#/components/responses/UnauthorizedError'
     *       404:
     *         $ref: '#/components/responses/NotFoundError'
     */
    this.router.route('/compe-problem/:compe_prob_id')
      .get(this.problemController.getCurrCompeProblem)

    /**
     * @swagger
     * /problems/public/{room_id}:
     *   get:
     *     tags: [Problems]
     *     summary: Get all public problems in a room
     *     description: Retrieve all public problems available for practice with user stats
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: room_id
     *         required: true
     *         schema:
     *           type: string
     *         description: Room ID
     *         example: 123
     *     responses:
     *       200:
     *         description: Public problems retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message: { type: string, example: "Successfully fetched public problems" }
     *                 data: { type: array, items: { type: object } }
     *       401:
     *         $ref: '#/components/responses/UnauthorizedError'
     *       404:
     *         $ref: '#/components/responses/NotFoundError'
     */
    this.router.route('/public/:room_id')
      .get(this.problemController.getPublicProblems)

    /**
     * @swagger
     * /problems/public-problem/{problem_id}:
     *   get:
     *     tags: [Problems]
     *     summary: Get a single public problem
     *     description: Retrieve details for a specific public problem that students can access
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: problem_id
     *         required: true
     *         schema:
     *           type: string
     *         description: Problem ID
     *         example: problem-uuid-123
     *     responses:
     *       200:
     *         description: Problem retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message: { type: string, example: "Successfully fetched problem" }
     *                 data: { type: object }
     *       401:
     *         $ref: '#/components/responses/UnauthorizedError'
     *       404:
     *         $ref: '#/components/responses/NotFoundError'
     */
    this.router.route('/public-problem/:problem_id')
      .get(this.problemController.getPublicProblem)

    /**
     * @swagger
     * /problems/{problem_id}/leaderboard:
     *   get:
     *     tags: [Problems]
     *     summary: Get leaderboard for a problem
     *     description: Retrieve rankings and scores for a specific problem
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: problem_id
     *         required: true
     *         schema:
     *           type: string
     *         description: Problem ID
     *         example: problem-uuid-123
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *           default: 50
     *         description: Maximum number of leaderboard entries
     *     responses:
     *       200:
     *         description: Leaderboard retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message: { type: string, example: "Successfully fetched leaderboard" }
     *                 data:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       rank: { type: integer, example: 1 }
     *                       user_id: { type: string, example: "user-uuid-123" }
     *                       username: { type: string, example: "John Doe" }
     *                       best_score: { type: number, example: 100.0 }
     *                       time_taken: { type: integer, example: 120, description: "Time in seconds" }
     *                       attempt_count: { type: integer, example: 3 }
     *                       last_attempt_at: { type: string, format: date-time }
     *       401:
     *         $ref: '#/components/responses/UnauthorizedError'
     *       404:
     *         $ref: '#/components/responses/NotFoundError'
     */
    this.router.route('/:problem_id/leaderboard')
      .get(this.problemController.getProblemLeaderboard)

    /**
     * @swagger
     * /problems/{problem_id}/stats:
     *   get:
     *     tags: [Problems]
     *     summary: Get user's statistics for a problem
     *     description: Retrieve user's attempt history and best score for a specific problem
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: problem_id
     *         required: true
     *         schema:
     *           type: string
     *         description: Problem ID
     *         example: problem-uuid-123
     *     responses:
     *       200:
     *         description: User stats retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message: { type: string, example: "Successfully fetched user stats" }
     *                 data:
     *                   type: object
     *                   properties:
     *                     attempts: { type: integer }
     *                     best_score: { type: number }
     *                     last_attempt: { type: string, format: date-time }
     *       401:
     *         $ref: '#/components/responses/UnauthorizedError'
     */
    this.router.route('/:problem_id/stats')
      .get(this.problemController.getUserProblemStats)
  }

  getRouter() {
    return this.router;
  }
}

module.exports = ProblemRoutes;