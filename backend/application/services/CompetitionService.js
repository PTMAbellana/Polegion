const supabase = require('../../config/supabase')
const cache = require('../cache');

class CompeService {
    constructor(compeRepo, partService, leaderService, roomService, probService) {
        this.compeRepo = compeRepo
        this.partService = partService
        this.leaderService = leaderService
        this.roomService = roomService
        this.probService = probService
        this.CACHE_TTL = 15 * 60 * 1000; // 15 minutes for competitions (moderately stable)
    }

    // Cache invalidation helper methods
    _invalidateCompetitionCache(roomId, competitionId = null) {
        const roomCompeKey = cache.generateKey('competition_by_room', roomId);
        cache.delete(roomCompeKey);
        
        if (competitionId) {
            const compeKey = cache.generateKey('competition', competitionId);
            cache.delete(compeKey);
        }
        
        console.log('Invalidated competition cache for room:', roomId, 'competition:', competitionId);
    }

    async addCompe(room_id, title) {
        try {
            const data = await this.compeRepo.addCompe(room_id, title)
            const parts = await this.partService.getAllParticipants(room_id)
            await Promise.all(
                parts.map(async (part) => {
                    return await this.leaderService.addCompeBoard(data.id, part.id)
                })
            ) 
            
            // Invalidate competition cache for this room
            this._invalidateCompetitionCache(room_id, data.id);
            
            return data
        }  catch (error) {
            throw error
        }
    }

    async getCompeByRoomId(room_id, user_id, type = 'admin') {
        try {
            const cacheKey = cache.generateKey('competition_by_room', room_id, user_id, type);
            
            // Check cache first
            const cached = cache.get(cacheKey);
            if (cached) {
                console.log('Cache hit: getCompeByRoomId', room_id, type);
                return cached;
            }
            
            console.log("Fetching competitions for room:", room_id, "User ID:", user_id, "Type:", type)
            if (type === 'admin') {
                const room = await this.roomService.getRoomById(room_id, user_id)
                if (!room) throw new Error("Room not found")
            } else {
                console.log("Checking participant status for user:", user_id)
                const part = await this.partService.checkPartStatus(user_id, room_id)
                if (!part) throw new Error("You are not a participant of this room")
            }
            const data = await this.compeRepo.getCompeByRoomId(room_id)
            if (!data || data.length === 0) return []
            
            // Cache the result
            cache.set(cacheKey, data);
            console.log('Cache miss: getCompeByRoomId', room_id, type);
            
            return data
        } catch (error) {
            throw error
        }
    }

    async getCompeById(compe_id, room_id, user_id, type = 'creator') {
        try {
            const cacheKey = cache.generateKey('competition', compe_id, room_id, user_id, type);
            
            // Check cache first
            const cached = cache.get(cacheKey);
            if (cached) {
                console.log('Cache hit: getCompeById', compe_id);
                return cached;
            }
            
            if (type === 'user') {
                const part = await this.partService.checkPartStatus(user_id, room_id)
                if (!part) throw new Error("You are not a participant of this room")
            } else {
                const room = await this.roomService.getRoomById(room_id, user_id)
                if (!room) throw new Error("Room not found")
            }
            const data = await this.compeRepo.getCompeById(compe_id, room_id)
            if (!data) throw new Error("Competition not found")
            
            // Cache the result
            cache.set(cacheKey, data);
            console.log('Cache miss: getCompeById', compe_id);
            
            return data
        } catch (error) {
            throw error
        }
    }

    async startCompetition(compe_id, problems) {
        console.log('Starting competition with problems:', problems)
        try {
            if (!problems || problems.length === 0) {
                throw new Error("Cannot start competition without problems")
            } 
            // Start with the first problem
            const firstProblem = problems[0]
            const compeProblems = await this.probService.fetchCompeProblems(compe_id)
            console.log("Starting competition with first problem:", firstProblem)
            
            // Get all competition problems and filter for the first one
            const firstCompeProblem = compeProblems.find(cp => cp.problem.id === firstProblem.problem.id)
            console.log("Found matching competition problem:", firstCompeProblem)
            
            // Calculate timer duration and start time
            const timerDuration = firstCompeProblem?.timer || 30 // Default 30 seconds
            const currentTime = new Date()
            const problemEndTime = new Date(currentTime.getTime() + (timerDuration * 1000))
            
            const data = await this.compeRepo.updateCurrentProblem(
                compe_id, 
                firstCompeProblem.id, 
                0, 
                'ONGOING'
            )
            
            // Update with timer info
            await this.compeRepo.updateTimer(compe_id, {
                timer_started_at: currentTime,
                timer_duration: timerDuration,
                timer_end_at: problemEndTime
            })
            
            const result = {
                ...data,
                timer_started_at: currentTime,
                timer_duration: timerDuration,
                timer_end_at: problemEndTime
            }
            
            // Invalidate competition cache since status changed
            this._invalidateCompetitionCache(data.room_id, compe_id);
            
            // 🚀 SEND BROADCAST TO NOTIFY ALL CLIENTS
            try {
                const channel = supabase.channel(`competition-${compe_id}`)
                await channel.send({
                    type: 'broadcast',
                    event: 'competition_update',
                    payload: result
                })
                console.log(`📡 Competition ${compe_id} start broadcasted successfully!`)
            } catch (broadcastError) {
                console.error('❌ Broadcast failed:', broadcastError)
                // Don't throw error - continue with operation even if broadcast fails
            }
            
            return result
        } catch (error) {
            throw error
        }
    }

    async nextProblem(compe_id, problems, current_index) {
        console.log("Advancing to next problem for competition:", compe_id, "Current index:", current_index);
        try {
            const nextIndex = current_index + 1
            
            if (nextIndex >= problems.length) {
                // Competition is done
                const data = await this.compeRepo.updateCompeStatus(compe_id, 'DONE')
                
                // 🚀 SEND BROADCAST FOR COMPETITION FINISH
                try {
                    const channel = supabase.channel(`competition-${compe_id}`)
                    await channel.send({
                        type: 'broadcast',
                        event: 'competition_update',
                        payload: { ...data, competition_finished: true }
                    })
                    console.log(`🏁 Competition ${compe_id} finish broadcasted successfully!`)
                } catch (broadcastError) {
                    console.error('❌ Finish broadcast failed:', broadcastError)
                }
                
                return { ...data, competition_finished: true }
            }
            
            const nextProblem = problems[nextIndex]
            const nextCompeProblems = await this.probService.fetchCompeProblems(compe_id)
            const nextCompeProblem = nextCompeProblems.find(cp => cp.problem.id === nextProblem.problem.id)
            
            // Calculate timer for next problem
            const timerDuration = nextCompeProblem?.timer || 30
            const currentTime = new Date()
            const problemEndTime = new Date(currentTime.getTime() + (timerDuration * 1000))
            
            const data = await this.compeRepo.updateCurrentProblem(
                compe_id, 
                nextCompeProblem.id, 
                nextIndex,
                'ONGOING'
            )
            
            // Update timer info
            await this.compeRepo.updateTimer(compe_id, {
                timer_started_at: currentTime,
                timer_duration: timerDuration,
                timer_end_at: problemEndTime
            })
            
            const result = {
                ...data,
                timer_started_at: currentTime,
                timer_duration: timerDuration,
                timer_end_at: problemEndTime
            }
            
            // 🚀 SEND BROADCAST TO NOTIFY ALL CLIENTS
            try {
                const channel = supabase.channel(`competition-${compe_id}`)
                await channel.send({
                    type: 'broadcast',
                    event: 'competition_update',
                    payload: result
                })
                console.log(`➡️ Competition ${compe_id} next problem broadcasted successfully!`)
            } catch (broadcastError) {
                console.error('❌ Next problem broadcast failed:', broadcastError)
            }
            
            return result
        } catch (error) {
            throw error
        }
    }

    async pauseCompetition(compe_id) {
        try {
            // Get current competition to calculate remaining time
            const competition = await this.compeRepo.getCompeByIdNoRoom(compe_id);
            if (!competition) {
                throw new Error("Competition not found");
            }

            // Calculate time remaining when pausing
            let timeRemaining = null;
            if (competition.timer_started_at && competition.timer_duration) {
                const startTime = new Date(competition.timer_started_at).getTime();
                const now = Date.now();
                const elapsed = Math.floor((now - startTime) / 1000); // seconds
                timeRemaining = Math.max(0, competition.timer_duration - elapsed);
            }

            // Update to paused state with time remaining
            const data = await this.compeRepo.updateTimeRemaining(compe_id, {
                gameplay_indicator: 'PAUSE',
                time_remaining: timeRemaining, // Store remaining time
                updated_at: new Date().toISOString()
            });

            // Broadcast the pause update
            const channel = supabase.channel(`competition-${compe_id}`);
            await channel.send({
                type: 'broadcast',
                event: 'competition_update',
                payload: data
            });
            
            console.log(`⏸️ Competition ${compe_id} pause broadcasted successfully!`);
            return data;
            
        } catch (error) {
            throw error;
        }
    }

    async resumeCompetition(compe_id) {
        try {
            const competition = await this.compeRepo.getCompeByIdNoRoom(compe_id);
            if (!competition) {
                throw new Error("Competition not found");
            }

            // When resuming, restart timer with remaining time
            const now = new Date();
            const timeRemaining = competition.time_remaining || 0;
            const newEndTime = new Date(now.getTime() + (timeRemaining * 1000));

            const data = await this.compeRepo.updateTimeRemaining(compe_id, {
                gameplay_indicator: 'PLAY',
                timer_started_at: now.toISOString(), 
                timer_duration: timeRemaining, 
                timer_end_at: newEndTime.toISOString(),
                time_remaining: null, 
                updated_at: new Date().toISOString()
            });

            // Broadcast the resume update
            const channel = supabase.channel(`competition-${compe_id}`);
            await channel.send({
                type: 'broadcast',
                event: 'competition_update',
                payload: data
            });
            
            console.log(`▶️ Competition ${compe_id} resume broadcasted successfully!`);
            return data;
            
        } catch (error) {
            throw error;
        }
    }

    // New method: Auto-advance to next problem when timer expires
    async autoAdvanceCompetition(compe_id) {
        try {
            console.log("Auto-advancing competition:", compe_id);
            
            const competition = await this.compeRepo.getCompeByIdNoRoom(compe_id)
            console.log("Current competition state:", competition);
            if (!competition || competition.status !== 'ONGOING') {
                return null 
            }

            console.log("Auto-advancing competition:", competition.id, "Current problem index:", competition.current_problem_index);

            // Get all problems for this competition
            const problems = await this.probService.fetchCompeProblems(compe_id)
            const currentIndex = competition.current_problem_index || 0
            const nextIndex = currentIndex + 1

            console.log("Current index:", currentIndex, "Next index:", nextIndex);

            if (nextIndex >= problems.length) {
                const data = await this.compeRepo.updateCompeStatus(compe_id, 'DONE')
                return { ...data, competition_finished: true }
            }

            // Move to next problem
            const nextProblem = problems[nextIndex]
            console.log("Next problem to advance to:", nextProblem);            
            // Get all competition problems and find the next one (same logic as other methods)
            const compeProblems = await this.probService.fetchCompeProblems(compe_id)
            const nextCompeProblem = compeProblems.find(cp => cp.problem.id === nextProblem.problem.id)
            console.log("Found matching next competition problem:", nextCompeProblem)
            
            const timerDuration = nextCompeProblem?.timer || 30
            const currentTime = new Date()
            const problemEndTime = new Date(currentTime.getTime() + (timerDuration * 1000))

            // Update current problem
            const data = await this.compeRepo.updateCurrentProblem(
                compe_id, 
                nextCompeProblem.id, 
                nextIndex,
                'ONGOING'
            )

            // Update timer
            await this.compeRepo.updateTimer(compe_id, {
                timer_started_at: currentTime,
                timer_duration: timerDuration,
                timer_end_at: problemEndTime
            })


            // 🚀 SEND BROADCAST TO NOTIFY ALL CLIENTS
            try {
                const channel = supabase.channel(`competition-${compe_id}`)
                await channel.send({
                    type: 'broadcast',
                    event: 'competition_update',
                    payload: {
                        ...data,
                        timer_started_at: currentTime,
                        timer_duration: timerDuration,
                        timer_end_at: problemEndTime,
                        current_problem_index: nextIndex,
                        total_problems: problems.length
                    }
                })
                console.log(`▶️ Competition ${compe_id} resume broadcasted successfully!`)
            } catch (broadcastError) {
                console.error('❌ Resume broadcast failed:', broadcastError)
            }

            return {
                ...data,
                timer_started_at: currentTime,
                timer_duration: timerDuration,
                timer_end_at: problemEndTime,
                current_problem_index: nextIndex,
                total_problems: problems.length
            }
        } catch (error) {
            throw error
        }
    }
}

module.exports = CompeService