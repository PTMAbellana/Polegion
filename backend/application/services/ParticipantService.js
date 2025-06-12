class ParticipantService {
    constructor(participantRepo, roomRepo, userRepo){
        this.participantRepo = participantRepo
        this.roomRepo = roomRepo
        this.userRepo = userRepo
    }

    async joinRoom(user_id, room_code){
        console.log('services called')
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
    async getRoomParticipants(room_id, creator_id){
        
        try {
            //verify if room exists
            const {
                data, error
            }  = await this.roomRepo.getRoomById(room_id, creator_id)

            if (error) throw error
            if (!data) throw new Error ('Room not found or not authorized')
            return await this.participantRepo.getAllParticipants(room_id)
        } catch (error){
            throw error
        }
    }

    async checkPartStatus (user_id, room_id) {
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
            const {
                data,
                error
            } = await this.roomRepo.getRoomById(room, creator)
            if (error) throw error
            if (!data) throw new Error('Room not found or not authorized')

            return await this.participantRepo.removeParticipant(participant, room)
        } catch (error){
            throw error
        }
    }

}

module.exports = ParticipantService