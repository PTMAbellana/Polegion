const express = require('express')

class ParticipantRoutes {
    constructor(participantController, authMiddleware) {
        this.participantController = participantController
        this.authMiddleware = authMiddleware
        this.router = express.Router()
        this.initializeRoutes()
    }

    initializeRoutes() {
        this.router.use(this.authMiddleware.protect)

        /**
         * @swagger
         * /participants/join:
         *   post:
         *     tags: [Participants]
         *     summary: Join a room
         *     description: Join a room using room code
         *     security:
         *       - bearerAuth: []
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required: [roomCode]
         *             properties:
         *               roomCode:
         *                 type: string
         *                 example: ROOM123
         *     responses:
         *       200:
         *         description: Successfully joined room
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message: { type: string, example: "Successfully joined room" }
         *                 participant: { type: object }
         *       400:
         *         $ref: '#/components/responses/BadRequestError'
         *       401:
         *         $ref: '#/components/responses/UnauthorizedError'
         *       404:
         *         $ref: '#/components/responses/NotFoundError'
         */
        this.router.post('/join', this.participantController.joinRoom)

        /**
         * @swagger
         * /participants/invite:
         *   post:
         *     tags: [Participants]
         *     summary: Invite user by email
         *     description: Send email invitation to join a room
         *     security:
         *       - bearerAuth: []
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required: [email, roomCode]
         *             properties:
         *               email:
         *                 type: string
         *                 format: email
         *                 example: friend@example.com
         *               roomCode:
         *                 type: string
         *                 example: ROOM123
         *               message:
         *                 type: string
         *                 example: Join my coding room!
         *     responses:
         *       200:
         *         description: Invitation sent successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message: { type: string, example: "Invitation sent successfully" }
         *       400:
         *         $ref: '#/components/responses/BadRequestError'
         *       401:
         *         $ref: '#/components/responses/UnauthorizedError'
         */
        this.router.post('/invite', this.participantController.inviteByEmail.bind(this.participantController));
        
        /**
         * @swagger
         * /participants/leave/{room_id}:
         *   delete:
         *     tags: [Participants]
         *     summary: Leave a room
         *     description: Leave a room that the user has joined
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
         *         description: Successfully left room
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message: { type: string, example: "Successfully left room" }
         *       401:
         *         $ref: '#/components/responses/UnauthorizedError'
         *       404:
         *         $ref: '#/components/responses/NotFoundError'
         */
        this.router.delete('/leave/:room_id', this.participantController.leaveRoom)

        /**
         * @swagger
         * /participants/room/{room_id}/participant/{user_id}:
         *   delete:
         *     tags: [Participants]
         *     summary: Remove participant from room
         *     description: Remove a specific participant from a room (admin only)
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
         *         name: user_id
         *         required: true
         *         schema:
         *           type: string
         *         description: User ID to remove
         *         example: user-uuid-456
         *     responses:
         *       200:
         *         description: Participant removed successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message: { type: string, example: "Participant removed successfully" }
         *       401:
         *         $ref: '#/components/responses/UnauthorizedError'
         *       403:
         *         $ref: '#/components/responses/ForbiddenError'
         *       404:
         *         $ref: '#/components/responses/NotFoundError'
         */
        this.router.delete('/room/:room_id/participant/:user_id', this.participantController.removeParticipant)
        
        /**
         * @swagger
         * /participants/status/{room_id}:
         *   get:
         *     tags: [Participants]
         *     summary: Check participant status
         *     description: Check if current user is a participant in the room
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
         *         description: Participant status retrieved
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message: { type: string, example: "Participant status retrieved" }
         *                 isParticipant: { type: boolean, example: true }
         *       401:
         *         $ref: '#/components/responses/UnauthorizedError'
         *       404:
         *         $ref: '#/components/responses/NotFoundError'
         */
        this.router.get('/status/:room_id', this.participantController.checkParticipantStatus)

        /**
         * @swagger
         * /participants/count/{room_id}:
         *   get:
         *     tags: [Participants]
         *     summary: Get room participant count
         *     description: Get the total number of participants in a room
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
         *         description: Participant count retrieved
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message: { type: string, example: "Participant count retrieved" }
         *                 count: { type: integer, example: 25 }
         *       401:
         *         $ref: '#/components/responses/UnauthorizedError'
         *       404:
         *         $ref: '#/components/responses/NotFoundError'
         */
        this.router.get('/count/:room_id', this.participantController.getRoomParticipantCount)

        /**
         * @swagger
         * /participants/creator/lists/{room_id}:
         *   get:
         *     tags: [Participants]
         *     summary: Get room participants (Admin view)
         *     description: Get list of all participants in a room (admin view with full details)
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
         *         description: Participants retrieved successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message: { type: string, example: "Participants retrieved successfully" }
         *                 participants: { type: array, items: { type: object } }
         *       401:
         *         $ref: '#/components/responses/UnauthorizedError'
         *       403:
         *         $ref: '#/components/responses/ForbiddenError'
         *       404:
         *         $ref: '#/components/responses/NotFoundError'
         */
        this.router.get('/creator/lists/:room_id', this.participantController.getRoomParticipantsAdmin)

        /**
         * @swagger
         * /participants/user/lists/{room_id}:
         *   get:
         *     tags: [Participants]
         *     summary: Get room participants (User view)
         *     description: Get list of participants in a room (user view with limited details)
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
         *         description: Participants retrieved successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message: { type: string, example: "Participants retrieved successfully" }
         *                 participants: { type: array, items: { type: object } }
         *       401:
         *         $ref: '#/components/responses/UnauthorizedError'
         *       404:
         *         $ref: '#/components/responses/NotFoundError'
         */
        this.router.get('/user/lists/:room_id', this.participantController.getRoomParticipantsUser)

        /**
         * @swagger
         * /participants/joined:
         *   get:
         *     tags: [Participants]
         *     summary: Get joined rooms
         *     description: Get list of all rooms the current user has joined
         *     security:
         *       - bearerAuth: []
         *     responses:
         *       200:
         *         description: Joined rooms retrieved successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message: { type: string, example: "Joined rooms retrieved successfully" }
         *                 rooms: { type: array, items: { type: object } }
         *       401:
         *         $ref: '#/components/responses/UnauthorizedError'
         */
        this.router.get('/joined', this.participantController.joinedRooms)
    }
    
    getRouter(){
        return this.router
    }
}

module.exports = ParticipantRoutes