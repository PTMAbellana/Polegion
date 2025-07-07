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
    
    this.router.post('/upload-banner',
      this.roomController.getUploadMiddleware(),
      this.roomController.uploadBannerImage
    )

    this.router.route('/')
        .get(this.roomController.getRooms)
        .post(this.roomController.createRoom);
    
    this.router.route('/id/:id')
        .get(this.roomController.getRoomById)
        .put(this.roomController.updateRoom)
        .delete(this.roomController.deleteRoom);
    
    this.router.route('/admin/code/:code')
      .get(this.roomController.getRoomByCode)
    
      this.router.route('/user/code/:code')
      .get(this.roomController.getRoomByCodeUsers)
    
    // this.router.post('/upload', this.roomController.uploadBannerImage);
  }

  getRouter(){
    return this.router
  }
  
}


module.exports = RoomRoutes