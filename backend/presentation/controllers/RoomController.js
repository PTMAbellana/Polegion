const upload = require('../middleware/ImageMiddleware')

class RoomController {
    constructor(roomService){
        this.roomService = roomService
        this.uploadMiddleware = upload.single('image') // single file upload
    }
    
    // Get all rooms for a user
    getRooms = async (req, res) => {
        // console.log(req.user)
        try {
            const rooms = await this.roomService.getRooms(req.user.id)
            
            if (!rooms) 
                return res.status(400).json({ 
                    message: 'No rooms found',
                    error: error.message 
            })
            
            return res.status(200).json({
                message: 'Rooms fetched successfully',
                data: rooms.map( room => room.toDTO() )
            });
        } catch (error) {
            if (error.status === 400)
                return res.status(400).json({ 
                    message: 'No rooms found',
                    error: error.message 
            })
              
            if (error.status === 401)
                return res.status(401).json({
                    message: 'Unauthorized',
                    error: 'Unauthorized'
            })
            return res.status(500).json({ 
                message: 'Server error fetching rooms',
                error: error.message
            })
        }
    };
    
    // Get a single room
    getRoomById = async (req, res) => {
        // console.log(typeof req.params.id)
        // console.log(req.params.id)
        try {
            let room = await this.roomService.getRoomById(req.params.id, req.user.id)  
            
            if (!room) return res.status(404).json({ error: 'Room not found' })
            
            res.status(200).json(room.toDTO())
        } catch (error) {
            res.status(500).json({ error: 'Server error fetching room' })
        }
    };
    
    // for admin
    getRoomByCode = async (req, res) => {
        // console.log(typeof req.params)
        // console.log(req.params)
        // console.log(req.user)
        try {
            let room = await this.roomService.getRoomByCode(req.params.code, req.user.id)  
                        
            if (!room) return res.status(404).json({ error: 'Room not found' })
            
            res.status(200).json(room.toDTO())
        } catch (error) {
            res.status(500).json({ error: 'Server error fetching room' })
        }
    }
    
    // for participants
    getRoomByCodeUsers = async (req, res) => {
        try {
            let room = await this.roomService.getRoomByCodeUsers(req.params.code)  
                        
            if (!room) return res.status(404).json({ error: 'Room not found' })
            
            res.status(200).json(room.toDTO())
        } catch (error) {
            res.status(500).json({ error: 'Server error fetching room' })
        }
    }
    
    // Create a room
    createRoom = async (req, res) => {
        const { 
            title, 
            description, 
            mantra, 
            banner_image, 
            visibility
        } = req.body
        
        try {
            const room = await this.roomService.createRoom(
                title,
                description, 
                mantra, 
                banner_image, //url from the previous upload
                req.user.id,
                visibility,
            )
            
            if (!room) 
                return res.status(400).json({ 
                    message: 'Room creation failed',
                    error: error.message 
                })
            
            return res.status(201).json({
                message: 'Room created successfully',
                data: room.toDTO()
            });
        } catch (error) {
            if (error.status === 400)
                return res.status(400).json({ 
                    message: 'Room creation failed',
                    error: error.message 
                })
              
            if (error.status === 401)
                return res.status(401).json({
                    message: 'Unauthorized',
                    error: 'Unauthorized'
            })
            return res.status(500).json({
                message: 'Server error creating room',
                error: error.message
            });
        }
    };
    
    // Update a room
    updateRoom = async (req, res) => {
        const { 
            title, 
            description, 
            mantra, 
            banner_image
        } = req.body
        
        try {
            const room = await this.roomService.updateRoom(
                req.params.id,
                title,
                description, 
                mantra, 
                banner_image,
                req.user.id
            )
            
            if (!room) 
                return res.status(400).json({ 
                    message: 'Room update failed',
                    error: error.message 
                })
            return res.status(200).json({
                message: 'Room updated successfully',
                data: room.toDTO()
            })
        } catch (error) {
            // console.error('Error updating room:', error)
            if (error.message === 'Room not found or not authorized') 
                return res.status(404).json({ 
                    message: 'Room update failed',
                    error: 'Room not found or not authorized'
                })

            if (error.status === 401)
                return res.status(401).json({
                    message: 'Unauthorized',
                    error: 'Unauthorized'
                })

            return res.status(500).json({
                message: 'Server error updating room',
                error: error.message 
            })
        }
    };
    
    // Delete a room
    deleteRoom = async (req, res) => {
        try {
            console.log('Deleting room with ID:', req.params.id);
            await this.roomService.deleteRoom(req.params.id, req.user.id)
            
            return res.status(200).json({ 
                message: 'Room deleted successfully' 
            })
        } catch (error) {
            if (error.message === 'Room not found') 
                return res.status(404).json({ 
                    message: 'Room deletion failed',
                    error: 'Room not found or not authorized' 
            })

            if (error.status === 401)
                return res.status(401).json({ 
                    message: 'Unauthorized',
                    error: 'Unauthorized' 
            })
            return res.status(500).json({ 
                message: 'Server error deleting room',
                error: error.message 
            })
        }
    };
    
    // Handle file uploads for banner images
    uploadBannerImage = async (req, res) => {
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
            const url = await this.roomService.uploadBannerImage(
                file.buffer,
                fileName,
                file.mimetype
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

    changeVisibility = async (req, res) => {
        try {
            const {
                room_id, visibility
            } = req.body

            await this.roomService.updateVisibility(room_id, req.user.id, visibility)
            res.status(201).json({
                message: 'Successfully change room visibility'
            })
        } catch (error) {
            res.status(500).json({
                error: 'Server error change room visibility'
            })
        }
    }

    // Middleware getter for multer
    getUploadMiddleware() {
        return this.uploadMiddleware;
    }
}

module.exports = RoomController