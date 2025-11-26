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
                // .limit(5)

                if (error) throw error
                if (!data) throw error
                return data
        } catch (error){
            throw error
        }        
    }

    // competition na leaderboard
    async getCompeBoard (room_id, competition_id = null){
        try {
            let query = this.supabase.from(this.tableCompe)
            .select(`
                accumulated_xp,
                competition: competition_id!inner (
                    id, 
                    title, 
                    room_id,
                    status,
                    created_at
                ),
                participant: room_participant_id (
                    id,
                    user_id
                )
            `)
            .eq('competition.room_id', room_id)
            
            // Filter by specific competition if provided
            if (competition_id) {
                query = query.eq('competition_id', competition_id)
            }
            
            const { data, error } = await query
            .order('id', { 
                ascending: true,
                foreignTable: 'competition'
             })
            .order('accumulated_xp', { ascending: false })
            // .limit(5)
    
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
            .select()
            .single()
            
            if (error) throw error
            console.log('added room board: ', data)
            return data
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
            .select()
            .single()

            if (error) throw error
            console.log('added compe board: ', data)
            return data
        } catch (error) {
            throw error
        }
    }

    // edit 
    async updateRoomBoard (room_id, part_id, newXp){
        try {
            const { data, error } = await this.supabase
                .from(this.tableRoom)
                .update({ accumulated_xp: newXp })
                .eq('room_id', room_id)
                .eq('room_participant_id', part_id)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            throw error;
        }
    }

    async updateCompeBoard (compe_id, part_id, newXp){
       try {
        const { data, error } = await this.supabase
            .from(this.tableCompe)
            .update({ accumulated_xp: newXp })
            .eq('competition_id', compe_id)
            .eq('room_participant_id', part_id)
            .select()
            .single();

        if (error) throw error;
        return data;
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
            .maybeSingle()

            if (error) throw error
            // Return null if no leaderboard entry exists (instead of throwing error)
            return data || null
        } catch (error) {
            throw error
        }
    }
   
    async getRawCompeBoard (compe_id, participant_id) {
        try {
            const {
                data, 
                error
            } = await this.supabase.from(this.tableCompe)
            .select('*')
            .eq('competition_id', compe_id)
            .eq('room_participant_id', participant_id)
            .maybeSingle()

            if (error) throw error
            // Return null if no leaderboard entry exists (instead of throwing error)
            return data || null
        } catch (error) {
            throw error
        }
    }

    // Update room leaderboard XP
    async updateRoomXp(leaderboardId, newXpAmount) {
        try {
            const { data, error } = await this.supabase
                .from(this.tableRoom)
                .update({ accumulated_xp: newXpAmount })
                .eq('id', leaderboardId)
                .select()
                .single();

            if (error) throw error;
            console.log('✅ Updated room leaderboard XP:', data);
            return data;
        } catch (error) {
            throw error;
        }
    }

    // Update competition leaderboard XP
    async updateCompetitionXp(leaderboardId, newXpAmount) {
        try {
            const { data, error } = await this.supabase
                .from(this.tableCompe)
                .update({ accumulated_xp: newXpAmount })
                .eq('id', leaderboardId)
                .select()
                .single();

            if (error) throw error;
            console.log('✅ Updated competition leaderboard XP:', data);
            return data;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = LeaderboardRepo