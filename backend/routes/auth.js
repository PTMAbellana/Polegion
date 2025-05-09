const express = require('express')
const { 
    loginUser,
    registerUser,
    resetPassword,
    logout
} = require('../controllers/authController')

const router = express.Router()

router.post('/login', loginUser)
router.post('/register', registerUser)
router.post('/reset-password', resetPassword)
router.post('/logout', logout)

module.exports = router