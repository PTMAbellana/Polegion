class LeaderboardService {
    constructor(leaderRepo, userService, xpService){
        this.leaderRepo = leaderRepo
        this.userService = userService
        this.xpService = xpService
    }

    async getRoomBoard (room_id) {
        try {
            const data = await this.leaderRepo.getRoomBoard(room_id)
            const participants = await Promise.all(
                data.map(async (row) => {
                    try {
                    const userData = await this.userService.getUserById(row.participant.user_id)
                    const profile_pic = await this.userService.getProfilePicture(row.participant.user_id)
                    return {
                        accumulated_xp: row.accumulated_xp,
                        participants: {
                            ...userData,
                            ...profile_pic
                        } 
                    };
                    } catch (err) {
                    // console.error("lookup failed:", err);
                    return { accumulated_xp: row.accumulated_xp };
                    }
                })
            )
            // console.log('from room board services: ')
            // console.log(participants)
            return participants
        } catch (error) {
            throw error
        }
    }
    
    async getCompeBoard (room_id) {
        try {
            const data = await this.leaderRepo.getCompeBoard(room_id)
            console.log('from compe board services: ', data)
            
            const compiled = await Promise.all(
                data.map(async (row) => {
                    try {
                    const userData = await this.userService.getUserById(row.participant.user_id)
                    const profile_pic = await this.userService.getProfilePicture(row.participant.user_id)
                    return {
                        competition: row.competition,
                        accumulated_xp: row.accumulated_xp,
                        participants: {
                            ...userData,
                            ...profile_pic
                        } 
                    };
                    } catch (err) {
                    // console.error("lookup failed:", err);
                    return { accumulated_xp: row.accumulated_xp };
                    }
                })
            ) 

            console.log('compiled: ', compiled)
            
            const grouped = compiled.reduce((acc, r) => {
                const comp_id = r.competition.comp_id
                if(!acc[comp_id]) {
                    acc[comp_id] = {
                        id: comp_id,
                        title: r.competition.title,
                        data: [],
                    }
                }
                acc[comp_id].data.push(r)
                return acc
            }, {})

            console.log('grouped: ', grouped)
            return Object.values(grouped)
        } catch (error) {
            console.log('Error in getCompeBoard: ', error)
            throw error
        }
    }

    async addRoomBoard (room_id, part_id) {
        try {
            return await this.leaderRepo.addRoomBoard(room_id, part_id)
        } catch (error) {
            throw error
        }
    }
    
    async addCompeBoard (compe_id, part_id) {
        try {
            return await this.leaderRepo.addCompeBoard(compe_id, part_id)
        } catch (error) {
            throw error
        }
    }

    async updateRoomBoard(room_id, part_id){
        try{
            return await this.leaderRepo.updateRoomBoard(room_id, part_id)
        } catch (error){
            throw error
        }
    }

    async updateCompeBoard(room_id, part_id){
        try{
            return await this.leaderRepo.updateCompeBoard(room_id, part_id)
        } catch (error){
            throw error
        }
    }

    async getRoomBoardById(room_id, part_id) {
        try {
            return await this.leaderRepo.getRawBoard(room_id, part_id)
        } catch (error) {
            throw error
        }
    }

    async getCompeBoardById(compe_id, part_id) {
        try {
            return await this.leaderRepo.getRawCompeBoard(compe_id, part_id)
        } catch (error) {
            throw error
        }
   }

    async updateBothLeaderboards(roomParticipantId, competitionId, roomId, xpGained) {
        await this.updateCompetitionLeaderboard(roomParticipantId, competitionId, xpGained);
        await this.updateRoomLeaderboard(roomParticipantId, roomId, xpGained);
    }

    async updateCompetitionLeaderboard(roomParticipantId, competitionId, xpGained) {
        const existing = await this.leaderRepo.getRawCompeBoard(competitionId, roomParticipantId);
        
        if (existing) {
            await this.leaderRepo.updateCompeBoard(competitionId, roomParticipantId, existing.accumulated_xp + xpGained);
        } else {
            await this.leaderRepo.addCompeBoard(competitionId, roomParticipantId);
            await this.leaderRepo.updateCompeBoard(competitionId, roomParticipantId, xpGained);
        }
    }

    async updateRoomLeaderboard(roomParticipantId, roomId, xpGained) {
        // ✅ Use your existing method
        const existing = await this.leaderRepo.getRawBoard(roomId, roomParticipantId);
        
        if (existing) {
            // ✅ Need to add this method to your repo
            await this.leaderRepo.updateRoomXp(existing.id, existing.accumulated_xp + xpGained);
        } else {
            // ✅ Use your existing method
            await this.leaderRepo.addRoomBoard(roomId, roomParticipantId);
            // Update with the actual XP since addRoomBoard creates with 0 XP
            const newEntry = await this.leaderRepo.getRawBoard(roomId, roomParticipantId);
            await this.leaderRepo.updateRoomXp(newEntry.id, xpGained);
        }
    }
}

module.exports = LeaderboardService