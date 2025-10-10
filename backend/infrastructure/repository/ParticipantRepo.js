const BaseRepo = require('./BaseRepo')

class ParticipantRepo extends BaseRepo {
    constructor(supabase){
        super(supabase)
        this.tableName = 'room_participants'
        this.roomTable = 'rooms'
    }

    async addParticipant(user_id, room_id){
        try {
            const {
                data, 
                error
            } = await this.supabase.from(this.tableName)
            .insert({
                user_id: user_id,
                room_id: room_id
            })
            .select()
            .single()

            if (error) throw error

            return data
        } catch(error){
            throw error
        }
    }

    async removeParticipant(user_id, room_id){
        try {
            const {
                data, 
                error
            } = await this.supabase.from(this.tableName)
            .delete()
            .eq('user_id', user_id)
            .eq('room_id', room_id)
            .select()
            .single()

            if (error) throw error
            
            if (!data) return new Error('Participant not found')

            return data
        } catch (error) {
            throw error
        }
    }

    async getAllParticipants(room_id){
        // todo:
        // get all participants in the current room
        // para ni sa admin na part 
        // console.log('getAllParticipants called: ', room_id)
        try {
            const {
                data,
                error
            } = await this.supabase.from(this.tableName)
            .select('user_id, id')
            .eq('room_id', room_id)
            
            if (error) throw error
            if (!data) return []
            
            // console.log('getAllParticipants: ', data)
            return data

        } catch (error) {
            // console.log('natawag ko')
            // console.log(error)
            throw error
        }
    }

    async isParticipant(user_id, room_id){
        try {
            const {
                data, 
                error
            } = await this.supabase.from(this.tableName)
            .select('id')
            .eq('user_id', user_id)
            .eq('room_id', room_id)
            .single()

            if (
                error 
                // && error.code !== 'PGRST116'
            ) return false 
            return !!data
        } catch (error) {
            throw error
        }
    }

    async getParticipantCount(room_id){
        try {
            const {
                data,
                error
            } = await this.supabase.from(this.tableName)
            .select('id', {count:'exact'})
            .eq('room_id', room_id)

            if (error) throw error
            
            return data.length || 0
        } catch (error) {
            throw error
        }
    }

    async getJoinedRooms(user_id) {
        try {
            const { data, error } = await this.supabase
                .from(this.tableName)
                .select('id, room:room_id(id, title, description, mantra, banner_image, created_at, code, visibility)')
                .eq('user_id', user_id)
                .order('id', { ascending: false })

            if (error) throw error

            // console.log('getJoinedRooms: ', data)
            return data || []
        } catch (error) {
            throw error
        }
    }

    async getParticipantById(participant_id) {
        try {
            const { data, error } = await this.supabase
                .from(this.tableName)
                .select('*')
                .eq('id', participant_id)
                .single()

            if (error) throw error
            return data
        } catch (error) {
            throw error
        }
    }

    async getParticipantByUserId(user_id, room_id) {
        try {
            const { data, error } = await this.supabase
                .from(this.tableName)
                .select('id')
                .eq('user_id', user_id)
                .eq('room_id', room_id)
                .single()

            if (error) throw error
            return data
        } catch (error) {
            throw error
        }
    }
}

module.exports = ParticipantRepo