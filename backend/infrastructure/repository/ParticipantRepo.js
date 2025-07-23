const BaseRepo = require('./BaseRepo')

class ParticipantRepo extends BaseRepo {
    constructor(supabase){
        super(supabase)
        this.tableName = 'room_participants'
        this.roomTable = 'rooms'
    }

    async addParticipant(user_id, room_code){
        // todo:
        // current user kay kanang dili admin
        // i check sa if room exists
        // then if room exists, check if current user is admin
        // if admin, return 'is already an admin'
        // if not, then add them as participant
        // console.log('repo called')
        try {
            const {
                data: rd,
                error: re
            } = await this.supabase.from(this.roomTable)
            .select('id, user_id')
            .eq('code', room_code)
            .single()

            // console.log('room exists: ', rd)

            if (re || !rd) throw new Error ('Room not found')
            
            if (rd.user_id === user_id) throw new Error('Already an admin')
            
            const {
                data: cd,
                error: ce
            } = await this.supabase.from(this.tableName)
            .select('id')
            .eq('user_id', user_id)
            .eq('room_id', rd.id)
            .single()

            // console.log('called')
            if (cd) throw new Error('Already a participant')
            // else if (ce) throw ce
            // else if (ce) console.log('error: ', ce)
            
            // insert if new participant ni sha
            const {
                data, 
                error
            } = await this.supabase.from(this.tableName)
            .insert({
                user_id: user_id,
                room_id: rd.id
            })
            .select()
            .single()

            if (error) throw error

            // console.log('inseting participant to table: ', data)
            return data

        } catch(error){
            // console.log('I am called: ', error)
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
            if (!data) throw new Error ('Participant not found')

            return true
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
            ) throw error
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
                .select('room_id')
                .eq('user_id', user_id)

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