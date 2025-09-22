const BaseRepository = require('./BaseRepo');

class XPRepository extends BaseRepository {
  constructor() {
    super('userXP');
  }

  async getUserXP(userId) {
    const cacheKey = `user_xp_${userId}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const userXP = await this.prisma.userXP.findUnique({
      where: { userId }
    });

    const result = userXP || { userId, totalXP: 0, level: 1 };
    await this.cache.set(cacheKey, result, 600); // 10 minutes
    return result;
  }

  async addXP(userId, xpAmount, source = 'PROBLEM_SOLVED') {
    // Get current XP
    const currentXP = await this.getUserXP(userId);
    const newTotalXP = currentXP.totalXP + xpAmount;
    const newLevel = this.calculateLevel(newTotalXP);

    // Update or create XP record
    const updatedXP = await this.prisma.userXP.upsert({
      where: { userId },
      update: {
        totalXP: newTotalXP,
        level: newLevel
      },
      create: {
        userId,
        totalXP: newTotalXP,
        level: newLevel
      }
    });

    // Clear cache
    await this.cache.del(`user_xp_${userId}`);

    // Log XP transaction
    await this.prisma.xPTransaction.create({
      data: {
        userId,
        amount: xpAmount,
        source,
        timestamp: new Date()
      }
    });

    return {
      ...updatedXP,
      leveledUp: newLevel > currentXP.level,
      xpGained: xpAmount
    };
  }

  async getXPHistory(userId, limit = 50) {
    return await this.prisma.xPTransaction.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: limit
    });
  }

  async getTopXPUsers(limit = 50) {
    const cacheKey = `top_xp_users_${limit}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const topUsers = await this.prisma.userXP.findMany({
      take: limit,
      orderBy: [
        { totalXP: 'desc' },
        { level: 'desc' }
      ],
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar_url: true
          }
        }
      }
    });

    await this.cache.set(cacheKey, topUsers, 300); // 5 minutes
    return topUsers;
  }

  calculateLevel(totalXP) {
    // Simple level calculation: Level = floor(sqrt(totalXP / 100)) + 1
    // This means: Level 1: 0-99 XP, Level 2: 100-399 XP, Level 3: 400-899 XP, etc.
    return Math.floor(Math.sqrt(totalXP / 100)) + 1;
  }

  getXPRequiredForNextLevel(currentLevel) {
    // XP required for next level = (nextLevel - 1)^2 * 100
    const nextLevel = currentLevel + 1;
    return Math.pow(nextLevel - 1, 2) * 100;
  }
}

module.exports = XPRepository;