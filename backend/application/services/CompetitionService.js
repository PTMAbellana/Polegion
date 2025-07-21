class CompeService {
    constructor(compeRepo, partService, leaderService, roomService, probService) {
        this.compeRepo = compeRepo
        this.partService = partService
        this.leaderService = leaderService
        this.roomService = roomService
        this.probService = probService
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
            return data
        }  catch (error) {
            throw error
        }
    }

    async getCompeByRoomId(room_id, user_id, type = 'admin') {
        try {
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
            return data
        } catch (error) {
            throw error
        }
    }

    async getCompeById(compe_id, room_id, user_id, type = 'creator') {
        try {
            if (type === 'user') {
                const part = await this.partService.checkPartStatus(user_id, room_id)
                if (!part) throw new Error("You are not a participant of this room")
            } else {
                const room = await this.roomService.getRoomById(room_id, user_id)
                if (!room) throw new Error("Room not found")
            }
            const data = await this.compeRepo.getCompeById(compe_id, room_id)
            if (!data) throw new Error("Competition not found")
            return data
        } catch (error) {
            throw error
        }
    }

    async startCompetition(compe_id, problems) {
        try {
            if (!problems || problems.length === 0) {
                throw new Error("Cannot start competition without problems")
            }
            
            // Start with the first problem
            const firstProblem = problems[0]
            console.log("Starting competition with first problem:", firstProblem)
            
            // Get all competition problems and filter for the first one
            const compeProblems = await this.probService.fetchCompeProblems(compe_id)
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
            
            return {
                ...data,
                timer_started_at: currentTime,
                timer_duration: timerDuration,
                timer_end_at: problemEndTime
            }
        } catch (error) {
            throw error
        }
    }

    async nextProblem(compe_id, problems, current_index) {
        try {
            const nextIndex = current_index + 1
            
            if (nextIndex >= problems.length) {
                // Competition is done
                const data = await this.compeRepo.updateCompeStatus(compe_id, 'DONE')
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
            
            return {
                ...data,
                timer_started_at: currentTime,
                timer_duration: timerDuration,
                timer_end_at: problemEndTime
            }
        } catch (error) {
            throw error
        }
    }

    async pauseCompetition(compe_id) {
        try {
            return await this.compeRepo.updateGameplayIndicator(compe_id, 'PAUSE')
        } catch (error) {
            throw error
        }
    }

    async resumeCompetition(compe_id) {
        try {
            return await this.compeRepo.updateGameplayIndicator(compe_id, 'PLAY')
        } catch (error) {
            throw error
        }
    }

    // New method: Auto-advance to next problem when timer expires
    async autoAdvanceCompetition(compe_id) {
        try {
            console.log("Auto-advancing competition:", compe_id);
            // Get current competition state
            const competition = await this.compeRepo.getCompeByIdNoRoom(compe_id)
            console.log("Current competition state:", competition);
            if (!competition || competition.status !== 'ONGOING') {
                return null // Competition not active
            }

            console.log("Auto-advancing competition:", competition.id, "Current problem index:", competition.current_problem_index);

            // Get all problems for this competition
            const problems = await this.probService.fetchCompeProblems(compe_id)
            const currentIndex = competition.current_problem_index || 0
            const nextIndex = currentIndex + 1

            console.log("Current index:", currentIndex, "Next index:", nextIndex);

            if (nextIndex >= problems.length) {
                // Competition is done
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