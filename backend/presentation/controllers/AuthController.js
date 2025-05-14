class AuthController {
    constructor (authService) {
        this.authService = authService
    }

    loginUser = async (req, res) => {
        const { email, password } = req.body
    
        try {
            const data = await this.authService.login(email, password)
    
            if (error) res.status(400).json({
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
    
            if (error) return res.status(400).json({
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
    
            if (error) return res.status(400).json({
                error: error.message
            })
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
            if (error) return res.json({
                error: error.message
            })
            return res.status(200).json({
                message: 'Logout successfully'
            })
        } catch (error) {
            return res.status(500).json({
                error: 'Server error during logout'
            })
        }
    }
}


module.exports = AuthController