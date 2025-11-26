const express = require('express');

/**
 * @swagger
 * tags:
 *   name: Castles
 *   description: Castle management
 */
class CastleRoutes {
    constructor(castleController, authMiddleware) {
        this.castleController = castleController;
        this.authMiddleware = authMiddleware;
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.use(this.authMiddleware.protect);

        /**
         * @swagger
         * /castles/initialize:
         *   post:
         *     tags: [Castles]
         *     summary: Initialize user progress for a castle
         */
        this.router.post('/initialize', this.castleController.initializeProgress.bind(this.castleController));

        /**
         * @swagger
         * /castles/seed-chapter:
         *   post:
         *     tags: [Castles]
         *     summary: Manually seed quiz and minigame data for a specific chapter
         */
        this.router.post('/seed-chapter', this.castleController.seedChapter.bind(this.castleController));

        /**
         * @swagger
         * /castles:
         *   post:
         *     tags: [Castles]
         *     summary: Create a new castle
         */
        this.router.post('/', this.castleController.create.bind(this.castleController));

        /**
         * @swagger
         * /castles:
         *   get:
         *     tags: [Castles]
         *     summary: Get all castles
         */
        this.router.get('/', this.castleController.getAll.bind(this.castleController));

        /**
         * @swagger
         * /castles/{id}:
         *   get:
         *     tags: [Castles]
         *     summary: Get a castle by ID
         */
        this.router.get('/:id', this.castleController.getById.bind(this.castleController));

        /**
         * @swagger
         * /castles/{id}:
         *   put:
         *     tags: [Castles]
         *     summary: Update a castle
         */
        this.router.put('/:id', this.castleController.update.bind(this.castleController));

        /**
         * @swagger
         * /castles/{id}:
         *   delete:
         *     tags: [Castles]
         *     summary: Delete a castle
         */
        this.router.delete('/:id', this.castleController.delete.bind(this.castleController));
    }

    getRouter() {
        return this.router;
    }
}

module.exports = CastleRoutes;