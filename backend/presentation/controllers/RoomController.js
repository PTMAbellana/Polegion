const multer = require('multer')

//configure multer for memory storage
const storage = multer.memoryStorage()
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024  //10 mb file size
    },
    fileFilter: (req, file, cb) => {
        // Check if file is an image
        if (file.mimetype.startsWith('image/')) {
            cb(null, true)
        } else {
            cb(new Error('Only image files are allowed!'), false)
        }
    }
})

class RoomController {
    constructor(roomService){
        this.roomService = roomService
        this.uploadMiddleware = upload.single('image') // single file upload
    }
    
    // Get all rooms for a user
    getRooms = async (req, res) => {
        console.log(req.user)
        try {
            const rooms = await this.roomService.getRooms(req.user.id)
            
            if (!rooms) return res.status(400).json({ error: error.message })
            
            console.log('getRooms 1: ', rooms)
            console.log('getRooms 2: ', rooms.map( room => room.toDTO() ))

            res.status(200).json(
                rooms.map( room => room.toDTO() )
            );
        } catch (error) {
            res.status(500).json({ error: 'Server error fetching rooms' })
        }
    };
    
    // Get a single room
    getRoomById = async (req, res) => {
        console.log(typeof req.params.id)
        console.log(req.params.id)
        try {
            let room = await this.roomService.getRoomById(req.params.id, req.user.id)  
            
            if (!room) return res.status(404).json({ error: 'Room not found' })
            
            res.status(200).json(room.toDTO())
        } catch (error) {
            res.status(500).json({ error: 'Server error fetching room' })
        }
    };
    
    getRoomByCode = async (req, res) => {
        console.log(typeof req.params)
        console.log(req.params)
        console.log(req.user)
        try {
            let room = await this.roomService.getRoomByCode(req.params.code, req.user.id)  
                        
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
            code
        } = req.body
        
        try {
            const room = await this.roomService.createRoom(
                title,
                description, 
                mantra, 
                banner_image, //url from the previous upload
                req.user.id,
                code
            )
            
            if (!room) return res.status(400).json({ error: error.message })
            
            res.status(201).json(room.toDTO());
        } catch (error) {
            res.status(500).json({ error: 'Server error creating room' })
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
            
            if (!room) return res.status(400).json({ error: error.message })
            res.status(200).json(room.toDTO())
        } catch (error) {
            console.error('Error updating room:', error)
            if (error.message === 'Room not found or not authorized') return res.status(404).json({ error: 'Room not found or not authorized' })
            res.status(500).json({ error: 'Server error updating room' })
        }
    };
    
    // Delete a room
    deleteRoom = async (req, res) => {
        try {
            await this.roomService.deleteRoom(req.params.id, req.user.id)
            
            res.status(200).json({ message: 'Room deleted successfully' })
        } catch (error) {
            res.status(500).json({ error: 'Server error deleting room' })
        }
    };
    
    // Handle file uploads for banner images
    uploadBannerImage = async (req, res) => {
        try {
            console.log('Upload endpoint hit')
            console.log('File received:', req.file ? req.file.originalname : 'No file')

            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' })
            }
            
            const file = req.file
            const fileExtension = file.originalname.split('.').pop()
            const fileName = `${Date.now()}.${fileExtension}`

            console.log('Uploading file:', fileName)
        
            // This implementation will depend on how you handle file uploads
            // You might need to use multer or another library
            const url = await this.roomService.uploadBannerImage(
                file.buffer,
                fileName,
                file.mimetype
            )

            console.log('Image uploaded successfully:', url)
            
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

module.exports = RoomController