const express = require('express')

class AuthRoutes {
    constructor(authController){
        this.authController = authController
        this.router = express.Router()
        this.initializeRoutes()
    }    
    
    initializeRoutes(){
        this.router.post('/login', this.authController.loginUser)
        this.router.post('/register', this.authController.registerUser)
        this.router.post('/reset-password', this.authController.resetPassword)
        this.router.post('/logout', this.authController.logout)
    }

    getRouter() {
        return this.router
    }
    
}


module.exports = AuthRoutes