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
    
     }


    getRouter() {
        return this.router
    }
}

module.exports = CompeRoutes