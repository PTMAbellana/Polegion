const BaseRepository = require('./BaseRepo');

class ProblemRepository extends BaseRepository {
  constructor() {
    super('problem');
  }

  async createProblem(problemData) {
    const problem = await this.prisma.problem.create({
      data: problemData
    });

    // Clear room problems cache
    if (problemData.roomId) {
      await this.cache.del(`room_problems_${problemData.roomId}`);
    }

    return problem;
  }

  async getRoomProblems(roomId) {
    const cacheKey = `room_problems_${roomId}`;
    const cached = await this.cache.get(cacheKey);
    
    if (cached) return cached;

    const problems = await this.prisma.problem.findMany({
      where: { roomId },
      orderBy: { createdAt: 'asc' }
    });

    await this.cache.set(cacheKey, problems, 600); // 10 minutes
    return problems;
  }

  async getRoomProblemsByCode(roomCode) {
    // First find the room
    const room = await this.prisma.room.findUnique({
      where: { code: roomCode }
    });

    if (!room) {
      throw new Error('Room not found');
    }

    return await this.getRoomProblems(room.id);
  }

  async updateTimer(problemId, timeLimit) {
    const problem = await this.prisma.problem.update({
      where: { id: problemId },
      data: { timeLimit }
    });

    // Clear cache
    if (problem.roomId) {
      await this.cache.del(`room_problems_${problem.roomId}`);
    }

    return problem;
  }

  async getCompetitionProblems(competitionId) {
    return await this.prisma.competitionProblem.findMany({
      where: { competitionId },
      include: {
        problem: true
      },
      orderBy: { order: 'asc' }
    });
  }
}

module.exports = ProblemRepository;