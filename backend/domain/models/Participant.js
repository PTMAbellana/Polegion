class Participant {
    constructor(id, user = null, room = null){
        this.id = id
        this.user = user
        this.room = room
    }

    // Getter for backward compatibility
    get participant_id() {
        return this.id;
    }

    static fromDBParticipant(id, user, room){
        return new Participant(
            id,
            user || null,
            room || null
        )
    }

    static fromDBParticipantList(participantDataList){
        return participantDataList.map(participantData => Participant.fromDBParticipant(
            participantData.id,
            participantData.user_id || null,
            participantData.room_id || null
        ))
    }

    toDTO(){
        return {
            id: this.id,
            user: this.user,
            room: this.room
        }
    }

    toReturnRoomDTO(){
        return {
            id: this.room.id,
            title: this.room.title,
            description: this.room.description,
            mantra: this.room.mantra,
            banner_image: this.room.banner_image,
            code: this.room.code,
            participant_id: this.id,   
        }
    }       

    toReturnUserDTO(){
        return {
            participant_id: this.id,
            user_id: this.user.id,
            first_name: this.user.first_name || this.user.firstName,
            last_name: this.user.last_name || this.user.lastName,
            profile_pic: this.user.profile_pic,
            gender: this.user.gender
        }
    }
}

module.exports = Participant;