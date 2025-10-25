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
        console.log('Update profile endpoint hit', req.body);
        const { 
            first_name, 
            last_name, 
            gender, 
            phone 
        } = req.body
    
        try {
            const data = await this.userService.updateUserProfile({
                first_name,
                last_name,
                gender,
                phone,
                token: req.token
            })
            if (!data) 
                return res.status(400).json({ 
                    message: 'Update failed',
                    error: 'Bad request' 
                })

            return res.status(200).json({
                data: data,
                message: 'Profile updated successfully'
            })
        } catch (error) {
            if (error.status === 400)
                return res.status(400).json({ 
                    message: 'Update failed',
                    error: 'Bad request' 
                })
           
            if (error.status === 401)
                return res.status(401).json({
                    message: 'Unauthorized',
                    error: 'Invalid token'
                })

            return res.status(500).json({
                error: 'Server error updating user profile'
            })
        }
    }

    updateEmail = async (req, res) => {
        const { newEmail } = req.body

        try {
            await this.userService.updateEmail(newEmail, req.user.id)
            console.log('success')
            return res.status(200).json({
                message: 'Email updated successfully'
            })
        } catch (error) {
            console.log('akdjhasd', error);
            if (error.status === 400)
                return res.status(400).json({
                    message: 'Update email failed',
                    error: 'Bad request'
                })
            
            if (error.status === 401)
                return res.status(401).json({
                    message: 'Unauthorized',
                    error: 'Invalid token'
                })

            return res.status(500).json({
                error: 'Server error updating email'
            })
        }
    }
    
    updatePassword = async (req, res) => {
        const { newPassword } = req.body

        try {
            await this.userService.updatePassword(newPassword, req.user.id)
            return res.status(200).json({
                message: 'Password updated successfully'
            })

        } catch (error) {
            if (error.status === 400)
                return res.status(400).json({
                    message: 'Update password failed',
                    error: 'Bad request'
                })
            
            if (error.status === 401)
                return res.status(401).json({
                    message: 'Unauthorized',
                    error: 'Invalid token'
                })

            return res.status(500).json({
                message: 'Server error updating email',
                error: error.message
            })
        }
    }

    deactivateAccount = async (req, res) => {
        const duration = '876600h'
        try {
            await this.userService.updateUserBan(req.user.id, duration)
            return res.status(200).json({
                message: 'Account deactivated successfully'
            })
        } catch (error) {
            if (error.status === 401)
                return res.status(401).json({
                    message: 'Unauthorized',
                    error: 'Invalid token'
                })

            return res.status(500).json({
                message: 'Server error deactivating account',
                error: error.message
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
            
            if (!url) return res.status(400).json({ 
                message: 'Image upload failed',
                error: error.message 
            })
                        
            return res.status(200).json({ 
                data: {
                    imageUrl: url,
                    fileName: fileName
                },
                message: 'Image uploaded successfully'
             })
        } catch (error) {
            if (error.status === 400)
                return res.status(400).json({ 
                    message: 'Image upload failed',
                    error: error.message 
                })
           
            if (error.status === 401)
                return res.status(401).json({
                    message: 'Unauthorized',
                    error: 'Invalid token'
                })

            return res.status(500).json({
                message: 'Server error uploading image',
                error: error.message
            })
        }
    };
// Middleware getter for multer
    getUploadMiddleware() {
        return this.uploadMiddleware;
    }
}

module.exports = UserController