const express = require('express');

class CompeRoutes {

    constructor (compeController, authMiddleware) {
        this.compeController = compeController
        this.authMiddleware = authMiddleware
        this.router = express.Router()
        this.initializeRoutes()
    }

    initializeRoutes(){
        this.router.use(this.authMiddleware.protect);

        /**
         * @swagger
         * /competitions:
         *   post:
         *     tags: [Competitions]
         *     summary: Create a new competition
         *     description: Create a new competition in a room
         *     security:
         *       - bearerAuth: []
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required: [name, roomId]
         *             properties:
         *               name:
         *                 type: string
         *                 example: Weekly Coding Challenge
         *               description:
         *                 type: string
         *                 example: Weekly competitive programming challenge
         *               roomId:
         *                 type: string
         *                 example: room-uuid-123
         *               duration:
         *                 type: integer
         *                 example: 3600
         *                 description: Competition duration in seconds
         *               autoStart:
         *                 type: boolean
         *                 example: false
         *                 description: Whether to start automatically
         *     responses:
         *       201:
         *         description: Competition created successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message: { type: string, example: "Competition created successfully" }
         *                 competition: { type: object }
         *       400:
         *         $ref: '#/components/responses/BadRequestError'
         *       401:
         *         $ref: '#/components/responses/UnauthorizedError'
         */
        this.router.post('/', this.compeController.addCompe);

        /**
         * @swagger
         * /competitions/{room_id}:
         *   get:
         *     tags: [Competitions]
         *     summary: Get all competitions in room
         *     description: Retrieve all competitions in a specific room
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
         *         description: Competitions retrieved successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message: { type: string, example: "Competitions retrieved successfully" }
         *                 competitions: { type: array, items: { type: object } }
         *       401:
         *         $ref: '#/components/responses/UnauthorizedError'
         *       404:
         *         $ref: '#/components/responses/NotFoundError'
         */
        this.router.get('/:room_id', this.compeController.getAllCompe);

        /**
         * @swagger
         * /competitions/{room_id}/{compe_id}:
         *   get:
         *     tags: [Competitions]
         *     summary: Get specific competition
         *     description: Retrieve details of a specific competition
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
         *       - in: path
         *         name: compe_id
         *         required: true
         *         schema:
         *           type: string
         *         description: Competition ID
         *         example: compe-uuid-456
         *     responses:
         *       200:
         *         description: Competition retrieved successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message: { type: string, example: "Competition retrieved successfully" }
         *                 competition: { type: object }
         *       401:
         *         $ref: '#/components/responses/UnauthorizedError'
         *       404:
         *         $ref: '#/components/responses/NotFoundError'
         */
        this.router.get('/:room_id/:compe_id', this.compeController.getCompeById);
        
        /**
         * @swagger
         * /competitions/{compe_id}/start:
         *   post:
         *     tags: [Competitions]
         *     summary: Start competition
         *     description: Start a competition and begin the timer
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: compe_id
         *         required: true
         *         schema:
         *           type: string
         *         description: Competition ID
         *         example: compe-uuid-123
         *     responses:
         *       200:
         *         description: Competition started successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message: { type: string, example: "Competition started successfully" }
         *                 competition: { type: object }
         *       400:
         *         $ref: '#/components/responses/BadRequestError'
         *       401:
         *         $ref: '#/components/responses/UnauthorizedError'
         *       404:
         *         $ref: '#/components/responses/NotFoundError'
         */
        this.router.post('/:compe_id/start', this.compeController.startCompe);

        /**
         * @swagger
         * /competitions/{compe_id}/next:
         *   patch:
         *     tags: [Competitions]
         *     summary: Move to next problem
         *     description: Advance competition to the next problem
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: compe_id
         *         required: true
         *         schema:
         *           type: string
         *         description: Competition ID
         *         example: compe-uuid-123
         *     responses:
         *       200:
         *         description: Moved to next problem successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message: { type: string, example: "Moved to next problem successfully" }
         *                 competition: { type: object }
         *       400:
         *         $ref: '#/components/responses/BadRequestError'
         *       401:
         *         $ref: '#/components/responses/UnauthorizedError'
         *       404:
         *         $ref: '#/components/responses/NotFoundError'
         */
        this.router.patch('/:compe_id/next', this.compeController.nextProblem);

        /**
         * @swagger
         * /competitions/{compe_id}/pause:
         *   patch:
         *     tags: [Competitions]
         *     summary: Pause competition
         *     description: Pause the current competition timer
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: compe_id
         *         required: true
         *         schema:
         *           type: string
         *         description: Competition ID
         *         example: compe-uuid-123
         *     responses:
         *       200:
         *         description: Competition paused successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message: { type: string, example: "Competition paused successfully" }
         *                 competition: { type: object }
         *       400:
         *         $ref: '#/components/responses/BadRequestError'
         *       401:
         *         $ref: '#/components/responses/UnauthorizedError'
         *       404:
         *         $ref: '#/components/responses/NotFoundError'
         */
        this.router.patch('/:compe_id/pause', this.compeController.pauseCompe);

        /**
         * @swagger
         * /competitions/{compe_id}/resume:
         *   patch:
         *     tags: [Competitions]
         *     summary: Resume competition
         *     description: Resume a paused competition
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: compe_id
         *         required: true
         *         schema:
         *           type: string
         *         description: Competition ID
         *         example: compe-uuid-123
         *     responses:
         *       200:
         *         description: Competition resumed successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message: { type: string, example: "Competition resumed successfully" }
         *                 competition: { type: object }
         *       400:
         *         $ref: '#/components/responses/BadRequestError'
         *       401:
         *         $ref: '#/components/responses/UnauthorizedError'
         *       404:
         *         $ref: '#/components/responses/NotFoundError'
         */
        this.router.patch('/:compe_id/resume', this.compeController.resumeCompe);

        /**
         * @swagger
         * /competitions/{compe_id}/auto-advance:
         *   post:
         *     tags: [Competitions]
         *     summary: Enable/disable auto-advance
         *     description: Configure automatic advancement to next problem
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: compe_id
         *         required: true
         *         schema:
         *           type: string
         *         description: Competition ID
         *         example: compe-uuid-123
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required: [enabled]
         *             properties:
         *               enabled:
         *                 type: boolean
         *                 example: true
         *               interval:
         *                 type: integer
         *                 example: 300
         *                 description: Auto-advance interval in seconds
         *     responses:
         *       200:
         *         description: Auto-advance configured successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message: { type: string, example: "Auto-advance configured successfully" }
         *                 competition: { type: object }
         *       400:
         *         $ref: '#/components/responses/BadRequestError'
         *       401:
         *         $ref: '#/components/responses/UnauthorizedError'
         *       404:
         *         $ref: '#/components/responses/NotFoundError'
         */
        this.router.post('/:compe_id/auto-advance', this.compeController.autoAdvanceCompe);
     }

    getRouter() {
        return this.router
    }
}

module.exports = CompeRoutes