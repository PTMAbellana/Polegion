class RoomController {
    constructor(roomService){
        this.roomService = roomService
    }
    
    // Get all rooms for a user
    getRooms = async (req, res) => {
        try {
            console.log('get roms get user ', req.user)
            console.log( 'getRooms ', req.user.id)
            const rooms = await this.roomService.getRooms(req.user.user.id)
            
            if (!rooms) return res.status(400).json({ error: error.message });
            
            res.status(200).json(
                rooms.map( room => room.toDTO() )
            );
        } catch (error) {
            res.status(500).json({ error: 'Server error fetching rooms' });
        }
    };
    
    // Get a single room
    getRoomById = async (req, res) => {
        console.log(typeof req.params.id)
        console.log(req.params.id)
        try {
            let room = await this.roomService.getRoomById(req.params.id, req.user.id)  
            
            if (!room) return res.status(404).json({ error: 'Room not found' });
            
            res.status(200).json(room.toDTO());
        } catch (error) {
            res.status(500).json({ error: 'Server error fetching room' });
        }
    };
    
    getRoomByCode = async (req, res) => {
        console.log(typeof req.params)
        console.log(req.params)
        console.log(req.user)
        try {
            let room = await this.roomService.getRoomByCode(req.params.code, req.user.id)  
                        
            if (!room) return res.status(404).json({ error: 'Room not found' });
            
            res.status(200).json(room.toDTO());
        } catch (error) {
            res.status(500).json({ error: 'Server error fetching room' });
        }
    };


    getAllRoomCodes = async (req, res) => {
        console.log('getAllRoomCodes called');
        console.log('Room codes requests ', req)
        console.log('Request method:', req.method);
        console.log('Request body:', req.body);
        console.log('Request query:', req.query);
        
        const { code } = req.body;
        
        if (!code) {
            console.log('No code provided in request body');
            return res.status(400).json({
                error: 'Room code is required'
            });
        }
        
        try {
            console.log(`Checking uniqueness for code: ${code}`);
            const codeExists = await this.roomService.getAllRoomCodes(code);
            console.log(`Code exists result: ${codeExists}`);
            
            if (codeExists) {
                return res.status(409).json({
                    error: 'Room code already exists',
                    unique: false
                });
            }
            
            return res.status(200).json({
                message: 'Room code is unique',
                unique: true
            });
        } catch (error) {
            console.error('Error checking room code:', error);
            console.error('Error stack:', error.stack);
            res.status(500).json({ error: 'Server error checking room code' });
        }
    }

    // getAllRoomCodes = async (req, res) => {
    //     const { code } = req.body
    //     try {
    //         const exist = await this.roomService.getAllRoomCodes(code)
    //         if (exist) return res.status(409).json({
    //             error: 'Room already exists'
    //         })
    //         return res.status(200).json({
    //             success: 'Room Code Unique'
    //         })
    //     } catch (error) {
    //         res.status(500).json({ error: 'Server error get all room code' });
    //     }
    // };
    
    // Create a room
    createRoom = async (req, res) => {
        console.log('create room request' , req)
        const { 
            title, 
            description, 
            mantra, 
            banner_image,
            code
        } = req.body;
        
        try {
            const room = await this.roomService.createRoom(
                title,
                description, 
                mantra, 
                banner_image, 
                req.user.id,
                code
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