const BaseRepo = require('./BaseRepo')
const roomModel = require('../../domain/models/Room')

class RoomRepo extends BaseRepo {
    constructor(supabase){
        super(supabase)
        this.tableName = 'rooms'
        this.storageBucket = 'room-images'
    }

    async getAllRooms(userId){
        try {
            const {
                data,
                error
            } = await this.supabase.from(this.tableName)
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false } )

            console.log('room data ', data)

            if (error) throw error
            return data.map( room => roomModel.fromDbRoom(room) )
        } catch (error) {
            throw error
        }
    }
    
    async getRoomById(roomId, userId){
        try {
            const {
                data,
                error
            } = await this.supabase.from(this.tableName)
            .select('*')
            .eq('id', roomId)
            .eq('user_id', userId)
            .single()

            console.log(`room id: ${roomId} data: ${data}`)
    
            if (error) throw error
            if (!data) throw new Error('Room not found')
            return roomModel.fromDbRoom(data)
        } catch (error) {
            throw error
        }    
    }

    async getRoomByCode(roomCode, userId){
        console.log( 'room repo ', roomCode)
        try {
            const {
                data,
                error
            } = await this.supabase.from(this.tableName)
            .select('*')
            .eq('code', roomCode)
            .eq('user_id', userId)
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
            .select('*')
            .insert(room.toDbObject())
            .select()
    
            if (error) throw error
            return roomModel.fromDbRoom(data[0])
        } catch (error) {
            throw error
        }    
    }
    
    async updateRoom (roomId, userId, room){
        try {
            const {
                data,
                error
            } = await this.supabase.from(this.tableName)
            .update(room.toDbObject())
            .eq('id', roomId)
            .eq('user_id', userId)
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
    async deleteRoom (roomId, userId){  
        try {
            const {
                data,
                error
            } = await this.supabase.from(this.tableName)
            .delete()
            .eq('id', roomId)
            .eq('user_id', userId)
    
            if (error) throw error
            return true
        } catch (error) {
            throw error
        }    
    }
    
    async uploadBannerImage(fileBuffer, fileName, mimeType){
        try {
            const {
                data,
                error
            } = await this.supabase.storage
            // .from(this.tableName)
            .from(this.storageBucket)
            .upload(fileName, fileBuffer, {
                contentType: mimeType
            })
    
            if (error) throw error

            const publicUrl = this.supabase.storage
            .from(this.storageBucket)
            .getPublicUrl(filename).data.publicUrl
            return publicUrl
        } catch (error) {
            throw error
        }    
    }
}

module.exports = RoomRepo