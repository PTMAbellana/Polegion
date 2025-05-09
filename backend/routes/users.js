const express = require('express')
const { protect } = require('../middleware/authMiddleware')
const { getUserProfile, updateUserProfile } = require('../controllers/userController')

const router = express.Router()

router.use(protect)

router.route('/profile')
.get(getUserProfile)
.put(updateUserProfile)

module.exports = router