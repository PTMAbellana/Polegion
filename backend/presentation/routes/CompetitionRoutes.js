const express = require('express');

class CompeRoutes {

    constructor (compeController, authMiddleware) {
        this.compeController = compeController
        this.authMiddleware = authMiddleware
        this.router = express.Router()
        this.initializeRoutes()
    }

    initializeRoutes(){
        this.router.use(this.authMiddleware.protect);
        this.router.post('/', this.compeController.addCompe);
        this.router.get('/:room_id', this.compeController.getAllCompe);
        this.router.get('/:room_id/:compe_id', this.compeController.getCompeById);
        
        // Competition control endpoints
        this.router.post('/:compe_id/start', this.compeController.startCompe);
        this.router.patch('/:compe_id/next', this.compeController.nextProblem);
        this.router.patch('/:compe_id/pause', this.compeController.pauseCompe);
        this.router.patch('/:compe_id/resume', this.compeController.resumeCompe);
        this.router.post('/:compe_id/auto-advance', this.compeController.autoAdvanceCompe);
     }

    getRouter() {
        return this.router
    }
}

module.exports = CompeRoutes