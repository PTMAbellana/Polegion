const BaseRepo = require('./BaseRepo')

class LeaderboardRepo extends BaseRepo {
    constructor(supabase){
        super(supabase)
        this.tableRoom = 'room_leaderboards'
        this.tableCompe = 'competition_leaderboards'
    }

    // room na leaderboard
    async getRoomBoard (room_id){
        try {
            const {
                data, 
                error
            } = await this.supabase.from(this.tableRoom)
                // .select('room_participant_id, accumulated_xp')
                .select(`participant: room_participant_id (
                        id,
                        user_id
                    ), accumulated_xp`)
                .eq('room_id', room_id)
                .order('accumulated_xp', { ascending: false })
                .limit(5)

                if (error) throw error
                if (!data) throw error
                return data
        } catch (error){
            throw error
        }        
    }

    // competition na leaderboard
    async getCompeBoard (room_id){
        try {
            const {
                data, 
                error
            } = await this.supabase.from(this.tableCompe)
            .select(`
                competition: competition_id (
                    id, title, room_id
                ),
                participant: room_participant_id(
                    id, user_id
                ),
                accumulated_xp
                `)
            .eq('competition.room_id', room_id)
            .order('id', { 
                ascending: true,
                foreignTable: 'competition'
             })
            .order('accumulated_xp', { ascending: false })
            .limit(5)
    
            if (error) throw error
            if (!data) throw error
            // console.log(data)
            return data
        } catch (error){
            // console.log('ako gi tawag ', error)
            throw error
        }
    }

    // adding of row
    // room
    async addRoomBoard (room_id, part_id) {
        try {
            const {
                data, 
                error
            } = await this.supabase.from(this.tableRoom)
            .insert({
                room_participant_id: part_id,
                accumulated_xp: 0,
                room_id: room_id
            })
        } catch (error) {
            throw error
        }
    }
    // compe
    async addCompeBoard (compe_id, part_id) {
        try {
            const {
                data, 
                error
            } = await this.supabase.from(this.tableCompe)
            .insert({
                room_participant_id: part_id,
                accumulated_xp: 0,
                competition_id: compe_id
            })
        } catch (error) {
            throw error
        }
    }

    // edit 
    async updateRoomBoard (room_id, part_id){
        try {

        } catch (error) {
                throw error
        }
    }

    async updateCompeBoard (compe_id, room_id){
       try {

       } catch (error) {
            throw error
       }
    }

    //cheche bureche
    async getRawBoard (room_id, participant_id) {
        try {
            const {
                data, 
                error
            } = await this.supabase.from(this.tableRoom)
            .select('*')
            .eq('room_id', room_id)
            .eq('room_participant_id', participant_id)
            .single()

            if (error) throw error
            if (!data) throw new Error('Leaderboard not found')
            return data
        } catch (error) {
            throw error
        }
    }

}

module.exports = LeaderboardRepo