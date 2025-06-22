const express = require('express')

class ParticipantRoutes {
    constructor(participantController, authMiddleware) {
        this.participantController = participantController
        this.authMiddleware = authMiddleware
        this.router = express.Router()
        this.initializeRoutes()
    }

    initializeRoutes() {
        this.router.use(this.authMiddleware.protect)

        this.router.post('/join', this.participantController.joinRoom)
        this.router.delete('/leave/:room_id', this.participantController.joinRoom)
        this.router.get('/status/:room_id', this.participantController.checkParticipantStatus)
        this.router.get('count/:room_id', this.participantController.getRoomParticipantCount)
        this.router.get('/all/:room_id', this.participantController.getRoomParticipants)
        this.router.delete('/room/:room_id/participant/:user_id', this.participantController.removeParticipant)
        this.router.get('/joined', this.participantController.joinedRooms)
    }
    
    getRouter(){
        return this.router
    }
}

module.exports = ParticipantRoutes