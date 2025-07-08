const express = require('express');

class LeaderboardRoutes {

    constructor (leaderController, authMiddleware) {
        this.leaderController = leaderController
        this.authMiddleware = authMiddleware
        this.router = express.Router()
        this.initializeRoutes()
    }
  
    initializeRoutes(){
        this.router.use(this.authMiddleware.protect); // All room routes require authentication
    
        this.router.get('/room/:room_id', this.leaderController.getRoomBoard)
        this.router.get('/competition/:room_id', this.leaderController.getCompeBoard)
    }
    
    getRouter(){
        return this.router
    }
}

module.exports = LeaderboardRoutes