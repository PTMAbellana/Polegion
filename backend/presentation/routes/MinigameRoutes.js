const express = require('express');

/**
 * @swagger
 * tags:
 *   name: Minigames
 *   description: Minigame management
 */
class MinigameRoutes {
    constructor(minigameController, authMiddleware) {
        this.minigameController = minigameController;
        this.authMiddleware = authMiddleware;
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.use(this.authMiddleware.protect);

        /**
         * @swagger
         * /minigames:
         *   post:
         *     tags: [Minigames]
         *     summary: Create a new minigame
         */
        this.router.post('/', this.minigameController.create.bind(this.minigameController));

        /**
         * @swagger
         * /minigames:
         *   get:
         *     tags: [Minigames]
         *     summary: Get all minigames
         */
        this.router.get('/', this.minigameController.getAll.bind(this.minigameController));

        /**
         * @swagger
         * /minigames/chapter/{chapterId}:
         *   get:
         *     tags: [Minigames]
         *     summary: Get all minigames for a specific chapter
         */
        this.router.get('/chapter/:chapterId', this.minigameController.getByChapterId.bind(this.minigameController));

        /**
         * @swagger
         * /minigames/{id}:
         *   get:
         *     tags: [Minigames]
         *     summary: Get a minigame by ID
         */
        this.router.get('/:id', this.minigameController.getById.bind(this.minigameController));

        /**
         * @swagger
         * /minigames/{id}:
         *   put:
         *     tags: [Minigames]
         *     summary: Update a minigame
         */
        this.router.put('/:id', this.minigameController.update.bind(this.minigameController));

        /**
         * @swagger
         * /minigames/{id}:
         *   delete:
         *     tags: [Minigames]
         *     summary: Delete a minigame
         */
        this.router.delete('/:id', this.minigameController.delete.bind(this.minigameController));
    }

    getRouter() {
        return this.router;
    }
}

module.exports = MinigameRoutes;