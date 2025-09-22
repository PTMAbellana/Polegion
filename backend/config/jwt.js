const jwt = require('jsonwebtoken')
require('dotenv').config()

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30d'

class JwtConfig {
    static generateToken (payload){
        return jwt.sign(payload, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN
        })
    }

    static verifyToken(token) {
        try {
            return jwt.verify(token, JWT_SECRET)
        } catch (error) {
            throw new Error('Invalid token')
        }
    }
}

module.exports = JwtConfig