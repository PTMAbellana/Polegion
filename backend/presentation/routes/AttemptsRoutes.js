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
    
        this.router.post(
            '/competitions/:competitionId/problems/:competitionProblemId/submit', 
            this.attemptsController.submitSolution
        );
     }

    getRouter() {
        return this.router
    }
}

module.exports = AttemptsRoutes