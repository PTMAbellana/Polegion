class AuthMiddleware {
    constructor(authService){
        this.authService = authService
    }

    protect = async ( req, res, next ) => {
        let token
    
        if (
            req.headers.authorization && 
            req.headers.authorization.startsWith('Bearer')
        ){
            try{
                token = req.headers.authorization.split(' ')[1]

                if (!token) {
                    return res.status(401).json({
                        error: 'Not authorized, token is empty'
                    })
                }
    
                const user = await this.authService.validateToken(token)

                if (!user) {
                    return res.status(401).json({
                        error: 'Not authorized, invalid token'
                    })
                }
    
                req.user = user
                req.token = token
    
                next()
            } catch (error) {
                console.error('Middleware error: ',error)
                
                // Check if the error is specifically about token expiration
                if (error.message === 'Token expired') {
                    return res.status(401).json({
                        error: 'Access token expired',
                        code: 'TOKEN_EXPIRED'
                    })
                }
                
                if (error.message === 'User not found') {
                    return res.status(401).json({
                        error: 'User not found',
                        code: 'USER_NOT_FOUND'
                    })
                }
                
                if (error.message && error.message.includes('Token validation failed')) {
                    return res.status(401).json({
                        error: 'Token validation failed',
                        code: 'TOKEN_INVALID',
                        details: error.message
                    })
                }
                
                if (error.code === 'UND_ERR_CONNECT_TIMEOUT') {
                    return res.status(503).json({
                        error: 'Authentication service temporarily unavailable'
                    })
                }
                
                return res.status(401).json({
                    error: 'Not authorized, token failed',
                    code: 'TOKEN_INVALID'
                })
            }
        } else res.status(401).json({
            error: 'Not authorized, no token'
        })
    }
}

module.exports = AuthMiddleware