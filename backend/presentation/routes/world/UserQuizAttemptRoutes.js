const express = require('express');

/**
 * @swagger
 * tags:
 *   name: UserQuizAttempts
 *   description: User Quiz Attempt management
 */
class UserQuizAttemptRoutes {
    constructor(userQuizAttemptController, authMiddleware) {
        this.userQuizAttemptController = userQuizAttemptController;
        this.authMiddleware = authMiddleware;
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.use(this.authMiddleware.protect);

        /**
         * @swagger
         * /user-quiz-attempts:
         *   post:
         *     tags: [UserQuizAttempts]
         *     summary: Create user quiz attempt
         */
        this.router.post('/', this.userQuizAttemptController.create.bind(this.userQuizAttemptController));

        /**
         * @swagger
         * /user-quiz-attempts:
         *   get:
         *     tags: [UserQuizAttempts]
         *     summary: Get all user quiz attempts
         */
        this.router.get('/', this.userQuizAttemptController.getAll.bind(this.userQuizAttemptController));

        /**
         * @swagger
         * /user-quiz-attempts/{id}:
         *   get:
         *     tags: [UserQuizAttempts]
         *     summary: Get user quiz attempt by ID
         */
        this.router.get('/:id', this.userQuizAttemptController.getById.bind(this.userQuizAttemptController));

        /**
         * @swagger
         * /user-quiz-attempts/{id}:
         *   put:
         *     tags: [UserQuizAttempts]
         *     summary: Update user quiz attempt
         */
        this.router.put('/:id', this.userQuizAttemptController.update.bind(this.userQuizAttemptController));

        /**
         * @swagger
         * /user-quiz-attempts/{id}:
         *   delete:
         *     tags: [UserQuizAttempts]
         *     summary: Delete user quiz attempt
         */
        this.router.delete('/:id', this.userQuizAttemptController.delete.bind(this.userQuizAttemptController));
    }

    getRouter() {
        return this.router;
    }
}

module.exports = UserQuizAttemptRoutes;