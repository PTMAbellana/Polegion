const cache = require('./cache');

class LeaderboardService {
    constructor(leaderRepo, userService, xpService){
        this.leaderRepo = leaderRepo
        this.userService = userService
        this.xpService = xpService
        this.CACHE_TTL = 5 * 60 * 1000; // 5 minutes for leaderboards (they change frequently)
    }

    // Cache invalidation helper methods
    _invalidateRoomLeaderboardCache(roomId) {
        const roomBoardKey = cache.generateKey('room_leaderboard', roomId);
        cache.delete(roomBoardKey);
        console.log('Invalidated room leaderboard cache:', roomId);
    }

    _invalidateCompetitionLeaderboardCache(roomId) {
        const compeBoardKey = cache.generateKey('competition_leaderboard', roomId);
        cache.delete(compeBoardKey);
        console.log('Invalidated competition leaderboard cache:', roomId);
    }

    async getRoomBoard (room_id) {
        try {
            const cacheKey = cache.generateKey('room_leaderboard', room_id);
            
            // Check cache first
            const cached = cache.get(cacheKey);
            if (cached) {
                console.log('Cache hit: getRoomBoard', room_id);
                return cached;
            }
            
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
                    return { accumulated_xp: row.accumulated_xp };
                    }
                })
            )
            
            // Cache the result
            cache.set(cacheKey, participants, this.CACHE_TTL);
            console.log('Cached: getRoomBoard', room_id);
            
            return participants
        } catch (error) {
            throw error
        }
    }
    
    async getCompeBoard (room_id) {
        try {
            const cacheKey = cache.generateKey('competition_leaderboard', room_id);
            
            // Check cache first
            const cached = cache.get(cacheKey);
            if (cached) {
                console.log('Cache hit: getCompeBoard', room_id);
                return cached;
            }
            
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
                        participant: {
                            id: row.participant.id,
                            fullName: userData.fullName || userData.full_name,
                            email: userData.email,
                            profile_pic: profile_pic.profile_pic || profile_pic.profilePic
                        }
                    };
                    } catch (err) {
                    console.error("User lookup failed:", err);
                    return { 
                        competition: row.competition,
                        accumulated_xp: row.accumulated_xp,
                        participant: {
                            id: row.participant.id,
                            fullName: 'Unknown User',
                            email: 'unknown@email.com',
                            profile_pic: null
                        }
                    }; 
                    }
                })
            )

            console.log('compiled: ', compiled)
            
            // Fix the grouping logic
            const grouped = compiled.reduce((acc, r) => {
                const comp_id = r.competition.id
                
                if(!acc[comp_id]) {
                    acc[comp_id] = {
                        id: comp_id,
                        title: r.competition.title,
                        data: [],
                    }
                }
                
                acc[comp_id].data.push({
                    accumulated_xp: r.accumulated_xp,
                    participants: r.participant
                })
                
                return acc
            }, {})

            console.log('grouped: ', grouped)

            const result = Object.values(grouped);
            
            // Cache the result
            cache.set(cacheKey, result);
            console.log('Cache miss: getCompeBoard', room_id);
            
            return result
        } catch (error) {
            console.log('Error in getCompeBoard: ', error)
            throw error
        }
    }

    async addRoomBoard (room_id, part_id) {
        try {
            const result = await this.leaderRepo.addRoomBoard(room_id, part_id)
            // Invalidate room leaderboard cache
            this._invalidateRoomLeaderboardCache(room_id);
            return result
        } catch (error) {
            throw error
        }
    }
    
    async addCompeBoard (compe_id, part_id) {
        try {
            const result = await this.leaderRepo.addCompeBoard(compe_id, part_id)
            // Invalidate competition leaderboard cache
            this._invalidateCompetitionLeaderboardCache(compe_id);
            return result
        } catch (error) {
            throw error
        }
    }

    async updateRoomBoard(room_id, part_id){
        try{
            const result = await this.leaderRepo.updateRoomBoard(room_id, part_id)
            // Invalidate room leaderboard cache
            this._invalidateRoomLeaderboardCache(room_id);
            return result
        } catch (error){
            throw error
        }
    }

    async updateCompeBoard(room_id, part_id){
        try{
            const result = await this.leaderRepo.updateCompeBoard(room_id, part_id)
            // Invalidate competition leaderboard cache  
            this._invalidateCompetitionLeaderboardCache(room_id);
            return result
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
        
        // Invalidate both caches
        this._invalidateRoomLeaderboardCache(roomId);
        this._invalidateCompetitionLeaderboardCache(roomId);
    }

    async updateCompetitionLeaderboard(roomParticipantId, competitionId, xpGained) {
        const existing = await this.leaderRepo.getRawCompeBoard(competitionId, roomParticipantId);
        
        if (existing) {
            await this.leaderRepo.updateCompeBoard(competitionId, roomParticipantId, existing.accumulated_xp + xpGained);
        } else {
            await this.leaderRepo.addCompeBoard(competitionId, roomParticipantId);
            await this.leaderRepo.updateCompeBoard(competitionId, roomParticipantId, xpGained);
        }
        
        // Note: Cache invalidation is handled by the calling method
    }

    async updateRoomLeaderboard(roomParticipantId, roomId, xpGained) {
        const existing = await this.leaderRepo.getRawBoard(roomId, roomParticipantId);
        
        if (existing) {
            await this.leaderRepo.updateRoomXp(existing.id, existing.accumulated_xp + xpGained);
        } else {
            await this.leaderRepo.addRoomBoard(roomId, roomParticipantId);
            // Update with the actual XP since addRoomBoard creates with 0 XP
            const newEntry = await this.leaderRepo.getRawBoard(roomId, roomParticipantId);
            await this.leaderRepo.updateRoomXp(newEntry.id, xpGained);
        }
        
        // Note: Cache invalidation is handled by the calling method
    }
}

module.exports = LeaderboardService