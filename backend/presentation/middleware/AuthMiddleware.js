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
                
                if (error.message === 'User not found or token invalid') {
                    return res.status(401).json({
                        error: 'Not authorized, invalid token'
                    })
                }
                
                if (error.code === 'UND_ERR_CONNECT_TIMEOUT') {
                    return res.status(503).json({
                        error: 'Authentication service temporarily unavailable'
                    })
                }
                res.status(401).json({
                    error: 'Not authorized, token failed'
                })
            }
        } else res.status(401).json({
            error: 'Not authorized, no token'
        })
    }
}

module.exports = AuthMiddleware