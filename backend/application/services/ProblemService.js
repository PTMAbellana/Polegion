class ProblemService {
  constructor(problemRepo, roomService) {
    this.problemRepo = problemRepo
    this.roomService = roomService
  }

  async createProblem(data, creator) {
    try {
      const room = await this.roomService.getRoomByCodeUsers(data.room_code)
      const compile = {
        ...data.problemData,
        creator_id: creator.id,
        room_id: room.id
      }
      console.log('problems service ', compile)
      return await this.problemRepo.create(compile);
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
}

module.exports = ProblemService;