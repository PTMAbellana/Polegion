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
}

module.exports = CompeRepo