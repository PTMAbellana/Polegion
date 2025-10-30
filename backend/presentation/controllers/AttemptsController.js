class AttemptsController {
    constructor(attemptService) {
        this.attemptService = attemptService;
    }

    submitSolution = async (req, res) => {
        try {
            console.log('📝 Submit solution request:', req.body);
            console.log('👤 User from token:', req.user);
            console.log('🛣️ Route params:', req.params);
            
            // ✅ Handle both route formats
            let competitionId, competitionProblemId;
            
            if (req.params.competitionId && req.params.competitionProblemId) {
                // Original route: /competitions/:competitionId/problems/:competitionProblemId/submit
                competitionId = req.params.competitionId;
                competitionProblemId = req.params.competitionProblemId;
            } else {
                // New route: /submit (with data in body)
                competitionId = req.body.competition_id;
                competitionProblemId = req.body.competition_problem_id;
            }
            
            const { 
                participant_solution, 
                time_taken,
                room_id 
            } = req.body;

            // ✅ Validate required fields
            if (!competitionId || !competitionProblemId || !participant_solution || !room_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields',
                    received: {
                        competitionId: !!competitionId,
                        competitionProblemId: !!competitionProblemId,
                        participant_solution: !!participant_solution,
                        room_id: !!room_id
                    }
                });
            }

            console.log('🎯 Submitting solution with params:', {
                competitionId,
                competitionProblemId,
                user_id: req.user.id,
                participant_solution,
                time_taken: time_taken || 0,
                room_id
            });

            const result = await this.attemptService.submitSolution(
                competitionId,
                competitionProblemId, 
                req.user.id,
                participant_solution,
                time_taken || 0,
                room_id
            );

            console.log('✅ Submission successful:', result);

            res.status(201).json(result);

        } catch (error) {
            console.error('❌ Submit solution error:', error);
            res.status(500).json({ 
                success: false, 
                message: error.message || 'Failed to submit solution',
                error: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    };
}

module.exports = AttemptsController;