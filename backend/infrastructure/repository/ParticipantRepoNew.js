const BaseRepository = require('./BaseRepo');

class ParticipantRepository extends BaseRepository {
  constructor() {
    super('participant');
  }

  async joinRoom(userId, roomCode) {
    // First find the room by code
    const room = await this.prisma.room.findUnique({
      where: { code: roomCode }
    });

    if (!room) {
      throw new Error('Room not found');
    }

    // Check if user is already a participant
    const existingParticipant = await this.prisma.participant.findUnique({
      where: {
        userId_roomId: {
          userId,
          roomId: room.id
        }
      }
    });

    if (existingParticipant) {
      throw new Error('User already joined this room');
    }

    // Create participant
    const participant = await this.prisma.participant.create({
      data: {
        userId,
        roomId: room.id
      },
      include: {
        user: true,
        room: true
      }
    });

    // Clear cache
    await this.cache.del(`room_participants_${room.id}`);
    await this.cache.del(`user_rooms_${userId}`);

    return participant;
  }

  async leaveRoom(userId, roomId) {
    const participant = await this.prisma.participant.delete({
      where: {
        userId_roomId: {
          userId,
          roomId
        }
      }
    });

    // Clear cache
    await this.cache.del(`room_participants_${roomId}`);
    await this.cache.del(`user_rooms_${userId}`);

    return participant;
  }

  async getRoomParticipants(roomId, includeUser = false) {
    const cacheKey = `room_participants_${roomId}`;
    const cached = await this.cache.get(cacheKey);
    
    if (cached) return cached;

    const participants = await this.prisma.participant.findMany({
      where: { roomId },
      include: includeUser ? {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
            xp: true,
            level: true
          }
        }
      } : undefined
    });

    await this.cache.set(cacheKey, participants, 600); // 10 minutes
    return participants;
  }

  async getUserRooms(userId) {
    const cacheKey = `user_rooms_${userId}`;
    const cached = await this.cache.get(cacheKey);
    
    if (cached) return cached;

    const participants = await this.prisma.participant.findMany({
      where: { userId },
      include: {
        room: {
          select: {
            id: true,
            name: true,
            description: true,
            code: true,
            isActive: true,
            createdAt: true,
            creator: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });

    await this.cache.set(cacheKey, participants, 600); // 10 minutes
    return participants;
  }

  async checkParticipantStatus(userId, roomId) {
    const participant = await this.prisma.participant.findUnique({
      where: {
        userId_roomId: {
          userId,
          roomId
        }
      }
    });

    return !!participant;
  }

  async getRoomParticipantCount(roomId) {
    const count = await this.prisma.participant.count({
      where: { roomId }
    });

    return count;
  }

  async removeParticipant(roomId, userId, removedByUserId) {
    // Check if the remover is the room creator
    const room = await this.prisma.room.findUnique({
      where: { id: roomId }
    });

    if (!room || room.creatorId !== removedByUserId) {
      throw new Error('Only room creator can remove participants');
    }

    const participant = await this.prisma.participant.delete({
      where: {
        userId_roomId: {
          userId,
          roomId
        }
      }
    });

    // Clear cache
    await this.cache.del(`room_participants_${roomId}`);
    await this.cache.del(`user_rooms_${userId}`);

    return participant;
  }
}

module.exports = ParticipantRepository;