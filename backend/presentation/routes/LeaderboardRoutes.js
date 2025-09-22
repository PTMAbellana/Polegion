const express = require('express');

class LeaderboardRoutes {

    constructor (leaderController, authMiddleware) {
        this.leaderController = leaderController
        this.authMiddleware = authMiddleware
        this.router = express.Router()
        this.initializeRoutes()
    }
  
    initializeRoutes(){
        this.router.use(this.authMiddleware.protect); // All leaderboard routes require authentication
    
        /**
         * @swagger
         * /leaderboards/room/{room_id}:
         *   get:
         *     tags: [Leaderboards]
         *     summary: Get room leaderboard
         *     description: Retrieve leaderboard for a specific room showing user rankings
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
         *         description: Room leaderboard retrieved successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message: { type: string, example: "Room leaderboard retrieved successfully" }
         *                 leaderboard: 
         *                   type: array
         *                   items:
         *                     type: object
         *                     properties:
         *                       rank: { type: integer, example: 1 }
         *                       username: { type: string, example: "john_doe" }
         *                       score: { type: number, example: 1250.5 }
         *                       problemsSolved: { type: integer, example: 15 }
         *       401:
         *         $ref: '#/components/responses/UnauthorizedError'
         *       404:
         *         $ref: '#/components/responses/NotFoundError'
         */
        this.router.get('/room/:room_id', this.leaderController.getRoomBoard)

        /**
         * @swagger
         * /leaderboards/competition/{room_id}:
         *   get:
         *     tags: [Leaderboards]
         *     summary: Get competition leaderboard
         *     description: Retrieve leaderboard for competitions in a specific room
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
         *         description: Competition leaderboard retrieved successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message: { type: string, example: "Competition leaderboard retrieved successfully" }
         *                 leaderboard:
         *                   type: array
         *                   items:
         *                     type: object
         *                     properties:
         *                       rank: { type: integer, example: 1 }
         *                       username: { type: string, example: "jane_smith" }
         *                       totalScore: { type: number, example: 2150.0 }
         *                       competitionsWon: { type: integer, example: 3 }
         *                       averageScore: { type: number, example: 716.67 }
         *       401:
         *         $ref: '#/components/responses/UnauthorizedError'
         *       404:
         *         $ref: '#/components/responses/NotFoundError'
         */
        this.router.get('/competition/:room_id', this.leaderController.getCompeBoard)
    }
    
    getRouter(){
        return this.router
    }
}

module.exports = LeaderboardRoutes