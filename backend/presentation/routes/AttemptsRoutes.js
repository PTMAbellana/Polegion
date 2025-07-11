const express = require('express');

class AttemptsRoutes {

    constructor (attemptsController, authMiddleware) {
        this.attemptsController = attemptsController
        this.authMiddleware = authMiddleware
        this.router = express.Router()
        this.initializeRoutes()
    }

    initializeRoutes(){
        this.router.use(this.authMiddleware.protect);
    
     }

    getRouter() {
        return this.router
    }
}

module.exports = AttemptsRoutes