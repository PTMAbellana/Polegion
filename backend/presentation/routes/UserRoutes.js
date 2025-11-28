const express = require('express')

class UserRoutes {
    constructor (userController, authMiddleware){
        this.userController = userController
        this.authMiddleware = authMiddleware
        this.router = express.Router()
        this.initializeRoutes()
    }
    
    initializeRoutes(){
        this.router.use(this.authMiddleware.protect)
        //  *   get:
        //  *     tags: [Users]
        //  *     summary: Get user profile
        //  *     description: Retrieve the current user's profile information
        //  *     security:
        //  *       - bearerAuth: []
        //  *     responses:
        //  *       200:
        //  *         description: Profile retrieved successfully
        //  *         content:
        //  *           application/json:
        //  *             schema:
        //  *               type: object
        //  *               properties:
        //  *                 message: { type: string, example: "Profile retrieved successfully" }
        //  *                 user: { type: object }
        //  *       401:
        //  *         $ref: '#/components/responses/UnauthorizedError'
        
        /**
         * @swagger
         * /users/profile:
         *   patch:
         *     tags: [Users]
         *     summary: Update user profile
         *     description: Update the current user's profile information
         *     security:
         *       - bearerAuth: []
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               firstName:
         *                 type: string
         *                 example: John
         *               lastName:
         *                 type: string
         *                 example: Doe
         *               gender:
         *                 type: string
         *                 example: Male
         *               phone:
         *                 type: string
         *                 example: 123-456-7890
         *     responses:
         *       200:
         *         description: Profile updated successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message: { type: string, example: "Profile updated successfully" }
         *                 user: { type: object }
         *       400:
         *         $ref: '#/components/responses/BadRequestError'
         *       401:
         *         $ref: '#/components/responses/UnauthorizedError'
         */
        this.router.route('/profile')
        .get(this.userController.getUserProfile)
        .patch(this.userController.updateUserProfile)
        
        /**
         * @swagger
         * /users/change-email:
         *   patch:
         *     tags: [Users]
         *     summary: Change user email
         *     description: Update the user's email address
         *     security:
         *       - bearerAuth: []
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required: [newEmail]
         *             properties:
         *               newEmail:
         *                 type: string
         *                 format: email
         *                 example: newemail@example.com
         *     responses:
         *       200:
         *         description: Email updated successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message: { type: string, example: "Email updated successfully" }
         *       400:
         *         $ref: '#/components/responses/BadRequestError'
         *       401:
         *         $ref: '#/components/responses/UnauthorizedError'
         */
        this.router.route('/change-email')
        .patch(this.userController.updateEmail)
        
        /**
         * @swagger
         * /users/change-password:
         *   patch:
         *     tags: [Users]
         *     summary: Change user password
         *     description: Update the user's password
         *     security:
         *       - bearerAuth: []
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required: [currentPassword, newPassword]
         *             properties:
         *               newPassword:
         *                 type: string
         *                 minLength: 6
         *                 example: newPassword456
         *     responses:
         *       200:
         *         description: Password updated successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message: { type: string, example: "Password updated successfully" }
         *       400:
         *         $ref: '#/components/responses/BadRequestError'
         *       401:
         *         $ref: '#/components/responses/UnauthorizedError'
         */
        this.router.route('/change-password')
        .patch(this.userController.updatePassword)

        /**
         * @swagger
         * /users/deactivate:
         *   patch:
         *     tags: [Users]
         *     summary: Deactivate user account
         *     description: Deactivate the current user's account
         *     security:
         *       - bearerAuth: []
         *     responses:
         *       200:
         *         description: Account deactivated successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message: { type: string, example: "Account deactivated successfully" }
         *       401:
         *         $ref: '#/components/responses/UnauthorizedError'
         */
        this.router.route('/deactivate')
        .patch(this.authMiddleware.protect, this.userController.deactivateAccount)

        /**
         * @swagger
         * /users/upload-profile-image:
         *   post:
         *     tags: [Users]
         *     summary: Upload profile image
         *     description: Upload a new profile image for the user
         *     security:
         *       - bearerAuth: []
         *     requestBody:
         *       required: true
         *       content:
         *         multipart/form-data:
         *           schema:
         *             type: object
         *             required: [image]
         *             properties:
         *               image:
         *                 type: string
         *                 format: binary
         *                 description: Profile image file (JPEG, PNG, etc.)
         *     responses:
         *       200:
         *         description: Profile image uploaded successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message: { type: string, example: "Profile image uploaded successfully" }
         *                 imageUrl: { type: string, example: "https://example.com/image.jpg" }
         *                 fileName: { type: string, example: "image.jpg" }
         *       400:
         *         $ref: '#/components/responses/BadRequestError'
         *       401:
         *         $ref: '#/components/responses/UnauthorizedError'
         */
        this.router.route('/upload-profile-image')
        .post(
            this.userController.getUploadMiddleware(),
            this.userController.uploadProfileImage,
        )

        /**
         * @swagger
         * /users/{userId}/progress:
         *   get:
         *     tags: [Users]
         *     summary: Get student progress
         *     description: Get complete student progress including castle and competition data
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: userId
         *         required: true
         *         schema:
         *           type: string
         *         description: User ID
         *     responses:
         *       200:
         *         description: Student progress retrieved successfully
         *       404:
         *         description: Student not found
         */
        this.router.get('/:userId/progress', this.userController.getStudentProgress.bind(this.userController))

        /**
         * @swagger
         * /users/{userId}/castle-progress:
         *   get:
         *     tags: [Users]
         *     summary: Get student castle progress
         *     description: Get student's worldmap/castle progress details
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: userId
         *         required: true
         *         schema:
         *           type: string
         *         description: User ID
         *     responses:
         *       200:
         *         description: Castle progress retrieved successfully
         *       404:
         *         description: Student not found
         */
        this.router.get('/:userId/castle-progress', this.userController.getUserCastleProgress.bind(this.userController))

        /**
         * @swagger
         * /users/{userId}/assessment-scores:
         *   get:
         *     tags: [Users]
         *     summary: Get student assessment scores
         *     description: Get student's pretest and posttest scores
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: userId
         *         required: true
         *         schema:
         *           type: string
         *         description: User ID
         *     responses:
         *       200:
         *         description: Assessment scores retrieved successfully
         *       404:
         *         description: Student not found
         */
        this.router.get('/:userId/assessment-scores', this.userController.getUserAssessmentScores.bind(this.userController))
    }

    getRouter(){
        return this.router
    }
}

module.exports = UserRoutes