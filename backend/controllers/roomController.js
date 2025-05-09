const supabase = require('../config/supabase');

// Get all rooms for a user
const getRooms = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('rooms')
            .select('*')
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false });
        
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Server error fetching rooms' });
    }
};

// Get a single room
const getRoom = async (req, res) => {
    try {
        const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', req.params.id)
        .eq('user_id', req.user.id)
        .single();
        
        if (error) {
        return res.status(400).json({ error: error.message });
        }
        
        if (!data) {
        return res.status(404).json({ error: 'Room not found' });
        }
        
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Server error fetching room' });
    }
};

// Create a room
const createRoom = async (req, res) => {
    const { title, description, mantra, banner_image } = req.body;
    
    try {
        const { data, error } = await supabase
        .from('rooms')
        .insert({
            title,
            description,
            mantra,
            banner_image,
            user_id: req.user.id
        })
        .select();
        
        if (error) {
        return res.status(400).json({ error: error.message });
        }
        
        res.status(201).json(data[0]);
    } catch (error) {
        res.status(500).json({ error: 'Server error creating room' });
    }
};

// Update a room
const updateRoom = async (req, res) => {
    const { title, description, mantra, banner_image } = req.body;
    
    try {
        const { data, error } = await supabase
        .from('rooms')
        .update({
            title,
            description,
            mantra,
            banner_image
        })
        .eq('id', req.params.id)
        .eq('user_id', req.user.id)
        .select();
        
        if (error) {
        return res.status(400).json({ error: error.message });
        }
        
        if (data.length === 0) {
        return res.status(404).json({ error: 'Room not found or not authorized' });
        }
        
        res.status(200).json(data[0]);
    } catch (error) {
        res.status(500).json({ error: 'Server error updating room' });
    }
};

// Delete a room
const deleteRoom = async (req, res) => {
    try {
        const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', req.params.id)
        .eq('user_id', req.user.id);
        
        if (error) {
        return res.status(400).json({ error: error.message });
        }
        
        res.status(200).json({ message: 'Room deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error deleting room' });
    }
};

// Handle file uploads for banner images
const uploadBannerImage = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const file = req.file;
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${Date.now()}.${fileExtension}`;
    
    try {
        // This implementation will depend on how you handle file uploads
        // You might need to use multer or another library
        const { data, error } = await supabase.storage
        .from('room-images')
        .upload(fileName, file.buffer, {
            contentType: file.mimetype
        });
        
        if (error) {
        return res.status(400).json({ error: error.message });
        }
        
        const publicUrl = supabase.storage
        .from('room-images')
        .getPublicUrl(fileName).data.publicUrl;
        
        res.status(200).json({ url: publicUrl });
    } catch (error) {
        res.status(500).json({ error: 'Server error uploading image' });
    }
};

module.exports = {
    getRooms,
    getRoom,
    createRoom,
    updateRoom,
    deleteRoom,
    uploadBannerImage
};