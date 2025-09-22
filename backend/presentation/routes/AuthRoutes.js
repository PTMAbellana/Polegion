const express = require('express')

class AuthRoutes {
    constructor(authController){
        this.authController = authController
        this.router = express.Router()
        this.initializeRoutes()
    }    
    
    initializeRoutes(){
        /**
         * @swagger
         * /auth/login:
         *   post:
         *     tags: [Authentication]
         *     summary: User login
         *     description: Authenticate user with email and password using Supabase
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required: [email, password]
         *             properties:
         *               email:
         *                 type: string
         *                 format: email
         *                 example: john.doe@example.com
         *               password:
         *                 type: string
         *                 minLength: 6
         *                 example: password123
         *     responses:
         *       200:
         *         description: Login successful
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message: { type: string, example: "Login successful" }
         *                 user: { type: object }
         *                 session: { type: object }
         *       400:
         *         $ref: '#/components/responses/BadRequestError'
         *       401:
         *         $ref: '#/components/responses/UnauthorizedError'
         */
        this.router.post('/login', this.authController.loginUser)

        /**
         * @swagger
         * /auth/register:
         *   post:
         *     tags: [Authentication]
         *     summary: User registration
         *     description: Register a new user with Supabase authentication
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required: [email, password, username]
         *             properties:
         *               email:
         *                 type: string
         *                 format: email
         *                 example: jane.smith@example.com
         *               password:
         *                 type: string
         *                 minLength: 6
         *                 example: securePassword456
         *               username:
         *                 type: string
         *                 example: jane_smith
         *               firstName:
         *                 type: string
         *                 example: Jane
         *               lastName:
         *                 type: string
         *                 example: Smith
         *     responses:
         *       201:
         *         description: Registration successful
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message: { type: string, example: "Registration successful" }
         *                 user: { type: object }
         *       400:
         *         $ref: '#/components/responses/BadRequestError'
         *       409:
         *         description: User already exists
         */
        this.router.post('/register', this.authController.registerUser)

        /**
         * @swagger
         * /auth/reset-password:
         *   post:
         *     tags: [Authentication]  
         *     summary: Request password reset
         *     description: Send password reset email to user
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required: [email]
         *             properties:
         *               email:
         *                 type: string
         *                 format: email
         *                 example: user@example.com
         *     responses:
         *       200:
         *         description: Reset email sent
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message: { type: string, example: "Password reset email sent" }
         *       400:
         *         $ref: '#/components/responses/BadRequestError'
         */
        this.router.post('/reset-password', this.authController.resetPassword)

        /**
         * @swagger
         * /auth/logout:
         *   post:
         *     tags: [Authentication]
         *     summary: User logout
         *     description: Logout user and invalidate session
         *     security:
         *       - bearerAuth: []
         *     responses:
         *       200:
         *         description: Logout successful
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message: { type: string, example: "Logout successful" }
         *       401:
         *         $ref: '#/components/responses/UnauthorizedError'
         */
        this.router.post('/logout', this.authController.logout)

        /**
         * @swagger
         * /auth/refresh-token:
         *   post:
         *     tags: [Authentication]
         *     summary: Refresh access token
         *     description: Get new access token using refresh token
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required: [refreshToken]
         *             properties:
         *               refreshToken:
         *                 type: string
         *                 example: your_refresh_token_here
         *     responses:
         *       200:
         *         description: Token refreshed successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message: { type: string, example: "Token refreshed" }
         *                 session: { type: object }
         *       400:
         *         $ref: '#/components/responses/BadRequestError'
         *       401:
         *         $ref: '#/components/responses/UnauthorizedError'
         */
        this.router.post('/refresh-token', this.authController.refreshToken)

        /**
         * @swagger
         * /auth/reset-password/confirm:
         *   post:
         *     tags: [Authentication]
         *     summary: Confirm password reset
         *     description: Complete password reset with token
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required: [token, password]
         *             properties:
         *               token:
         *                 type: string
         *                 example: reset-token-123
         *               password:
         *                 type: string
         *                 minLength: 6
         *                 example: newPassword123
         *     responses:
         *       200:
         *         description: Password reset successful
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message: { type: string, example: "Password reset successful" }
         *       400:
         *         $ref: '#/components/responses/BadRequestError'
         */
        this.router.post('/reset-password/confirm', this.authController.resetPasswordConfirm)
    }

    getRouter() {
        return this.router
    }
    
}


module.exports = AuthRoutes