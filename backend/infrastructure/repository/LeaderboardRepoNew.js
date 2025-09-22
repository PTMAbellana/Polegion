const BaseRepository = require('./BaseRepo');

class LeaderboardRepository extends BaseRepository {
  constructor() {
    super('leaderboard');
  }

  async getGlobalRanking(limit = 50) {
    const cacheKey = `global_ranking_${limit}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    // For global ranking, we need to calculate total points across all attempts
    const ranking = await this.prisma.$queryRaw`
      SELECT 
        u.id,
        u.username,
        u.avatar_url,
        COALESCE(SUM(CASE WHEN a.status = 'ACCEPTED' THEN p.points ELSE 0 END), 0) as total_points,
        COUNT(CASE WHEN a.status = 'ACCEPTED' THEN 1 END) as solved_problems
      FROM "User" u
      LEFT JOIN "Attempt" a ON u.id = a."userId"
      LEFT JOIN "Problem" p ON a."problemId" = p.id
      GROUP BY u.id, u.username, u.avatar_url
      ORDER BY total_points DESC, solved_problems DESC
      LIMIT ${limit}
    `;

    await this.cache.set(cacheKey, ranking, 300); // 5 minutes
    return ranking;
  }

  async getCompetitionRanking(competitionId, limit = 50) {
    const cacheKey = `competition_ranking_${competitionId}_${limit}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const ranking = await this.prisma.$queryRaw`
      SELECT 
        u.id,
        u.username,
        u.avatar_url,
        COALESCE(SUM(CASE WHEN a.status = 'ACCEPTED' THEN p.points ELSE 0 END), 0) as total_points,
        COUNT(CASE WHEN a.status = 'ACCEPTED' THEN 1 END) as solved_problems
      FROM "User" u
      INNER JOIN "Participant" pt ON u.id = pt."userId"
      LEFT JOIN "Attempt" a ON u.id = a."userId" AND a."competitionId" = ${competitionId}
      LEFT JOIN "Problem" p ON a."problemId" = p.id
      WHERE pt."competitionId" = ${competitionId}
      GROUP BY u.id, u.username, u.avatar_url
      ORDER BY total_points DESC, solved_problems DESC
      LIMIT ${limit}
    `;

    await this.cache.set(cacheKey, ranking, 60); // 1 minute for active competitions
    return ranking;
  }

  async getUserRank(userId, competitionId = null) {
    const cacheKey = competitionId 
      ? `user_rank_${userId}_comp_${competitionId}` 
      : `user_rank_${userId}_global`;
    
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    let query;
    if (competitionId) {
      query = this.prisma.$queryRaw`
        WITH ranked_users AS (
          SELECT 
            u.id,
            COALESCE(SUM(CASE WHEN a.status = 'ACCEPTED' THEN p.points ELSE 0 END), 0) as total_points,
            COUNT(CASE WHEN a.status = 'ACCEPTED' THEN 1 END) as solved_problems,
            ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(CASE WHEN a.status = 'ACCEPTED' THEN p.points ELSE 0 END), 0) DESC, COUNT(CASE WHEN a.status = 'ACCEPTED' THEN 1 END) DESC) as rank
          FROM "User" u
          INNER JOIN "Participant" pt ON u.id = pt."userId"
          LEFT JOIN "Attempt" a ON u.id = a."userId" AND a."competitionId" = ${competitionId}
          LEFT JOIN "Problem" p ON a."problemId" = p.id
          WHERE pt."competitionId" = ${competitionId}
          GROUP BY u.id
        )
        SELECT rank, total_points, solved_problems
        FROM ranked_users
        WHERE id = ${userId}
      `;
    } else {
      query = this.prisma.$queryRaw`
        WITH ranked_users AS (
          SELECT 
            u.id,
            COALESCE(SUM(CASE WHEN a.status = 'ACCEPTED' THEN p.points ELSE 0 END), 0) as total_points,
            COUNT(CASE WHEN a.status = 'ACCEPTED' THEN 1 END) as solved_problems,
            ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(CASE WHEN a.status = 'ACCEPTED' THEN p.points ELSE 0 END), 0) DESC, COUNT(CASE WHEN a.status = 'ACCEPTED' THEN 1 END) DESC) as rank
          FROM "User" u
          LEFT JOIN "Attempt" a ON u.id = a."userId"
          LEFT JOIN "Problem" p ON a."problemId" = p.id
          GROUP BY u.id
        )
        SELECT rank, total_points, solved_problems
        FROM ranked_users
        WHERE id = ${userId}
      `;
    }

    const result = await query;
    const userRank = result[0] || { rank: null, total_points: 0, solved_problems: 0 };

    await this.cache.set(cacheKey, userRank, 300); // 5 minutes
    return userRank;
  }
}

module.exports = LeaderboardRepository;