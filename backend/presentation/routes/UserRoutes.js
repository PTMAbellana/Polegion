const express = require('express')

class UserRoutes {
    constructor (userController, authMiddleware){
        this.userController = userController
        this.authMiddleware = authMiddleware
        this.router = express.Router()
        this.initializeRoutes()
    }
    
    initializeRoutes(){
        this.router.use(this.authMiddleware.protect)
        
        this.router.route('/profile')
        .get(this.userController.getUserProfile)
        .put(this.userController.updateUserProfile)
    }

    getRouter(){
        return this.router
    }
}

module.exports = UserRoutes