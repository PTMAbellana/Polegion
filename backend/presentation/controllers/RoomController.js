class RoomController {
    constructor(roomService){
        this.roomService = roomService
    }
    
    // Get all rooms for a user
    getRooms = async (req, res) => {
        try {
            const rooms = await this.roomService.getRooms(req.user.id)
            
            if (!rooms) return res.status(400).json({ error: error.message });
            
            res.status(200).json(
                rooms.map( room => room.toDTO() )
            );
        } catch (error) {
            res.status(500).json({ error: 'Server error fetching rooms' });
        }
    };
    
    // Get a single room
    getRoom = async (req, res) => {
        try {
            const room = await this.roomService.getRoom(req.params.id, req.user.id)
                        
            if (!room) return res.status(404).json({ error: 'Room not found' });
            
            res.status(200).json(room.toDTO());
        } catch (error) {
            res.status(500).json({ error: 'Server error fetching room' });
        }
    };
    
    // Create a room
    createRoom = async (req, res) => {
        const { 
            title, 
            description, 
            mantra, 
            banner_image 
        } = req.body;
        
        try {
            const room = await this.roomService.createRoom(
                title,
                description, 
                mantra, 
                banner_image, 
                req.user.id
            )
            
            if (!room) return res.status(400).json({ error: error.message });
            
            res.status(201).json(room.toDTO());
        } catch (error) {
            res.status(500).json({ error: 'Server error creating room' });
        }
    };
    
    // Update a room
    updateRoom = async (req, res) => {
        const { 
            title, 
            description, 
            mantra, 
            banner_image 
        } = req.body;
        
        try {
            const room = await this.roomService.updateRoom(
                req.params.id,
                title,
                description, 
                mantra, 
                banner_image,
                req.user.id
            )
            
            if (!room) return res.status(400).json({ error: error.message });
            res.status(200).json(room.toDTO());
        } catch (error) {
            if (error.message === 'Room not found or not authorized') return res.status(404).json({ error: 'Room not found or not authorized' });
            res.status(500).json({ error: 'Server error updating room' });
        }
    };
    
    // Delete a room
    deleteRoom = async (req, res) => {
        try {
            await this.roomService.deleteRoom(req.params.id, req.user.id)
            
            res.status(200).json({ message: 'Room deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Server error deleting room' });
        }
    };
    
    // Handle file uploads for banner images
    uploadBannerImage = async (req, res) => {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        
        const file = req.file;
        const fileExtension = file.originalname.split('.').pop();
        const fileName = `${Date.now()}.${fileExtension}`;
        
        try {
            // This implementation will depend on how you handle file uploads
            // You might need to use multer or another library
            const url = await this.roomService.uploadBannerImage(
                file.buffer,
                fileName,
                file.mimetype
            )
            
            if (!url) return res.status(400).json({ error: error.message });
                        
            res.status(200).json({ url });
        } catch (error) {
            res.status(500).json({ error: 'Server error uploading image' });
        }
    };
}

module.exports = RoomController