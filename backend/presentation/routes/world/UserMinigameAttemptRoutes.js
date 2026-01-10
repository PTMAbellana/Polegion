const express = require('express');

/**
 * @swagger
 * tags:
 *   name: UserMinigameAttempts
 *   description: User Minigame Attempt management
 */
class UserMinigameAttemptRoutes {
    constructor(userMinigameAttemptController, authMiddleware) {
        this.userMinigameAttemptController = userMinigameAttemptController;
        this.authMiddleware = authMiddleware;
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.use(this.authMiddleware.protect);

        /**
         * @swagger
         * /user-minigame-attempts:
         *   post:
         *     tags: [UserMinigameAttempts]
         *     summary: Create user minigame attempt
         */
        this.router.post('/', this.userMinigameAttemptController.create.bind(this.userMinigameAttemptController));

        /**
         * @swagger
         * /user-minigame-attempts:
         *   get:
         *     tags: [UserMinigameAttempts]
         *     summary: Get all user minigame attempts
         */
        this.router.get('/', this.userMinigameAttemptController.getAll.bind(this.userMinigameAttemptController));

        /**
         * @swagger
         * /user-minigame-attempts/{id}:
         *   get:
         *     tags: [UserMinigameAttempts]
         *     summary: Get user minigame attempt by ID
         */
        this.router.get('/:id', this.userMinigameAttemptController.getById.bind(this.userMinigameAttemptController));

        /**
         * @swagger
         * /user-minigame-attempts/{id}:
         *   put:
         *     tags: [UserMinigameAttempts]
         *     summary: Update user minigame attempt
         */
        this.router.put('/:id', this.userMinigameAttemptController.update.bind(this.userMinigameAttemptController));

        /**
         * @swagger
         * /user-minigame-attempts/{id}:
         *   delete:
         *     tags: [UserMinigameAttempts]
         *     summary: Delete user minigame attempt
         */
        this.router.delete('/:id', this.userMinigameAttemptController.delete.bind(this.userMinigameAttemptController));
    }

    getRouter() {
        return this.router;
    }
}

module.exports = UserMinigameAttemptRoutes;