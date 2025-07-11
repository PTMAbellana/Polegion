class ProblemService {
  constructor(problemRepo, roomService) {
    this.problemRepo = problemRepo
    this.roomService = roomService
  }

  async createProblem(data, creator) {
    try {
      const room = await this.roomService.getRoomByCodeUsers(data.room_code)
      const {timer, ...rest} = data.problemData
      const compile = {
        ...rest,
        creator_id: creator.id,
        room_id: room.id
      }
      console.log('problems service ', compile)
      const res = await this.problemRepo.createRoomProb(compile);
   
      if (!res) throw new Error('Problem creation failed')
      await this.problemRepo.createCompeProb(res.id, timer)

      return res
    } catch (error) {
      throw error
    }
  }
  
  async fetchRoomProblems(room_id, creator_id){
    try {
      return await this.problemRepo.fetchRoomProblems(room_id, creator_id)
    } catch (error) {
      throw error
    }
  }
  
  async fetchRoomProblemsByCode(room_code, creator_id) {
    try {
      const room = await this.roomService.getRoomByCodeUsers(room_code)
      if (!room) throw new Error('Room not found')
      return await this.problemRepo.fetchRoomProblems(room.id, creator_id)
    } catch (error) {
      throw error
    }
  }

  async fetchProblem(problem_id, creator_id) {
    try {
      return await this.problemRepo.fetchProblemById(problem_id, creator_id)
    } catch (error) {
      throw error
    }
  }

  async deleteProblem(problem_id, creator_id) {
    try {
      return await this.problemRepo.deleteProblem(problem_id, creator_id)
    } catch (error) {
      throw error
    }
  }

  async updateProblem(problem_id, creator_id, problemData) {
    try {
      const {timer, ...rest} = problemData
      const updatedProblem = await this.problemRepo.updateProblem(problem_id, creator_id, ...rest)
      if (timer) {
        await this.problemRepo.updateTimer(problem_id, timer)
      }
      return updatedProblem
    } catch (error) {
      throw error
    }
  }
}

module.exports = ProblemService;