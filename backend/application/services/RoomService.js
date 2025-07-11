const roomModel = require('../../domain/models/Room')

class RoomService {
    constructor(roomRepo){
        this.roomRepo = roomRepo
    }

    async getRooms (user_id){
        try {
            return await this.roomRepo.getAllRooms(user_id)
        } catch (error) {
            throw error
        }
    }

    async getRoomsById (room_id){
        try {
            return await this.roomRepo.getRoomsById(room_id)
        } catch (error) {
            throw error
        }
    }

    async getRoomById (roomId, user_id){
        try {
            return await this.roomRepo.getRoomById(roomId, user_id)
        } catch (error) {
            throw error
        }
    }

    // for admin
    async getRoomByCode (roomCode, user_id){
        // console.log(roomCode)
        try {
            // console.log('natawag ko')
            const res = await this.roomRepo.getRoomByCode(roomCode, user_id)
            // console.log(res)
            return res
        } catch (error) {
            throw error
        }
    }
    
    // for participants
    async getRoomByCodeUsers (roomCode){
        // console.log(roomCode)
        try {
            // console.log('natawag ko')
            return await this.roomRepo.getRoomByCodeUsers(roomCode)
        } catch (error) {
            throw error
        }
    }
    
    async createRoom (title, description, mantra, bannerImage, user_id, code){
        try {
            const newRoom = new roomModel (
                null,
                title,
                description,
                mantra,
                bannerImage,
                user_id,
                new Date(),
                code
            )
            return await this.roomRepo.createRoom(newRoom)
        } catch (error) {
            throw error
        }
    }
    
    async updateRoom (roomId, title, description, mantra, bannerImage, user_id){
        try {
            const ur = new roomModel(
                roomId,
                title,
                description,
                mantra,
                bannerImage,
                user_id,
                null
            )
            return await this.roomRepo.updateRoom(roomId, user_id, ur)
        } catch (error) {
            throw error
        }
    }
    
    async deleteRoom (roomId, user_id) {
        try {
            return await this.roomRepo.deleteRoom(roomId, user_id)
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

    async isRoomExist(room_id){
        try {
            return await this.roomRepo.isRoomExistById(room_id)
        } catch (error) {
            throw error
        }
    }

    async updateVisibility(room_id, user_id, visibility){
        try {
            return await this.roomRepo.updateVisibility(room_id, user_id, visibility)
        } catch (error){
            throw error
        }
    }
}

module.exports = RoomService