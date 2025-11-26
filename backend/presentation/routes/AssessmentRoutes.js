const express = require('express');

class AssessmentRoutes {
    constructor(assessmentController) {
        this.assessmentController = assessmentController;
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        /**
         * @swagger
         * /api/assessments/generate/{testType}:
         *   post:
         *     tags: [Assessments]
         *     summary: Generate a new assessment
         *     description: Generate 60 random questions (10 per category) for pretest or posttest
         *     parameters:
         *       - in: path
         *         name: testType
         *         required: true
         *         schema:
         *           type: string
         *           enum: [pretest, posttest]
         *         description: Type of assessment to generate
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required: [userId]
         *             properties:
         *               userId:
         *                 type: string
         *                 format: uuid
         *                 example: "a1b2c3d4-5678-90ab-cdef-123456789012"
         *     responses:
         *       200:
         *         description: Assessment generated successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 success:
         *                   type: boolean
         *                   example: true
         *                 data:
         *                   type: object
         *                   properties:
         *                     userId:
         *                       type: string
         *                     testType:
         *                       type: string
         *                     questions:
         *                       type: array
         *                       items:
         *                         type: object
         *                     totalQuestions:
         *                       type: number
         *       400:
         *         description: Invalid request or user already completed test
         *       500:
         *         description: Server error
         */
        this.router.post('/generate/:testType', (req, res) =>
            this.assessmentController.generateAssessment(req, res)
        );

        /**
         * @swagger
         * /api/assessments/submit:
         *   post:
         *     tags: [Assessments]
         *     summary: Submit and grade assessment
         *     description: Submit user answers and receive grading results
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required: [userId, testType, answers]
         *             properties:
         *               userId:
         *                 type: string
         *                 format: uuid
         *               testType:
         *                 type: string
         *                 enum: [pretest, posttest]
         *               answers:
         *                 type: array
         *                 items:
         *                   type: object
         *                   properties:
         *                     questionId:
         *                       type: string
         *                     answer:
         *                       type: string
         *     responses:
         *       200:
         *         description: Assessment graded successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 success:
         *                   type: boolean
         *                 data:
         *                   type: object
         *                   properties:
         *                     totalScore:
         *                       type: number
         *                     maxScore:
         *                       type: number
         *                     percentage:
         *                       type: number
         *                     correctAnswers:
         *                       type: number
         *                     categoryScores:
         *                       type: object
         *       400:
         *         description: Invalid request
         *       500:
         *         description: Server error
         */
        this.router.post('/submit', (req, res) =>
            this.assessmentController.submitAssessment(req, res)
        );

        /**
         * @swagger
         * /api/assessments/results/{userId}/{testType}:
         *   get:
         *     tags: [Assessments]
         *     summary: Get assessment results
         *     description: Retrieve results for a specific test
         *     parameters:
         *       - in: path
         *         name: userId
         *         required: true
         *         schema:
         *           type: string
         *           format: uuid
         *       - in: path
         *         name: testType
         *         required: true
         *         schema:
         *           type: string
         *           enum: [pretest, posttest]
         *     responses:
         *       200:
         *         description: Results retrieved successfully
         *       404:
         *         description: Results not found
         *       500:
         *         description: Server error
         */
        this.router.get('/results/:userId/:testType', (req, res) =>
            this.assessmentController.getAssessmentResults(req, res)
        );

        /**
         * @swagger
         * /api/assessments/comparison/{userId}:
         *   get:
         *     tags: [Assessments]
         *     summary: Get pretest vs posttest comparison
         *     description: Retrieve comparison data showing improvement between pretest and posttest
         *     parameters:
         *       - in: path
         *         name: userId
         *         required: true
         *         schema:
         *           type: string
         *           format: uuid
         *     responses:
         *       200:
         *         description: Comparison data retrieved successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 success:
         *                   type: boolean
         *                 data:
         *                   type: object
         *                   properties:
         *                     hasPretest:
         *                       type: boolean
         *                     hasPosttest:
         *                       type: boolean
         *                     pretest:
         *                       type: object
         *                     posttest:
         *                       type: object
         *                     overallImprovement:
         *                       type: number
         *                     categoryImprovements:
         *                       type: object
         *       404:
         *         description: Pretest results not found
         *       500:
         *         description: Server error
         */
        this.router.get('/comparison/:userId', (req, res) =>
            this.assessmentController.getComparisonData(req, res)
        );
    }

    getRouter() {
        return this.router;
    }
}

module.exports = AssessmentRoutes;
