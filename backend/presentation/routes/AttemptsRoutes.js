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
        
        //  ADD: The route that frontend is calling
        this.router.post('/submit', this.attemptsController.submitSolution);
    
        //  KEEP: Original route as backup
        // this.router.post(
        //     '/competitions/:competitionId/problems/:competitionProblemId/submit', 
        //     this.attemptsController.submitSolution
        // );
     }

    getRouter() {
        return this.router
    }
}

module.exports = AttemptsRoutes