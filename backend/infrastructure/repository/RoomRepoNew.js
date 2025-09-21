const BaseRepository = require('./BaseRepo');

class RoomRepository extends BaseRepository {
  constructor() {
    super('room');
  }

  async findByCode(code, useCache = true) {
    const cacheKey = `room_code_${code}`;
    
    if (useCache) {
      const cached = await this.cache.get(cacheKey);
      if (cached) return cached;
    }

    const room = await this.prisma.room.findUnique({
      where: { code },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatar: true
              }
            }
          }
        },
        problems: {
          where: { isActive: true },
          select: {
            id: true,
            title: true,
            difficulty: true,
            points: true
          }
        }
      }
    });

    if (room && useCache) {
      await this.cache.set(cacheKey, room, 900); // 15 minutes
    }

    return room;
  }

  async getUserRooms(userId, useCache = true) {
    const cacheKey = `user_rooms_${userId}`;
    
    if (useCache) {
      const cached = await this.cache.get(cacheKey);
      if (cached) return cached;
    }

    const rooms = await this.prisma.room.findMany({
      where: {
        OR: [
          { creatorId: userId },
          { participants: { some: { userId } } }
        ],
        isActive: true
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true
          }
        },
        participants: {
          select: {
            id: true,
            userId: true,
            joinedAt: true
          }
        },
        _count: {
          select: {
            participants: true,
            problems: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (useCache) {
      await this.cache.set(cacheKey, rooms, 600); // 10 minutes
    }

    return rooms;
  }

  async generateUniqueCode() {
    let code;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      code = Math.random().toString(36).substring(2, 8).toUpperCase();
      const existing = await this.prisma.room.findUnique({
        where: { code }
      });
      
      if (!existing) break;
      attempts++;
    } while (attempts < maxAttempts);

    if (attempts >= maxAttempts) {
      throw new Error('Unable to generate unique room code');
    }

    return code;
  }

  async joinRoom(roomId, userId) {
    // Check if user is already a participant
    const existingParticipant = await this.prisma.participant.findUnique({
      where: {
        userId_roomId: {
          userId,
          roomId
        }
      }
    });

    if (existingParticipant) {
      throw new Error('User is already a participant in this room');
    }

    // Check room capacity
    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
      include: {
        _count: {
          select: { participants: true }
        }
      }
    });

    if (!room) {
      throw new Error('Room not found');
    }

    if (room._count.participants >= room.maxUsers) {
      throw new Error('Room is full');
    }

    // Join room
    const participant = await this.prisma.participant.create({
      data: {
        userId,
        roomId
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        room: {
          select: {
            id: true,
            name: true,
            code: true
          }
        }
      }
    });

    // Clear cache
    await this.cache.del(`user_rooms_${userId}`);
    await this.cache.del(`room_code_${room.code}`);
    await this.cache.del(`room_${roomId}`);
    
    return participant;
  }
}

module.exports = RoomRepository;