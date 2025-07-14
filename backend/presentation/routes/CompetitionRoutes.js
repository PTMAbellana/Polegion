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
     }

    getRouter() {
        return this.router
    }
}

module.exports = CompeRoutes