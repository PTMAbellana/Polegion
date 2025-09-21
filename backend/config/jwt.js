const jwt = require('jsonwebtoken')
const cacheService = require('./cache')

class JWTService {
  constructor() {
    this.secret = process.env.JWT_SECRET
    this.refreshSecret = process.env.JWT_REFRESH_SECRET
    this.expiresIn = process.env.JWT_EXPIRES_IN || '15m'
    this.refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  }

  generateTokens(payload) {
    const accessToken = jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn,
    })

    const refreshToken = jwt.sign(payload, this.refreshSecret, {
      expiresIn: this.refreshExpiresIn,
    })

    return { accessToken, refreshToken }
  }

  verifyAccessToken(token) {
    try {
      return jwt.verify(token, this.secret)
    } catch (error) {
      throw new Error('Invalid access token')
    }
  }

  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, this.refreshSecret)
    } catch (error) {
      throw new Error('Invalid refresh token')
    }
  }

  async blacklistToken(token) {
    try {
      const decoded = jwt.decode(token)
      if (decoded && decoded.exp) {
        const ttl = decoded.exp - Math.floor(Date.now() / 1000)
        if (ttl > 0) {
          await cacheService.set(`blacklist_${token}`, true, ttl)
        }
      }
    } catch (error) {
      console.error('Error blacklisting token:', error)
    }
  }

  async isTokenBlacklisted(token) {
    try {
      const isBlacklisted = await cacheService.get(`blacklist_${token}`)
      return !!isBlacklisted
    } catch (error) {
      console.error('Error checking token blacklist:', error)
      return false
    }
  }
}

module.exports = new JWTService()