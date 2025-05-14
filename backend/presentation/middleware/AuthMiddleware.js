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
    
                const user = await this.authService.validateToken(token)
    
                req.user = user
                req.token = token
    
                next()
            } catch (error) {
                console.error(error)
                res.status(401).json({
                    error: 'Not authorized, token failed'
                })
            }
        }
    
        if (!token) res.status(401).json({
            error: 'Not authorized, no token'
        })
    }
}

module.exports = AuthMiddleware