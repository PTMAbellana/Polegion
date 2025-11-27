const cache = require('../cache');

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
                    return {
                        accumulated_xp: row.accumulated_xp,
                        participants: userData 
                    };
                    } catch (err) {
                        return null;
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
    
    async getCompeBoard (room_id, competition_id = null) {
        try {
            const cacheKey = cache.generateKey('competition_leaderboard', room_id, competition_id || 'all');
            
            // Check cache first
            const cached = cache.get(cacheKey);
            if (cached) {
                console.log('Cache hit: getCompeBoard', room_id, competition_id);
                return cached;
            }
            
            const data = await this.leaderRepo.getCompeBoard(room_id, competition_id)
            console.log('from compe board services: ', data)
            
            const compiled = await Promise.all(
                data.map(async (row) => {
                    try {
                    const userData = await this.userService.getUserById(row.participant.user_id)
                    return {
                        competition: row.competition,
                        accumulated_xp: row.accumulated_xp,
                        participant: userData
                        
                    };
                    } catch (err) {
                    console.error("User lookup failed:", err);
                        return null;
                    }
                })
            )

            // Filter out null results, admins, and teachers - only keep students
            const validCompiled = compiled.filter(item => 
                item !== null && 
                item.participant && 
                item.participant.role === 'student'
            );
            
            console.log('compiled (students only):', validCompiled)
            
            // Fix the grouping logic
            const grouped = validCompiled.reduce((acc, r) => {
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

    async generateRoomRecordsCSV(room_id) {
        try {
            const data = await this.getRoomBoard(room_id)
            
            if (!data || data.length === 0) {
                throw new Error('No records found for this room')
            }

            const roomTitle = data[0]?.participants?.rooms?.[0]?.title || `Room ${room_id}`
            
            let csvContent = `Room: ${roomTitle}\n`
            csvContent += `First Name,Last Name,XP\n`
            
            const sortedData = data.sort((a, b) => (b.accumulated_xp || 0) - (a.accumulated_xp || 0))
            
            sortedData.forEach(row => {
                const firstName = row.participants?.first_name || ''
                const lastName = row.participants?.last_name || ''
                const xp = row.accumulated_xp || 0
                
                csvContent += `"${firstName}","${lastName}","${xp}"\n`
            })

            return {
                content: csvContent,
                filename: `${roomTitle}-records-${new Date().toISOString().split('T')[0]}.csv`
            }
        } catch (error) {
            throw error
        }
    }

    async generateCompetitionRecordsCSV(room_id, competition_id) {
        try {
            // Get all competitions for the room
            const allCompetitions = await this.getCompeBoard(room_id)
            
            if (!allCompetitions || allCompetitions.length === 0) {
                throw new Error('No records found for this room')
            }

            // Filter to get only the specific competition
            const competition = allCompetitions.find(comp => comp.id === parseInt(competition_id))
            
            if (!competition) {
                throw new Error('Competition not found in this room')
            }

            const competitionTitle = competition.title || `Competition ${competition_id}`
            
            let csvContent = `Competition: ${competitionTitle}\n`
            csvContent += `First Name,Last Name,XP\n`
            
            if (competition.data && Array.isArray(competition.data)) {
                const sortedStudents = competition.data.sort((a, b) => (b.accumulated_xp || 0) - (a.accumulated_xp || 0))
                
                sortedStudents.forEach(student => {
                    const firstName = student.participants?.first_name || ''
                    const lastName = student.participants?.last_name || ''
                    const xp = student.accumulated_xp || 0
                    
                    csvContent += `"${firstName}","${lastName}","${xp}"\n`
                })
            }

            return {
                content: csvContent,
                filename: `${competitionTitle}-records-${new Date().toISOString().split('T')[0]}.csv`
            }
        } catch (error) {
            throw error
        }
    }
}

module.exports = LeaderboardService