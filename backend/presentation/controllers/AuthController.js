class AuthController {
    constructor (authService) {
        this.authService = authService
    }

    refreshToken = async (req, res) => {
        const { refresh_token } = req.body;
        if (!refresh_token)
            return res.status(400).json({ error: 'Refresh token is required' });

        try {
            const data = await this.authService.refreshToken(refresh_token);
            // Log the data for debugging
            console.log('Refresh session data:', data);
            if (!data || !data.session) {
                return res.status(401).json({ error: 'No session returned from Supabase' });
            }
            // Return the session object in the expected format
            return res.status(200).json({ session: data.session });
        } catch (error) {
            // Log the error for debugging
            console.error('Refresh token error:', error);
            return res.status(401).json({ error: 'Invalid or expired refresh token', details: error.message });
        }
    }

    loginUser = async (req, res) => {
        // console.log('auth controller')
        // console.log(req.body)
        const { email, password } = req.body
    
        try {
            const data = await this.authService.login(email, password)
    
            if (!data) res.status(400).json({
                error: error.message
            })

            console.log(data)
    
            res.status(200).json(data)
        } catch (error) {
            // console.log(error.code)
            // res.status(error.status).json({
            //     error: error.code
            // })
            if (error.status === 400)
            res.status(400).json({
                error: 'Invalid credentials'
            })
            else
            res.status(500).json({
                error: 'Server error during login'
            })
        }
    }
    
    registerUser = async (req, res) => {
        // console.log(req.body)
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
    
            if (!data) return res.status(400).json({
                error: error.message
            })
            return res.status(201).json(data)
        } catch (error) {
            if (error.status === 422) 
            res.status(422).json({
                error: 'Email already exist'
            })
            else 
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