// const userModel = require('../../domain/models/User')
const Mailer = require('../../utils/Mailer'); // Adjust path as needed

class ParticipantService {
    constructor(participantRepo, roomService, userService){
        this.participantRepo = participantRepo
        this.roomService = roomService
        this.userService = userService
    }

    async joinRoom(user_id, room_code){
        try {
            return await this.participantRepo.addParticipant(user_id, room_code)
        } catch (error) {
            throw error
        }
    }
    
    async leaveRoom(user_id, room_id){
        try {
            return await this.participantRepo.removeParticipant(user_id, room_id)
        } catch (error) {
            throw error
        }
    }

    //ang mu get kay ang owner or ang admin
    async getRoomParticipantsForAdmin(room_id, creator_id){
        try {
            //verify if room exists
            const exist = await this.roomService.getRoomById(room_id, creator_id)
            
            if (!exist) throw new Error ('Room not found or not authorized')
            const data = await this.participantRepo.getAllParticipants(room_id)
            
            const participants = await Promise.all(
                data.map(async (participant) => {
                    try {
                        // Fetch user data from users table using user_id
                        const userData = await this.userService.getUserById(participant.user_id)
                        if (!userData) return {}
                        return userData
                        
                    } catch (error) {
                        return {}
                    }
                })
            )
            return participants
        } catch (error){
            throw error
        }
    }

    //ang mu get kay ang participants
    async getRoomParticipantsForUser(room_id, user_id){
        try {
            // console.log('I am called in services')
            //verify if room exists
            const exist = await this.roomService.isRoomExist(room_id)
            if (!exist) throw new Error ('Room not found')
            //verify if currentuser is participant
            const isPart = await this.checkPartStatus(user_id, room_id)
            if (!isPart) throw new Error ('Not authorized')
            
            const data = await this.participantRepo.getAllParticipants(room_id)
        
            const participants = await Promise.all(
                data.map(async (participant) => {
                    try {
                        // Fetch user data from users table using user_id
                        const userData = await this.userService.getUserById(participant.user_id)
                        
                        // console.log('getRoomParticipants userData: ', userData)
                        if (!userData) {
                            // console.warn(`User not found for ID: ${participant.user_id}`)
                            return {}
                        }

                        return userData
                        
                    } catch (error) {
                        // console.warn(`Error fetching user ${participant.user_id}:`, error)
                        return {}
                    }
                })
            )
            // console.log('getRoomParticipants parts: ', participants)
            return participants
        } catch (error){
            // console.log('Error in getRoomParticipants service: ', error)
            throw error
        }
    }

    async checkPartStatus (user_id, room_id) {
        // console.log('i am calleed check part status ')
        try {
            return await this.participantRepo.isParticipant(user_id, room_id)
        } catch (error) {
            throw error
        }
    }

    async getTotalParticipants(room_id){
        try {
            return await this.participantRepo.getParticipantCount(room_id)
        } catch (error) {
            throw error
        }
    }

    async removeParticipant (creator, participant, room) {
        try {
            // verify if room exists
            const data = await this.roomService.getRoomById(room, creator)
            if (!data) throw new Error('Room not found or not authorized')

            return await this.participantRepo.removeParticipant(participant, room)
        } catch (error){
            throw error
        }
    }

    async getJoinedRooms(user_id) {
        try {
            const data = await this.participantRepo.getJoinedRooms(user_id)
            
            const rooms = await Promise.all(
                data.map(async (room) => {
                    try {
                        // Fetch user data from users table using user_id
                        const roomData = await this.roomService.getRoomsById(room.room_id)
                        
                        // console.log('getRoomParticipants userData: ', roomData)
                        if (!roomData) {
                            console.warn(`User not found for ID: ${room.room_id}`)
                            return null
                        }

                        return roomData
                        
                    } catch (error) {
                        console.warn(`Error fetching user ${room.room_id}:`, error)
                        return null
                    }
                })
            )
            
            return rooms
        } catch (error) {
            throw error
        }
    }

    async inviteByEmail(inviter, email, roomCode) {
        const subject = "You're invited to join a Polegion room!";
        const content = `Hi! ${inviter.name} (${inviter.email}) has invited you to join a room on Polegion.
Room Code: ${roomCode}
Join here: https://your-app-url/virtual-rooms/join/${roomCode}`;
        await Mailer.sendMail(email, subject, content, inviter.email);
    }
}

module.exports = ParticipantService