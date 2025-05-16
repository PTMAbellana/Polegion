class AuthController {
    constructor (authService) {
        this.authService = authService
    }

    refreshToken = async (req, res) => {
        const { refresh_token } = req.body

        if (!refresh_token)
            return res.status(400).json({
                error: 'Refresh token is required'
            })

        try {
            const data = await this.authService.refreshToken(refresh_token)
            return res.status(200).json(data)
        } catch (error) {
            return res.status(401).json({
                error: 'Invalid or expired refresh token'
            })
        }
    }

    loginUser = async (req, res) => {
        console.log('auth controller')
        console.log(req.body)
        const { email, password } = req.body
    
        try {
            const data = await this.authService.login(email, password)
    
            if (!data) res.status(400).json({
                error: error.message
            })
    
            res.status(200).json(data)
        } catch (error) {
            res.status(500).json({
                error: 'Server error during login'
            })
        }
    }
    
    registerUser = async (req, res) => {
        console.log(req.body)

        const { 
            email, 
            password, 
            fullName, 
            gender, 
            phone 
        } = req.body
    
        try {
            const data = await this.authService.register(
                email,
                password,
                fullName, 
                gender,
                phone
            )

            console.log(data)
    
            if (!data) return res.status(400).json({
                error: error.message
            })
            return res.status(201).json(data)
        } catch (error) {
            res.status(500).json({
                error: 'Server error during registration'
            })
        }
    }
    
    resetPassword = async (req, res) => {
        const { email } = req.body
    
        try {
            await this.authService.resetPassword(
                email,
                `${req.headers.origin}/auth/reset-password`
            )
    
            return res.status(200).json({
                message: 'Password reset email sent'
            })
        } catch (error) {
            return res.status(500).json({
                error: 'Server error during password reset'
            })
        }
    }
    
    logout = async (req, res) => {
        try {
            await this.authService.logout()
            return res.status(200).json({
                message: 'Logout successfully'
            })
        } catch (error) {
            return res.status(500).json({
                error: 'Server error during logout'
            })
        }
    }

    resetPasswordConfirm = async (req, res) => {

        // Extract token from query parameters or body
        let token;
        
        // Get token from URL query parameters if it exists there
        if (req.query && req.query.token) {
            token = req.query.token;
        } 
        // Otherwise get it from request body
        else if (req.body && req.body.token) {
            token = req.body.token;
        }
        
        const { password } = req.body;

        if (!token || !password) {
            return res.status(400).json({
                error: 'Token and new password are required'
            });
        }

        try {
            const result = await this.authService.resetPasswordWithToken(token, password);
            
            return res.status(200).json({
                message: 'Password reset successfully'
            });
        } catch (error) {
            console.error('Password reset error in controller:', error);
            
            return res.status(401).json({
                error: 'Invalid or expired reset token'
            });
        }

        // console.error('req', req)
        // console.error('res', res)
        // const { token, password } = req.body

        // if (!token || !password) {
        //     return res.status(400).json({
        //         error: 'Token and new password are required'
        //     })
        // }

        // try {
        //     const result = await this.authService.resetPasswordWithToken(token, password)
        //     console.log('result ', result)
        //     return res.status(200).json({
        //         message: 'Password reset successfully'
        //     })
        // } catch (error) {
        //     console.error(error)
        //     return res.status(401).json({
        //         error: 'Invalid or expired reset token'
        //     })
        // }
    }
}


module.exports = AuthController