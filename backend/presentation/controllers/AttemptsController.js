class AttemptsController {
    constructor(attemptService) {
        this.attemptService = attemptService;
    }

    submitSolution = async (req, res) => {
        try {
            const { competitionId, competitionProblemId } = req.params;
            const { room_participant_id, solution, time_taken } = req.body; // ✅ Only these fields needed

            const result = await this.attemptService.submitSolution(
                competitionId,
                competitionProblemId, 
                room_participant_id,
                solution,
                time_taken // ✅ Backend will compute the rest
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