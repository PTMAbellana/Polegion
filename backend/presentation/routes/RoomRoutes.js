const express = require('express');

class RoomRoutes {

  constructor (roomController, authMiddleware) {
    this.roomController = roomController
    this.authMiddleware = authMiddleware
    this.router = express.Router()
    this.initializeRoutes()
  }
  
  initializeRoutes(){
    this.router.use(this.authMiddleware.protect); // All room routes require authentication
    
    /**
     * @swagger
     * /rooms/upload-banner:
     *   post:
     *     tags: [Rooms]
     *     summary: Upload room banner
     *     description: Upload a banner image for a room
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             required: [banner]
     *             properties:
     *               banner:
     *                 type: string
     *                 format: binary
     *                 description: Banner image file
     *     responses:
     *       200:
     *         description: Banner uploaded successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message: { type: string, example: "Banner uploaded successfully" }
     *                 bannerUrl: { type: string, example: "https://example.com/banner.jpg" }
     *       400:
     *         $ref: '#/components/responses/BadRequestError'
     *       401:
     *         $ref: '#/components/responses/UnauthorizedError'
     */
    this.router.post('/upload-banner',
      this.roomController.getUploadMiddleware(),
      this.roomController.uploadBannerImage
    )

    /**
     * @swagger
     * /rooms:
     *   get:
     *     tags: [Rooms]
     *     summary: Get all rooms
     *     description: Retrieve all rooms for the authenticated user
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Rooms retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message: { type: string, example: "Rooms retrieved successfully" }
     *                 rooms: { type: array, items: { type: object } }
     *       401:
     *         $ref: '#/components/responses/UnauthorizedError'
     *   post:
     *     tags: [Rooms]
     *     summary: Create a new room
     *     description: Create a new virtual room for competitions
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [name]
     *             properties:
     *               name:
     *                 type: string
     *                 example: Algorithm Practice Room
     *               description:
     *                 type: string
     *                 example: A room for practicing data structures and algorithms
     *               maxUsers:
     *                 type: integer
     *                 example: 50
     *                 minimum: 1
     *                 maximum: 1000
     *     responses:
     *       201:
     *         description: Room created successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message: { type: string, example: "Room created successfully" }
     *                 room: { type: object }
     *       400:
     *         $ref: '#/components/responses/BadRequestError'
     *       401:
     *         $ref: '#/components/responses/UnauthorizedError'
     */
    this.router.route('/')
        .get(this.roomController.getRooms)
        .post(this.roomController.createRoom);
    
    /**
     * @swagger
     * /rooms/id/{id}:
     *   get:
     *     tags: [Rooms]
     *     summary: Get room by ID
     *     description: Retrieve a specific room by its ID
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Room ID
     *         example: room-uuid-123
     *     responses:
     *       200:
     *         description: Room retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message: { type: string, example: "Room retrieved successfully" }
     *                 room: { type: object }
     *       404:
     *         $ref: '#/components/responses/NotFoundError'
     *       401:
     *         $ref: '#/components/responses/UnauthorizedError'
     *   put:
     *     tags: [Rooms]
     *     summary: Update room
     *     description: Update room information
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Room ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *                 example: Updated Room Name
     *               description:
     *                 type: string
     *                 example: Updated description
     *               maxUsers:
     *                 type: integer
     *                 example: 100
     *     responses:
     *       200:
     *         description: Room updated successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message: { type: string, example: "Room updated successfully" }
     *                 room: { type: object }
     *       400:
     *         $ref: '#/components/responses/BadRequestError'
     *       404:
     *         $ref: '#/components/responses/NotFoundError'
     *       401:
     *         $ref: '#/components/responses/UnauthorizedError'
     *   delete:
     *     tags: [Rooms]
     *     summary: Delete room
     *     description: Delete a room
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Room ID
     *     responses:
     *       200:
     *         description: Room deleted successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message: { type: string, example: "Room deleted successfully" }
     *       404: 
     *         $ref: '#/components/responses/NotFoundError'
     *       401:
     *         $ref: '#/components/responses/UnauthorizedError'
     */
    this.router.route('/id/:id')
        .get(this.roomController.getRoomById)
        .put(this.roomController.updateRoom)
        .delete(this.roomController.deleteRoom);
    
    /**
     * @swagger
     * /rooms/admin/code/{code}:
     *   get:
     *     tags: [Rooms]
     *     summary: Get room by code (Admin)
     *     description: Retrieve room information by room code (admin view)
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: code
     *         required: true
     *         schema:
     *           type: string
     *         description: Room code
     *         example: ROOM123
     *     responses:
     *       200:
     *         description: Room retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message: { type: string, example: "Room retrieved successfully" }
     *                 room: { type: object }
     *       404:
     *         $ref: '#/components/responses/NotFoundError'
     *       401:
     *         $ref: '#/components/responses/UnauthorizedError'
     */
    this.router.route('/admin/code/:code')
      .get(this.roomController.getRoomByCode)
    
    /**
     * @swagger
     * /rooms/user/code/{code}:
     *   get:
     *     tags: [Rooms]
     *     summary: Get room by code (User)
     *     description: Retrieve room information by room code (user view)
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: code
     *         required: true
     *         schema:
     *           type: string
     *         description: Room code
     *         example: ROOM123
     *     responses:
     *       200:
     *         description: Room retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message: { type: string, example: "Room retrieved successfully" }
     *                 room: { type: object }
     *       404:
     *         $ref: '#/components/responses/NotFoundError'
     *       401:
     *         $ref: '#/components/responses/UnauthorizedError'
     */
    this.router.route('/user/code/:code')
      .get(this.roomController.getRoomByCodeUsers)

    /**
     * @swagger
     * /rooms/change-visibility:
     *   put:
     *     tags: [Rooms]
     *     summary: Change room visibility
     *     description: Toggle room visibility (public/private)
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [roomId, isVisible]
     *             properties:
     *               roomId:
     *                 type: string
     *                 example: room-uuid-123
     *               isVisible:
     *                 type: boolean
     *                 example: true
     *     responses:
     *       200:
     *         description: Room visibility updated successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message: { type: string, example: "Room visibility updated successfully" }
     *                 room: { type: object }
     *       400:
     *         $ref: '#/components/responses/BadRequestError'
     *       404:
     *         $ref: '#/components/responses/NotFoundError'
     *       401:
     *         $ref: '#/components/responses/UnauthorizedError'
     */
    this.router.route('/change-visibility')
      .put(this.roomController.changeVisibility)
  }

  getRouter(){
    return this.router
  }
  
}


module.exports = RoomRoutes