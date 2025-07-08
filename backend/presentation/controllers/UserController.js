const upload = require('../middleware/ImageMiddleware')
class UserController {
    constructor (userService){
        this.userService = userService
        this.uploadMiddleware = upload.single('image')
    }
    
    getUserProfile = async (req, res) => {
        try {
            const user = await this.userService.getUserProfile(req.token)
            const image = await this.userService.getProfilePicture(req.user.id)
            
            res.status(200).json({
                ...user.toDTO(), 
                profile_pic: image?.profile_pic
            })
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
        const { newEmail } = req.body

        try {
            const data = await this.userService.updateEmail(newEmail, req.user.id)
            return res.status(200).json(data.toDTO())
        } catch (error) {
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
    uploadProfileImage = async (req, res) => {
        try {
            // console.log('Upload endpoint hit')
            // console.log('File received:', req.file ? req.file.originalname : 'No file')

            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' })
            }
            
            const file = req.file
            const fileExtension = file.originalname.split('.').pop()
            const fileName = `${Date.now()}.${fileExtension}`

            // console.log('Uploading file:', fileName)
        
            // This implementation will depend on how you handle file uploads
            // You might need to use multer or another library
            const url = await this.userService.uploadProfileImage(
                file.buffer,
                fileName,
                file.mimetype,
                req.user.id
            )

            // console.log('Image uploaded successfully:', url)
            
            if (!url) return res.status(400).json({ error: error.message })
                        
            res.status(200).json({ 
                data: {
                        imageUrl: url,
                        fileName: fileName
                },
                message: 'Image uploaded successfully'
             })
        } catch (error) {
            console.error('Error uploading image:', error)
            res.status(500).json({ error: 'Server error uploading image' })
        }
    };
// Middleware getter for multer
    getUploadMiddleware() {
        return this.uploadMiddleware;
    }
}

module.exports = UserController