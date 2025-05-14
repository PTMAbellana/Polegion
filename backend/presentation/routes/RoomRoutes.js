const express = require('express');

class RoomRoutes {

  constructor (roomController, authMiddleware) {
    this.roomController = roomController
    this.authMiddleware = authMiddleware
    this.router = express.Router()
    this.initializeRoutes()
  }
  
  initializeRoutes(){
    this.router.use(this.authMiddleware.protect); // All room routes require authentication
    
    this.router.route('/')
        .get(this.roomController.getRooms)
        .post(this.roomController.createRoom);
    
    this.router.route('/:id')
        .get(this.roomController.getRoom)
        .put(this.roomController.updateRoom)
        .delete(this.roomController.deleteRoom);
    
    this.router.post('/upload', this.roomController.uploadBannerImage);
  }

  getRouter(){
    return this.router
  }
  
}


module.exports = RoomRoutes