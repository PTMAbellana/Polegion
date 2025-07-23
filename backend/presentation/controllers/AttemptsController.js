class AttemptsController {
    constructor(attemptService) {
        this.attemptService = attemptService;
    }

    submitSolution = async (req, res) => {
        try {
            const { competitionId, competitionProblemId } = req.params;
            const { 
                // room_participant_id, 
                participant_solution, 
                time_taken,
                room_id 
            } = req.body; // ✅ Only these fields needed

            const result = await this.attemptService.submitSolution(
                competitionId,
                competitionProblemId, 
                // room_participant_id,
                req.user.id,
                participant_solution,
                time_taken, // ✅ Backend will compute the rest,
                room_id
            );

            res.status(201).json(result);

        } catch (error) {
            console.error('❌ Submit solution error:', error);
            res.status(500).json({ 
                success: false, 
                error: error.message 
            });
        }
    };
}

module.exports = AttemptsController;