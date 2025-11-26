const express = require('express');

/**
 * @swagger
 * tags:
 *   name: Chapters
 *   description: Chapter management
 */
class ChapterRoutes {
    constructor(chapterController, authMiddleware) {
        this.chapterController = chapterController;
        this.authMiddleware = authMiddleware;
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.use(this.authMiddleware.protect);

        /**
         * @swagger
         * /chapters:
         *   post:
         *     tags: [Chapters]
         *     summary: Create a new chapter
         */
        this.router.post('/', this.chapterController.create.bind(this.chapterController));

        /**
         * @swagger
         * /chapters:
         *   get:
         *     tags: [Chapters]
         *     summary: Get all chapters
         */
        this.router.get('/', this.chapterController.getAll.bind(this.chapterController));

        /**
         * @swagger
         * /chapters/castle/{castleId}:
         *   get:
         *     tags: [Chapters]
         *     summary: Get chapters by castle ID
         */
        this.router.get('/castle/:castleId', this.chapterController.getByCastleId.bind(this.chapterController));

        /**
         * @swagger
         * /chapters/{id}:
         *   get:
         *     tags: [Chapters]
         *     summary: Get a chapter by ID
         */
        this.router.get('/:id', this.chapterController.getById.bind(this.chapterController));

        /**
         * @swagger
         * /chapters/{id}:
         *   put:
         *     tags: [Chapters]
         *     summary: Update a chapter
         */
        this.router.put('/:id', this.chapterController.update.bind(this.chapterController));

        /**
         * @swagger
         * /chapters/{id}:
         *   delete:
         *     tags: [Chapters]
         *     summary: Delete a chapter
         */
        this.router.delete('/:id', this.chapterController.delete.bind(this.chapterController));
    }

    getRouter() {
        return this.router;
    }
}

module.exports = ChapterRoutes;