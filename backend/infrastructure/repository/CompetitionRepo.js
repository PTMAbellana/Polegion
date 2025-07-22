const BaseRepo = require('./BaseRepo')

class CompeRepo extends BaseRepo {
    constructor(supabase){
        super(supabase)
        this.tableName = 'competitions'
    }

    async addCompe(room_id, title) {
        try {
            const { 
                data,
                error
            } = await this.supabase
                .from(this.tableName)
                .insert({
                    'room_id': room_id,
                    'title': title
                })
                .select()
                .single()

            if (error) throw error
            return data
        } catch (error) {
            throw error
        }
    }  

    async getCompeByRoomId(room_id) {
        try {
            const { 
                data,
                error
            } = await this.supabase
                .from(this.tableName)
                .select('*')
                .eq('room_id', room_id)
                .order('created_at', { ascending: false })

            if (error) throw error
            return data
        } catch (error) {
            console.log("Error fetching competitions by room ID:", error)
            throw error
        }
    }


    async getCompeByIdNoRoom(compe_id) {
        try {
            const { 
                data,
                error
            } = await this.supabase
                .from(this.tableName)
                .select('*')
                .eq('id', compe_id)
                .single()

            if (error) throw error
            return data
        } catch (error) {
            throw error
        }
    }

    async getCompeById(compe_id, room_id) {
        try {
            const { 
                data,
                error
            } = await this.supabase
                .from(this.tableName)
                .select('*')
                .eq('id', compe_id)
                .eq('room_id', room_id)
                .single()

            if (error) throw error
            return data
        } catch (error) {
            throw error
        }
    }

    async updateCurrentProblem(compe_id, problem_id, problem_index, status = 'ONGOING') {
        try {
            const { 
                data,
                error
            } = await this.supabase
                .from(this.tableName)
                .update({
                    'current_problem_id': problem_id,
                    'current_problem_index': problem_index,
                    'status': status,
                    'gameplay_indicator': 'PLAY'
                })
                .eq('id', compe_id)
                .select()
                .single()

            if (error) throw error
            return data
        } catch (error) {
            throw error
        }
    }

    async updateCompeStatus(compe_id, status) {
        try {
            const { 
                data,
                error
            } = await this.supabase
                .from(this.tableName)
                .update({ 'status': status })
                .eq('id', compe_id)
                .select()
                .single()

            if (error) throw error
            return data
        } catch (error) {
            throw error
        }
    }

    async updateGameplayIndicator(compe_id, gameplay_indicator) {
        try {
            const { 
                data,
                error
            } = await this.supabase
                .from(this.tableName)
                .update({ 'gameplay_indicator': gameplay_indicator })
                .eq('id', compe_id)
                .select()
                .single()

            if (error) throw error
            return data
        } catch (error) {
            throw error
        }
    }

    async updateTimer(compe_id, timerData) {
        try {
            const { 
                data,
                error
            } = await this.supabase
                .from(this.tableName)
                .update({
                    'timer_started_at': timerData.timer_started_at,
                    'timer_duration': timerData.timer_duration,
                    'timer_end_at': timerData.timer_end_at
                })
                .eq('id', compe_id)
                .select()
                .single()

            if (error) throw error
            return data
        } catch (error) {
            throw error
        }
    }

    async updateTimeRemaining(compe_id, indicator_data) {
        try {
            const { 
                data,
                error
            } = await this.supabase
                .from(this.tableName)
                .update(indicator_data)
                .eq('id', compe_id)
                .select()
                .single()

            if (error) throw error
            return data
        } catch (error) {
            throw error
        }
    }
}

module.exports = CompeRepo