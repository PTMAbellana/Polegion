class AssessmentController {
    constructor(assessmentService) {
        this.assessmentService = assessmentService;
    }

    /**
     * Generate a new assessment
     * POST /api/assessments/generate/:testType
     */
    generateAssessment = async (req, res) => {
        try {
            const { testType } = req.params;
            const { userId } = req.body;

            // Validation
            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: 'userId is required'
                });
            }

            if (!['pretest', 'posttest'].includes(testType)) {
                return res.status(400).json({
                    success: false,
                    message: 'testType must be either "pretest" or "posttest"'
                });
            }

            const assessment = await this.assessmentService.generateAssessment(userId, testType);

            return res.status(200).json({
                success: true,
                data: assessment
            });

        } catch (error) {
            console.error('generateAssessment error:', error);
            
            if (error.message.includes('already completed')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Failed to generate assessment',
                error: error.message
            });
        }
    };

    /**
     * Submit and grade assessment
     * POST /api/assessments/submit
     */
    submitAssessment = async (req, res) => {
        try {
            const { userId, testType, answers } = req.body;

            // Validation
            if (!userId || !testType || !answers) {
                return res.status(400).json({
                    success: false,
                    message: 'userId, testType, and answers are required'
                });
            }

            if (!['pretest', 'posttest'].includes(testType)) {
                return res.status(400).json({
                    success: false,
                    message: 'testType must be either "pretest" or "posttest"'
                });
            }

            if (!Array.isArray(answers) || answers.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'answers must be a non-empty array'
                });
            }

            const results = await this.assessmentService.submitAssessment(userId, testType, answers);

            return res.status(200).json({
                success: true,
                data: results
            });

        } catch (error) {
            console.error('submitAssessment error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to submit assessment',
                error: error.message
            });
        }
    };

    /**
     * Get assessment results
     * GET /api/assessments/results/:userId/:testType
     */
    getAssessmentResults = async (req, res) => {
        try {
            const { userId, testType } = req.params;

            // Validation
            if (!['pretest', 'posttest'].includes(testType)) {
                return res.status(400).json({
                    success: false,
                    message: 'testType must be either "pretest" or "posttest"'
                });
            }

            const results = await this.assessmentService.getAssessmentResults(userId, testType);

            if (!results) {
                return res.status(404).json({
                    success: false,
                    message: `No ${testType} results found for this user`
                });
            }

            return res.status(200).json({
                success: true,
                data: results
            });

        } catch (error) {
            console.error('getAssessmentResults error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to retrieve assessment results',
                error: error.message
            });
        }
    };

    /**
     * Get comparison data between pretest and posttest
     * GET /api/assessments/comparison/:userId
     */
    getComparisonData = async (req, res) => {
        try {
            const { userId } = req.params;

            const comparison = await this.assessmentService.getComparisonData(userId);

            return res.status(200).json({
                success: true,
                data: comparison
            });

        } catch (error) {
            console.error('getComparisonData error:', error);

            if (error.message.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Failed to retrieve comparison data',
                error: error.message
            });
        }
    };
}

module.exports = AssessmentController;
