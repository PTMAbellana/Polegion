const BaseRepo = require('./BaseRepo')
const roomModel = require('../../domain/models/Room')

class RoomRepo extends BaseRepo {
    constructor(supabase){
        super(supabase)
        this.tableName = 'rooms'
        this.storageBucket = 'room-images'
    }

    async generateRoomCode(length = 6) {
        // Use letters and numbers, excluding similar-looking characters
        const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ123456789';
        let result = '';
        
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        
        return result;
    }

    async createCode () {
        let isUnique = false;
        let newCode = "";
        
        while (!isUnique) {
            newCode = generateRoomCode();
            
            console.log(newCode)

            try {
                const { data, error } = await supabase
                .from("rooms")
                .select("code")
                .eq("code", newCode);
                
            if (error) {
                console.error("Error checking room code:", error);
                toast.error("Failed to generate room code");
                return null;
            }
            
            // If no data returned, code is unique
            if (data.length === 0) {
                isUnique = true;
            }
 
            } catch (error){
                throw error
            }

            // // Check if code exists in database
            // const { data, error } = await supabase
            //     .from("rooms")
            //     .select("code")
            //     .eq("code", newCode);
                
            // if (error) {
            //     console.error("Error checking room code:", error);
            //     toast.error("Failed to generate room code");
            //     return null;
            // }
            
            // // If no data returned, code is unique
            // if (data.length === 0) {
            //     isUnique = true;
            // }
        }
    }

    async getAllRoomCodes (code) {
        try {
            const{
                data, 
                error
            } = await this.supabase.from(this.tableName)
            .select('*')
            .eq('code', code)

            if (error) throw error
            // return data
            console.log('room codes ', data)
            return data && data.length > 0
        } catch (error) {
            throw error
        }
    }

    async getAllRooms(userId){
        try {
            console.log('get all rooms userid ', userId)
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
        // const code = this.createCode()
        
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