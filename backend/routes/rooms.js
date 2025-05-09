const express = require('express');
const { 
  getRooms, 
  getRoom, 
  createRoom, 
  updateRoom, 
  deleteRoom,
  uploadBannerImage
} = require('../controllers/roomController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // All room routes require authentication

router.route('/')
    .get(getRooms)
    .post(createRoom);

router.route('/:id')
    .get(getRoom)
    .put(updateRoom)
    .delete(deleteRoom);

router.post('/upload', uploadBannerImage);

module.exports = router;