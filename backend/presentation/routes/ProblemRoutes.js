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
  }

  getRouter() {
    return this.router;
  }
}

module.exports = ProblemRoutes;