const express = require('express');

/**
 * @swagger
 * tags:
 *   name: UserCastleProgress
 *   description: User Castle Progress management
 */
class UserCastleProgressRoutes {
    constructor(userCastleProgressController, authMiddleware) {
        this.userCastleProgressController = userCastleProgressController;
        this.authMiddleware = authMiddleware;
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.use(this.authMiddleware.protect);

        /**
         * @swagger
         * /user-castle-progress:
         *   post:
         *     tags: [UserCastleProgress]
         *     summary: Create user castle progress
         */
        this.router.post('/', this.userCastleProgressController.create.bind(this.userCastleProgressController));

        /**
         * @swagger
         * /user-castle-progress:
         *   get:
         *     tags: [UserCastleProgress]
         *     summary: Get all user castle progress
         */
        this.router.get('/', this.userCastleProgressController.getAll.bind(this.userCastleProgressController));

        /**
         * @swagger
         * /user-castle-progress/{id}:
         *   get:
         *     tags: [UserCastleProgress]
         *     summary: Get user castle progress by ID
         */
        this.router.get('/:id', this.userCastleProgressController.getById.bind(this.userCastleProgressController));

        /**
         * @swagger
         * /user-castle-progress/{id}:
         *   put:
         *     tags: [UserCastleProgress]
         *     summary: Update user castle progress
         */
        this.router.put('/:id', this.userCastleProgressController.update.bind(this.userCastleProgressController));

        /**
         * @swagger
         * /user-castle-progress/{id}:
         *   delete:
         *     tags: [UserCastleProgress]
         *     summary: Delete user castle progress
         */
        this.router.delete('/:id', this.userCastleProgressController.delete.bind(this.userCastleProgressController));
    }

    getRouter() {
        return this.router;
    }
}

module.exports = UserCastleProgressRoutes;