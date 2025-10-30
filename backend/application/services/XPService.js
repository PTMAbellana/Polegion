class XPService {
    constructor(xpRepo){
        this.xpRepo = xpRepo
    }

    async createXpTransaction(roomParticipantId, competitionAttemptId, xpGained) {
        return await this.xpRepo.createTransaction({
            room_participant_id: roomParticipantId,
            competition_problem_attempt_id: competitionAttemptId,
            competition_problem_attempt_xp_gained: xpGained,
            problem_attempt_id: null,
            problem_attempt_xp_gained: null
        })
    }
}

module.exports = XPService