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
            console.log('Session exists:', !!data?.session);
            console.log('Session access token exists:', !!data?.session?.access_token);
            
            // The data object contains the session directly
            if (!data || !data.session || !data.session.access_token) {
                console.log('Invalid session data structure:', {
                    hasData: !!data,
                    hasSession: !!data?.session,
                    hasAccessToken: !!data?.session?.access_token
                });
                return res.status(401).json({ error: 'No valid session returned from Supabase' });
            }
            
            // Return the session object in the expected format
            return res.status(200).json({ 
                session: data.session,
                user: data.user || data.session.user 
            });
        } catch (error) {
            // Log the error for debugging
            console.error('Refresh token error:', error);
            return res.status(401).json({ error: 'Invalid or expired refresh token', details: error.message });
        }
    }

    loginUser = async (req, res) => {
        const { email, password } = req.body
        try {
            const data = await this.authService.login(email, password)
    
            if (!data) 
                return res.status(400).json({
                    message: 'Login failed',
                    error: 'No data returned'
                })

            res.status(200).json({
                message: 'Login successful',
                data: data
            })
        } catch (error) {
            if (error.status === 400)
                return res.status(400).json({
                    message: 'Invalid credentials',
                    error: 'Email or password is incorrect'
                })
            
            return res.status(500).json({
                message: 'Server error during login',
                error: error.message // as is ka jan kay internal server error ka rar
            })
        }
    }
    
    registerUser = async (req, res) => {
        // console.log(req.body)
        const { 
            email, 
            password, 
            firstName, 
            lastName,
            gender, 
            phone,
            role 
        } = req.body
    
        try {
            const data = await this.authService.register(
                email,
                password,
                {
                    firstName,
                    lastName,
                    gender,
                    phone,
                    role
                }
            )
    
            if (!data) return res.status(400).json({
                message: 'Registration failed',
                error: 'No data returned'
            })

            return res.status(201).json({
                message: 'Registration successful',
                data: data
            })
        } catch (error) {
            if (error.status === 422)  //unprocessed man ni sha, so tanawn nato nganu
                return res.status(422).json({
                    message: 'Registration failed', 
                    error: error.message
                });
            if (error.status === 409)
                return res.status(409).json({
                    message: 'User already exists',
                    error: 'Email already exist'
                })
            return res.status(500).json({
                message: 'Server error during registration',
                error: error.message
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