const roomModel = require('../../domain/models/Room')

class RoomService {
    constructor(roomRepo){
        this.roomRepo = roomRepo
    }

    async getRooms (userId){
        try {
            return await this.roomRepo.getAllRooms(userId)
        } catch (error) {
            throw error
        }
    }

    async getRoomById (roomId, userId){
        try {
            return await this.roomRepo.getRoomId(roomId, userId)
        } catch (error) {
            throw error
        }
    }

    async getRoomByCode (roomCode, userId){
        console.log(roomCode)
        try {
            console.log('natawag ko')
            const res = await this.roomRepo.getRoomByCode(roomCode, userId)
            console.log(res)
            return res
        } catch (error) {
            throw error
        }
    }
    
    async createRoom (title, description, mantra, bannerImage, userId, code){
        try {
            const newRoom = new roomModel (
                null,
                title,
                description,
                mantra,
                bannerImage,
                userId,
                code
            )
            return await this.roomRepo.createRoom(newRoom)
        } catch (error) {
            throw error
        }
    }
    
    async updateRoom (roomId, title, description, mantra, bannerImage, userId){
        try {
            const ur = new roomModel(
                roomId,
                title,
                description,
                mantra,
                bannerImage,
                userId,
                null
            )
            return await this.roomRepo.updateRoom(roomId, userId, ur)
        } catch (error) {
            throw error
        }
    }
    
    async deleteRoom (roomId, userId) {
        try {
            return await this.roomRepo.deleteRoom(roomId, userId)
        } catch (error) {
            throw error
        }
    }
    
    async uploadBannerImage(fileBuffer, fileName, mimeType){
        try {
            return await this.roomRepo.uploadBannerImage(fileBuffer, fileName, mimeType)
        } catch (error) {
            throw error
        }
    }
}

module.exports = RoomService