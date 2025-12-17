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

    async kickParticipant(participant_id){
        try {
            const {
                data, 
                error
            } = await this.supabase.from(this.tableName)
            .delete()
            .eq('id', participant_id)
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
        // Get all participants in the current room for admin/teacher view
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
            // Only count actual participants (students), not teachers/admins
            // Teachers are not in participants table - they're room creators
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

    // =====================================================
    // ACTIVE TRACKING METHODS
    // =====================================================

    async updateHeartbeat(participantId, data) {
        try {
            const { error } = await this.supabase
                .from(this.tableName)
                .update({
                    last_active: new Date().toISOString(),
                    is_in_competition: data.is_in_competition || false,
                    current_competition_id: data.current_competition_id || null,
                    session_id: data.session_id || null
                })
                .eq('id', participantId);

            if (error) throw error;
            return { success: true };
        } catch (error) {
            throw error;
        }
    }

    async getActiveParticipants(roomId) {
        try {
            const { data, error } = await this.supabase
                .from('active_room_participants')
                .select('*')
                .eq('room_id', roomId)
                .neq('role', 'teacher'); // Exclude teachers

            if (error) throw error;
            return data || [];
        } catch (error) {
            throw error;
        }
    }

    async getActiveCompetitionParticipants(competitionId) {
        try {
            const { data, error } = await this.supabase
                .from('active_competition_participants')
                .select('*')
                .eq('current_competition_id', competitionId)
                .neq('role', 'teacher'); // Exclude teachers

            if (error) throw error;
            return data || [];
        } catch (error) {
            throw error;
        }
    }
}

module.exports = ParticipantRepo