class UserController {
    constructor (userService){
        this.userService = userService
    }
    
    getUserProfile = async (req, res) => {
        try {
            const user = await this.userService.getUserProfile(req.token)
            res.status(200).json(user.toDTO())
        } catch (error) {
            res.status(500).json({
                error: 'Server error fethcing user profile'
            })
        }
    }
    
    updateUserProfile = async (req, res) => {
        const { fullName, gender, phone } = req.body
    
        try {
            const updateUser = await this.userService.updateUserProfile({
                fullName,
                gender,
                phone
            })
            return res.status(200).json(updateUser.toDTO())
        } catch (error) {
            res.status(500).json({
                error: 'Server error updating user profile'
            })
        }
    }
}

module.exports = UserController