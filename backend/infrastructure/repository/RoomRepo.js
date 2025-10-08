const BaseRepo = require('./BaseRepo')
const roomModel = require('../../domain/models/Room')

class RoomRepo extends BaseRepo {
    constructor(supabase){
        super(supabase)
        this.tableName = 'rooms'
        this.storageBucket = 'room-images'
    }

    async getAllRooms(user_id){
        try {
            // console.log('Fetching rooms for user: ', user_id)
            const {
                data,
                error
            } = await this.supabase.from(this.tableName)
            .select('*')
            .eq('user_id', user_id)
            .order('created_at', { ascending: false } )

            // console.log('room data ', data)

            if (error) throw error
            if (!data) {
                // console.log('No rooms returned from supabase')
                return []
            }
            const rooms = data.map(room => {
                // console.log('Processing room:', room)
                return roomModel.fromDbRoom(room).toDTO()
            })

            // console.log('Processed rooms:', rooms);
            return rooms
            // return data.map( room => roomModel.fromDbRoom(room) )
        } catch (error) {
            throw error
        }
    }

    async getRoomsById(room_id){
        try { 
            const {
                data,
                error
            } = await this.supabase.from(this.tableName)
            .select('*')
            .eq('id', room_id)
            .order('created_at', { ascending: false } )
            .single()

            if (error) throw error
            if (!data || data.length === 0) {
                throw new Error('Room not found')
            }

            // const rooms = data.map(room => {
            //     // console.log('Processing room:', room)
            //     return roomModel.fromDbRoom(room)
            // })
            // // console.log('Processed rooms:', rooms);
            // return rooms 
            return roomModel.fromDbRoom(data)
        } catch (error) {
            throw error
        }
    }
    
    async getRoomById(roomId, user_id){
        try {
            const {
                data,
                error
            } = await this.supabase.from(this.tableName)
            .select('*')
            .eq('id', roomId)
            .eq('user_id', user_id)
            .single()

            // console.log(`room id: ${roomId} data: ${data}`)
    
            if (error) throw error
            if (!data) throw new Error('Room not found')
            return roomModel.fromDbRoom(data)
        } catch (error) {
            throw error
        }    
    }

    // for admin
    async getRoomByCode(roomCode, user_id){
        // console.log( 'room repo ', roomCode)
        try {
            const {
                data,
                error
            } = await this.supabase.from(this.tableName)
            .select('*')
            .eq('code', roomCode)
            .eq('user_id', user_id)
            .single()
    
            if (error) throw error
            if (!data) throw new Error('Room not found')
            return roomModel.fromDbRoom(data)
        } catch (error) {
            throw error
        }    
    }

    // for participants na part
    async getRoomByCodeUsers(roomCode){
        try {
            const {
                data,
                error
            } = await this.supabase.from(this.tableName)
            .select('*')
            .eq('code', roomCode)
            .single()
    
            if (error) throw error
            if (!data) throw new Error('Room not found')
            return roomModel.fromDbRoom(data)
        } catch (error) {
            throw error
        }    
    }
    
    async isRoomExistById(roomId){
        try {
            const {
                data,
                error
            } = await this.supabase.from(this.tableName)
            .select('*')
            .eq('id', roomId)
            .single()
    
            if (error) throw error
            return data ? true: false
        } catch (error) {
            throw error
        }    
    }
    
    async createRoom(room){
        try {
            const {
                data,
                error
            } = await this.supabase.from(this.tableName)
            .insert(room.toDbObject())
            .select()
            .single()
    
            if (error) {
                console.error('Database error:', error);
                throw error;
            }
            if (!data || data.length === 0) {
                throw new Error('Failed to create room - no data returned');
            }
            return roomModel.fromDbRoom(data)
        } catch (error) {
            throw error
        }    
    }
    
    async updateRoom (roomId, user_id, room){
        try {
            const {
                data,
                error
            } = await this.supabase.from(this.tableName)
            .update(room.toDbObjectUpdate())
            .eq('id', roomId)
            .eq('user_id', user_id)
            .select()
            .single()
    
            if (error) throw error
            if (!data) throw new Error ('Room not found')
            return roomModel.fromDbRoom(data)
        } catch (error) {
            throw error
        }    
    }
    
    async deleteRoom (roomId, user_id){  
        try {
            const {
                data,
                error
            } = await this.supabase.from(this.tableName)
            .delete()
            .eq('id', roomId)
            .eq('user_id', user_id)
            .select()
            .single()
            
            if (error) throw error
            if (!data) throw new Error('Room not found')
            return true
        } catch (error) {
            throw error
        }    
    }

    async updateVisibility (room_id, creator_id, visibility){
        try {
            const {
                data,
                error
            } = await this.supabase.from(this.tableName)
            .update({ 'visibility': visibility })
            .eq('id', room_id)
            .eq('user_id', creator_id)
            .select()

            if (error) throw error
            return data
        } catch (error){
            throw error
        }
    }
    
    async uploadBannerImage(fileBuffer, fileName, mimeType){
        try {
            const {
                _,
                error
            } = await this.supabase.storage
            .from(this.storageBucket)
            .upload(fileName, fileBuffer, {
                contentType: mimeType,
                // upsert: false // Set to true if you want to overwrite existing files
                upsert: true
            })
    
            if (error){
                throw error
            }

            const { data: urlData } = this.supabase.storage
            .from(this.storageBucket)
            .getPublicUrl(fileName)

            if (!urlData || !urlData.publicUrl) {
                throw new Error('Failed to get public URL for uploaded image');
            }

            return urlData.publicUrl
        } catch (error) {
            throw error
        }    
    }
}

module.exports = RoomRepo