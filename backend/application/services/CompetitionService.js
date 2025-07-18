class CompeService {
    constructor(compeRepo, partService, leaderService, roomService) {
        this.compeRepo = compeRepo
        this.partService = partService
        this.leaderService = leaderService
        this.roomService = roomService
    }

    async addCompe(room_id, title) {
        try {
            const data = await this.compeRepo.addCompe(room_id, title)
            const parts = await this.partService.getAllParticipants(room_id)
            await Promise.all(
                parts.map(async (part) => {
                    return await this.leaderService.addCompeBoard(data.id, part.id)
                })
            ) 
            return data
        }  catch (error) {
            throw error
        }
    }

    async getCompeByRoomId(room_id, user_id, type = 'admin') {
        try {
            if (type === 'admin') {
                const room = await this.roomService.getRoomById(room_id, user_id)
                if (!room) throw new Error("Room not found")
                const data = await this.compeRepo.getCompeByRoomIdUsers(room_id)
                if (!data || data.length === 0) return []
                return data
            } else {
                const part = await this.partService.checkPartStatus(user_id, room_id)
                if (!part) throw new Error("You are not a participant of this room")
                const data = await this.compeRepo.getCompeByRoomId(room_id)
                if (!data || data.length === 0) return []
                return data
            }
        } catch (error) {
            throw error
        }
    }

    async getCompeById(compe_id, room_id, user_id) {
        try {
            const room = await this.roomService.getRoomById(room_id, user_id)
            if (!room) throw new Error("Room not found")
            
            const data = await this.compeRepo.getCompeById(compe_id, room_id)
            if (!data) throw new Error("Competition not found")
            return data
        } catch (error) {
            throw error
        }
    }
}

module.exports = CompeService