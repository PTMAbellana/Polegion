const BaseRepository = require('./BaseRepo');

class CompetitionRepository extends BaseRepository {
  constructor() {
    super('competition');
  }

  async getUserCompetitions(userId) {
    const cacheKey = `user_competitions_${userId}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const competitions = await this.prisma.competition.findMany({
      where: {
        participants: {
          some: { userId }
        }
      },
      include: {
        participants: true,
        problems: true
      },
      orderBy: { createdAt: 'desc' }
    });

    await this.cache.set(cacheKey, competitions, 300); // 5 minutes
    return competitions;
  }

  async getActiveCompetitions() {
    const cacheKey = 'active_competitions';
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const now = new Date();
    const competitions = await this.prisma.competition.findMany({
      where: {
        startTime: { lte: now },
        endTime: { gte: now },
        status: 'ACTIVE'
      },
      include: {
        participants: true,
        problems: true
      }
    });

    await this.cache.set(cacheKey, competitions, 60); // 1 minute
    return competitions;
  }

  async startCompetition(competitionId) {
    const competition = await this.prisma.competition.update({
      where: { id: competitionId },
      data: { 
        status: 'ACTIVE',
        startTime: new Date()
      }
    });

    // Clear related caches
    await this.cache.del('active_competitions');
    await this.cache.del(`competition_${competitionId}`);

    return competition;
  }

  async endCompetition(competitionId) {
    const competition = await this.prisma.competition.update({
      where: { id: competitionId },
      data: { 
        status: 'ENDED',
        endTime: new Date()
      }
    });

    // Clear related caches
    await this.cache.del('active_competitions');
    await this.cache.del(`competition_${competitionId}`);

    return competition;
  }
}

module.exports = CompetitionRepository;