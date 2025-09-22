const BaseRepository = require('./BaseRepo');

class AttemptsRepository extends BaseRepository {
  constructor() {
    super('attempt');
  }

  async submitSolution(attemptData) {
    const attempt = await this.prisma.attempt.create({
      data: attemptData
    });

    // Clear user stats cache
    await this.cache.del(`user_stats_${attemptData.userId}`);
    await this.cache.del(`user_progress_${attemptData.userId}`);

    return attempt;
  }

  async getUserAttempts(userId, problemId = null) {
    const where = { userId };
    if (problemId) {
      where.problemId = problemId;
    }

    return await this.prisma.attempt.findMany({
      where,
      include: {
        problem: {
          select: {
            id: true,
            title: true,
            difficulty: true,
            points: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateAttemptStatus(attemptId, status, output = null) {
    const attempt = await this.prisma.attempt.update({
      where: { id: attemptId },
      data: { 
        status,
        output: output || undefined
      }
    });

    // Clear user stats cache
    await this.cache.del(`user_stats_${attempt.userId}`);
    await this.cache.del(`user_progress_${attempt.userId}`);

    return attempt;
  }
}

module.exports = AttemptsRepository;