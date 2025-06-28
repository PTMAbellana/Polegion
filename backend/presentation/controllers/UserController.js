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
                phone,
                token: req.token
            })
            return res.status(200).json(updateUser.toDTO())
        } catch (error) {
            res.status(500).json({
                error: 'Server error updating user profile'
            })
        }
    }

    updateEmail = async (req, res) => {
        console.log(req.body)
        const { newEmail } = req.body

        console.log(req.user.id)

        try {
            const data = await this.userService.updateEmail(newEmail, req.user.id)
            console.log(data)
            return res.status(200).json(data.toDTO())
        } catch (error) {
            console.error(error)
            res.status(500).json({
                error: 'Server error updating email'
            })
        }
    }
    
    updatePassword = async (req, res) => {
        const { newPassword } = req.body

        try {
            const data = await this.userService.updatePassword(newPassword, req.user.id)
            return res.status(200).json(data.toDTO())
        } catch (error) {
            res.status(500).json({
                error: 'Server error updating email'
            })
        }
    }

    // will get back at you
    deactivateAccount = async (req, res) => {
        const duration = '876600h'
        try {
            const data = await this.userService.updateUserBan(req.user.id, duration)
            return res.status(200).json(data)
        } catch (error) {
            res.status(500).json({
                error: 'Server error deactivating account'
            })
        }
    }

}

module.exports = UserController