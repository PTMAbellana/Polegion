const BaseRepository = require('./BaseRepo');

class UserRepository extends BaseRepository {
  constructor() {
    super('user');
  }

  async findByEmail(email, useCache = true) {
    const cacheKey = `user_email_${email}`;
    
    if (useCache) {
      const cached = await this.cache.get(cacheKey);
      if (cached) return cached;
    }

    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        rooms: true,
        participants: {
          include: {
            room: true
          }
        },
        xpHistory: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (user && useCache) {
      await this.cache.set(cacheKey, user, 1800);
    }

    return user;
  }

  async findByUsername(username, useCache = true) {
    const cacheKey = `user_username_${username}`;
    
    if (useCache) {
      const cached = await this.cache.get(cacheKey);
      if (cached) return cached;
    }

    const user = await this.prisma.user.findUnique({
      where: { username }
    });

    if (user && useCache) {
      await this.cache.set(cacheKey, user, 1800);
    }

    return user;
  }

  async findBySupabaseId(supabaseId) {
    return await this.prisma.user.findUnique({
      where: { supabaseId }
    });
  }

  async updateXP(userId, xpAmount, reason) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        xp: {
          increment: xpAmount
        }
      }
    });

    // Create XP history record
    await this.prisma.xPHistory.create({
      data: {
        userId,
        amount: xpAmount,
        reason
      }
    });

    // Invalidate cache
    await this.cache.del(`user_${userId}`);
    await this.cache.del(`user_email_${user.email}`);
    await this.cache.del(`user_username_${user.username}`);
    
    return user;
  }

  async getLeaderboard(limit = 10, roomId = null) {
    const cacheKey = roomId ? `leaderboard_room_${roomId}_${limit}` : `leaderboard_global_${limit}`;
    const cached = await this.cache.get(cacheKey);
    
    if (cached) return cached;

    let whereClause = { isActive: true };
    
    // If roomId is provided, filter by room participants
    if (roomId) {
      whereClause.participants = {
        some: {
          roomId: roomId
        }
      };
    }

    const leaderboard = await this.prisma.user.findMany({
      where: whereClause,
      orderBy: [
        { xp: 'desc' },
        { level: 'desc' }
      ],
      take: limit,
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        xp: true,
        level: true
      }
    });

    await this.cache.set(cacheKey, leaderboard, 300); // 5 minutes
    return leaderboard;
  }

  async getUserStats(userId) {
    const cacheKey = `user_stats_${userId}`;
    const cached = await this.cache.get(cacheKey);
    
    if (cached) return cached;

    const [user, attemptStats, xpHistory] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          xp: true,
          level: true,
          createdAt: true,
          lastLoginAt: true
        }
      }),
      this.prisma.attempt.groupBy({
        by: ['status'],
        where: { userId },
        _count: {
          status: true
        }
      }),
      this.prisma.xPHistory.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 20,
        select: {
          amount: true,
          reason: true,
          createdAt: true
        }
      })
    ]);

    const stats = {
      user,
      attempts: {
        total: attemptStats.reduce((sum, stat) => sum + stat._count.status, 0),
        accepted: attemptStats.find(s => s.status === 'ACCEPTED')?._count.status || 0,
        wrongAnswer: attemptStats.find(s => s.status === 'WRONG_ANSWER')?._count.status || 0,
        timeLimit: attemptStats.find(s => s.status === 'TIME_LIMIT_EXCEEDED')?._count.status || 0,
        runtime: attemptStats.find(s => s.status === 'RUNTIME_ERROR')?._count.status || 0,
        compilation: attemptStats.find(s => s.status === 'COMPILATION_ERROR')?._count.status || 0
      },
      recentXP: xpHistory
    };

    await this.cache.set(cacheKey, stats, 600); // 10 minutes
    return stats;
  }

  async searchUsers(query, limit = 20) {
    return await this.prisma.user.findMany({
      where: {
        AND: [
          { isActive: true },
          {
            OR: [
              { username: { contains: query, mode: 'insensitive' } },
              { firstName: { contains: query, mode: 'insensitive' } },
              { lastName: { contains: query, mode: 'insensitive' } }
            ]
          }
        ]
      },
      take: limit,
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        xp: true,
        level: true
      },
      orderBy: [
        { xp: 'desc' },
        { username: 'asc' }
      ]
    });
  }

  async updateLastLogin(userId) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() }
    });

    // Clear user cache
    await this.cache.del(`user_${userId}`);
    if (user.email) await this.cache.del(`user_email_${user.email}`);
    if (user.username) await this.cache.del(`user_username_${user.username}`);
    
    return user;
  }

  async getUserProgress(userId) {
    const cacheKey = `user_progress_${userId}`;
    const cached = await this.cache.get(cacheKey);
    
    if (cached) return cached;

    const [solvedProblems, totalAttempts, participations] = await Promise.all([
      this.prisma.attempt.groupBy({
        by: ['problemId'],
        where: {
          userId,
          status: 'ACCEPTED'
        },
        _count: {
          problemId: true
        }
      }),
      this.prisma.attempt.count({
        where: { userId }
      }),
      this.prisma.participant.count({
        where: { userId }
      })
    ]);

    const progress = {
      solvedProblems: solvedProblems.length,
      totalAttempts,
      roomsJoined: participations,
      successRate: totalAttempts > 0 ? (solvedProblems.length / totalAttempts * 100).toFixed(2) : 0
    };

    await this.cache.set(cacheKey, progress, 1800); // 30 minutes
    return progress;
  }

  async deactivateUser(userId) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: false }
    });

    // Clear all user-related cache
    await this.cache.del(`user_${userId}`);
    if (user.email) await this.cache.del(`user_email_${user.email}`);
    if (user.username) await this.cache.del(`user_username_${user.username}`);
    await this.cache.del(`user_stats_${userId}`);
    await this.cache.del(`user_progress_${userId}`);
    
    return user;
  }

  async reactivateUser(userId) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: true }
    });

    // Clear user cache to refresh data
    await this.cache.del(`user_${userId}`);
    if (user.email) await this.cache.del(`user_email_${user.email}`);
    if (user.username) await this.cache.del(`user_username_${user.username}`);
    
    return user;
  }
}

module.exports = UserRepository;