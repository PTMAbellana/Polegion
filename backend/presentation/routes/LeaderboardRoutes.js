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

        /**
         * @swagger
         * /leaderboards/room/{room_id}/export-csv:
         *   get:
         *     tags: [Leaderboards]
         *     summary: Download room records as CSV
         *     description: Export all student records for a room as CSV file. Includes room name and all student data.
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: room_id
         *         required: true
         *         schema:
         *           type: integer
         *         description: Room ID
         *         example: 51
         *     responses:
         *       200:
         *         description: CSV file generated and downloaded successfully
         *         content:
         *           text/csv:
         *             schema:
         *               type: string
         *               example: |
         *                 Room: Computer Science 101
         *                 First Name,Last Name,XP
         *                 "John","Doe","5432"
         *                 "Jane","Smith","2150"
         *                 "Bob","Johnson","1800"
         *             headers:
         *               Content-Disposition:
         *                 schema:
         *                   type: string
         *                   example: attachment; filename="room-51-records-2025-10-20.csv"
         *       401:
         *         description: Unauthorized - Invalid or missing authentication token
         *       404:
         *         description: Room not found or user not authorized
         *       500:
         *         description: Failed to generate CSV export
         */
        this.router.get('/room/:room_id/export-csv', this.leaderController.downloadRoomRecordsCSV)

    /**
     * @swagger
     * /leaderboards/room/{room_id}/competition/{competition_id}/export-csv:
     *   get:
     *     tags:
     *       - Leaderboards
     *     summary: Download competition records as CSV
     *     description: Export all student records for a specific competition within a room as CSV file
     *     parameters:
     *       - in: path
     *         name: room_id
     *         required: true
     *         schema:
     *           type: integer
     *         description: Room ID
     *       - in: path
     *         name: competition_id
     *         required: true
     *         schema:
     *           type: integer
     *         description: Competition ID
     *     security:
     *       - BearerAuth: []
     *     responses:
     *       200:
     *         description: CSV file download
     *         content:
     *           text/csv:
     *             schema:
     *               type: string
     *               example: |
     *                 Competition: Midterm Challenge
     *                 First Name,Last Name,XP
     *                 "Alice","Williams","5432"
     *                 "Charlie","Brown","3200"
     *       404:
     *         description: Competition not found
     *       500:
     *         description: Server error
     */
        this.router.get('/room/:room_id/competition/:competition_id/export-csv', this.leaderController.downloadCompetitionRecordsCSV)
    }
    
    getRouter(){
        return this.router
    }
}

module.exports = LeaderboardRoutes