const jwt = require('jsonwebtoken')
const supabase = require('../config/supabase')

const protect = async ( req, res, next ) => {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split(' ')[1]

            const { data, error } = await supabase.auth.getUser(token)

            if (error || !data.user) return res.status(401).json({
                error: 'Not authorized, invalid token'
            })

            req.user = data.user

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

module.exports = { protect }