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
}

module.exports = CompeRepo