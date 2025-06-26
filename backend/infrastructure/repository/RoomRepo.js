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
                return roomModel.fromDbRoom(room)
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
    
    async createRoom(room){
        try {
            const {
                data,
                error
            } = await this.supabase.from(this.tableName)
            .insert(room.toDbObject())
            .select()
    
            if (error) {
                console.error('Database error:', error);
                throw error;
            }
            if (!data || data.length === 0) {
                throw new Error('Failed to create room - no data returned');
            }
            return roomModel.fromDbRoom(data[0])
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
            .update(room.toDbObject())
            .eq('id', roomId)
            .eq('user_id', user_id)
            .select()
    
            if (error) throw error
            if (data.length === 0) throw new Error ('Room not found or not authoriized')
            return roomModel.fromDbRoom(data[0])
        } catch (error) {
            throw error
        }    
    }
    
    // make this ano, to update instead of delete
    // remember maam leah
    // dont actually delete the room
    // ghad, add another column in the db
    async deleteRoom (roomId, user_id){  
        try {
            const {
                data,
                error
            } = await this.supabase.from(this.tableName)
            .delete()
            .eq('id', roomId)
            .eq('user_id', user_id)
    
            if (error) throw error
            return true
        } catch (error) {
            throw error
        }    
    }
    
    async uploadBannerImage(fileBuffer, fileName, mimeType){
        try {
            // console.log('Uploading to Supabase storage:')
            // console.log('- Bucket:', this.storageBucket)
            // console.log('- File name:', fileName)
            // console.log('- MIME type:', mimeType)
            // console.log('- Buffer size:', fileBuffer.length)

            // const {
            //     data,
            //     error
            // } = await this.supabase.storage
            // // .from(this.tableName)
            // .from(this.storageBucket)
            // .upload(fileName, fileBuffer, {
            //     contentType: mimeType
            // })

            const {
                data,
                error
            } = await this.supabase.storage
            .from(this.storageBucket)
            .upload(fileName, fileBuffer, {
                contentType: mimeType,
                // upsert: false // Set to true if you want to overwrite existing files
                upsert: true
            })
    
            if (error){
                // console.log('Upload image error: ', error) 
                throw error
            }

            const { data: urlData } = this.supabase.storage
            .from(this.storageBucket)
            .getPublicUrl(fileName)

            if (!urlData || !urlData.publicUrl) {
                throw new Error('Failed to get public URL for uploaded image');
            }

            // console.log('Public URL generated:', urlData.publicUrl)
            // console.log('url data:', urlData)

            return urlData.publicUrl
        } catch (error) {
            // console.error('Error in uploadBannerImage:', error)
            throw error
        }    
    }
}

module.exports = RoomRepo