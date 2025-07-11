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
}

module.exports = ProblemService;