const express = require('express');

/**
 * @swagger
 * tags:
 *   name: ChapterQuizzes
 *   description: Chapter Quiz management
 */
class ChapterQuizRoutes {
    constructor(chapterQuizController, authMiddleware) {
        this.chapterQuizController = chapterQuizController;
        this.authMiddleware = authMiddleware;
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.use(this.authMiddleware.protect);

        /**
         * @swagger
         * /chapter-quizzes:
         *   post:
         *     tags: [ChapterQuizzes]
         *     summary: Create a new chapter quiz
         */
        this.router.post('/', this.chapterQuizController.create.bind(this.chapterQuizController));

        /**
         * @swagger
         * /chapter-quizzes:
         *   get:
         *     tags: [ChapterQuizzes]
         *     summary: Get all chapter quizzes
         */
        this.router.get('/', this.chapterQuizController.getAll.bind(this.chapterQuizController));

        /**
         * @swagger
         * /chapter-quizzes/chapter/{chapterId}:
         *   get:
         *     tags: [ChapterQuizzes]
         *     summary: Get all chapter quizzes for a specific chapter
         */
        this.router.get('/chapter/:chapterId', this.chapterQuizController.getByChapterId.bind(this.chapterQuizController));

        /**
         * @swagger
         * /chapter-quizzes/{id}:
         *   get:
         *     tags: [ChapterQuizzes]
         *     summary: Get a chapter quiz by ID
         */
        this.router.get('/:id', this.chapterQuizController.getById.bind(this.chapterQuizController));

        /**
         * @swagger
         * /chapter-quizzes/{id}:
         *   put:
         *     tags: [ChapterQuizzes]
         *     summary: Update a chapter quiz
         */
        this.router.put('/:id', this.chapterQuizController.update.bind(this.chapterQuizController));

        /**
         * @swagger
         * /chapter-quizzes/{id}:
         *   delete:
         *     tags: [ChapterQuizzes]
         *     summary: Delete a chapter quiz
         */
        this.router.delete('/:id', this.chapterQuizController.delete.bind(this.chapterQuizController));
    }

    getRouter() {
        return this.router;
    }
}

module.exports = ChapterQuizRoutes;