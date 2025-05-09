const supabase = require('../config/supabase')

const getUserProfile = async (req, res) => {
    try {
        res.status(200).json({
            id: req.user.id,
            email: req.user.email,
            name: req.user.user_metadata.fullName,
            gender: req.user.user_metadata.gender,
            phone: req.user.user_metadata.phone,
        })
    } catch (error) {
        res.status(500).json({
            error: 'Server error fethcing user profile'
        })
    }
}

const updateUserProfile = async (req, res) => {
    const { fullName, gender, phone } = req.body

    try {
        const { data, user } = await supabase.auth.updateUser({
            data: {
                fullName,
                gender,
                phone
            }
        })

        if (error) return res.status(400).json({
            error: error.message
        })
        return res.status(200).json(data)
    } catch (error) {
        res.status(500).json({
            error: 'Server error updating user profile'
        })
    }
}

module.exports = {
    getUserProfile,
    updateUserProfile
}