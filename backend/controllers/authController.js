const supabase = require('../config/supabase')

const loginUser = async (req, res) => {
    const { email, password } = req.body

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (error) return res.status(400).json({
            error: error.message
        })

        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({
            error: 'Server error during login'
        })
    }
}

const registerUser = async (req, res) => {
    const { email, password, fullName, gender, phone } = req.body

    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                fullName, 
                gender,
                phone
            }
        })

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

const resetPassword = async (req, res) => {
    const { email } = req.body

    try {
        const { error } = await supabase.auth.resetPasswordForEmail(
            email,
            {
                redirectTo: `${req.headers.origin}/auth/reset-password`
            }
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

const logout = async (req, res) => {
    try {
        const { error } = await supabase.auth.signOut()
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

module.exports = {
    loginUser,
    registerUser,
    resetPassword,
    logout
}