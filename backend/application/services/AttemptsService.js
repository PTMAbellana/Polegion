const supabase = require('../../config/supabase')

class AttemptsService {
    constructor(attemptRepo, xpService, leaderboardService, gradingService, participantService) {
        this.attemptRepo = attemptRepo;
        this.xpService = xpService;
        this.leaderboardService = leaderboardService;
        this.gradingService = gradingService;
        this.participantService = participantService;
    }

    async submitSolution(competitionId, competitionProblemId, user_id, solution, timeTaken, room_id) {
        try {
            
            const part = await this.participantService.getPartInfoByUserId(user_id, room_id);
            console.log('Participant ID:', part);
            // 1. Set submitted_at to now
            const submittedAt = new Date();
            
            // 2. Calculate attempted_at by going backwards from submitted_at
            const attemptedAt = new Date(submittedAt.getTime() - (timeTaken * 1000)); // ✅ Computed!

            // console.log('Attempting to submit solution:', {
            //     competitionId,
            //     competitionProblemId,
            //     part.id,
            //     solution,
            //     timeTaken
            // });

            // 3. Grade the solution
            const gradingResult = this.gradingService.gradeCompetitionSolution(competitionProblemId, solution);

            console.log('Grading result:', gradingResult);

            // 4. Create the attempt
            const attempt = await this.attemptRepo.addCompeAttempt({
                room_participant_id: part.id,
                competition_problem_id: competitionProblemId,
                solution: solution,
                time_taken: timeTaken, // ✅ From frontend
                attempted_at: attemptedAt, // ✅ Computed from submitted_at - time_taken
                submitted_at: submittedAt, // ✅ Backend sets this
                xp_gained: gradingResult.xp_gained,
                feedback: gradingResult.feedback
            });

            console.log('Attempt created:', attempt);

            // 5. Handle XP transaction (internal, no API)
            await this.xpService.createXpTransaction(part.id, attempt.id, gradingResult.xp_gained);

            // 6. Update leaderboards (internal, no API)  
            const part_data = await this.participantService.getPartInfo(part.id);
            await this.leaderboardService.updateBothLeaderboards(
                part.id, 
                competitionId, 
                // competition.room_id, 
                part_data.room_id,
                gradingResult.xp_gained
            );

            // 7. Broadcast submission
            await this.broadcastSubmission(competitionId, attempt);

            return {
                success: true,
                attempt: attempt,
                xp_gained: gradingResult.xp_gained
            };

        } catch (error) {
            throw error;
        }
    }

    calculateTimeTaken(competition) {
        const startTime = new Date(competition.timer_started_at).getTime();
        const submitTime = Date.now();
        return Math.floor((submitTime - startTime) / 1000);
    }

    async broadcastSubmission(competitionId, attempt) {
        const channel = supabase.channel(`competition-${competitionId}`);
        await channel.send({
            type: 'broadcast',
            event: 'submission_update',
            payload: {
                participant_id: attempt.room_participant_id,
                xp_gained: attempt.xp_gained,
                submitted_at: attempt.submitted_at
            }
        });
    }
}

module.exports = AttemptsService;