const express = require('express');

/**
 * @swagger
 * tags:
 *   name: UserChapterProgress
 *   description: User Chapter Progress management
 */
class UserChapterProgressRoutes {
    constructor(userChapterProgressController, authMiddleware) {
        this.userChapterProgressController = userChapterProgressController;
        this.authMiddleware = authMiddleware;
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.use(this.authMiddleware.protect);

        /**
         * @swagger
         * /user-chapter-progress:
         *   post:
         *     tags: [UserChapterProgress]
         *     summary: Create user chapter progress
         */
        this.router.post('/', this.userChapterProgressController.create.bind(this.userChapterProgressController));

        /**
         * @swagger
         * /user-chapter-progress:
         *   get:
         *     tags: [UserChapterProgress]
         *     summary: Get all user chapter progress
         */
        this.router.get('/', this.userChapterProgressController.getAll.bind(this.userChapterProgressController));

        /**
         * @swagger
         * /user-chapter-progress/{chapterId}/award-xp:
         *   post:
         *     tags: [UserChapterProgress]
         *     summary: Award XP for completing chapter lessons
         */
        this.router.post('/:chapterId/award-xp', this.userChapterProgressController.awardXP.bind(this.userChapterProgressController));

        /**
         * @swagger
         * /user-chapter-progress/{chapterId}/complete:
         *   post:
         *     tags: [UserChapterProgress]
         *     summary: Mark chapter as completed
         */
        this.router.post('/:chapterId/complete', this.userChapterProgressController.markCompleted.bind(this.userChapterProgressController));

        /**
         * @swagger
         * /user-chapter-progress/{id}:
         *   get:
         *     tags: [UserChapterProgress]
         *     summary: Get user chapter progress by ID
         */
        this.router.get('/:id', this.userChapterProgressController.getById.bind(this.userChapterProgressController));

        /**
         * @swagger
         * /user-chapter-progress/{id}:
         *   put:
         *     tags: [UserChapterProgress]
         *     summary: Update user chapter progress
         */
        this.router.put('/:id', this.userChapterProgressController.update.bind(this.userChapterProgressController));

        /**
         * @swagger
         * /user-chapter-progress/{id}:
         *   delete:
         *     tags: [UserChapterProgress]
         *     summary: Delete user chapter progress
         */
        this.router.delete('/:id', this.userChapterProgressController.delete.bind(this.userChapterProgressController));
    }

    getRouter() {
        return this.router;
    }
}

module.exports = UserChapterProgressRoutes;