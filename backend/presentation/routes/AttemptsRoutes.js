const express = require('express');

class AttemptsRoutes {

    constructor (attemptsController, authMiddleware) {
        this.attemptsController = attemptsController
        this.authMiddleware = authMiddleware
        this.router = express.Router()
        this.initializeRoutes()
    }

    initializeRoutes(){
        this.router.use(this.authMiddleware.protect);
        
        /**
         * @swagger
         * /attempts/submit:
         *   post:
         *     tags: [Attempts]
         *     summary: Submit solution
         *     description: Submit a solution for a competition problem
         *     security:
         *       - bearerAuth: []
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required: [problemId, solution]
         *             properties:
         *               problemId:
         *                 type: string
         *                 example: problem-uuid-123
         *                 description: The ID of the problem being solved
         *               solution:
         *                 type: object
         *                 description: JSONB data representing the solution (stored in Supabase)
         *                 example:
         *                   - x: 347
         *                     y: 170
         *                     id: 1753199195126
         *                     area: 295.59
         *                     size: 194
         *                     type: circle
         *                     color: "#e3dcc2"
         *                     radius: 40
         *                     diameter: 19.4
         *                     circumference: 60.95
         *                 additionalProperties: true
         *     responses:
         *       201:
         *         description: Solution submitted successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message: { type: string, example: "Solution submitted successfully" }
         *                 attempt: { type: object }
         *                 score: { type: number, example: 85.5 }
         *       400:
         *         $ref: '#/components/responses/BadRequestError'
         *       401:
         *         $ref: '#/components/responses/UnauthorizedError'
         *       404:
         *         $ref: '#/components/responses/NotFoundError'
         */
        this.router.post('/submit', this.attemptsController.submitSolution);
        this.router.get('/problem/:competitionProblemId', this.attemptsController.getSubmissionsByProblem);
     }

    getRouter() {
        return this.router
    }
}

module.exports = AttemptsRoutes