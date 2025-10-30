const BaseRepo = require('./BaseRepo')

class AttemptsRepo extends BaseRepo {
    constructor(supabase){
        super(supabase)
        this.tableName = 'problem_attempts'
        this.tableCompe = 'competition_problem_attempts'
    }

    async addAttempt(attemptData) {
        try {
            const { 
                data,
                error
            } = await this.supabase
                .from(this.tableName)
                .insert([attemptData])
                .select()
                .single()

            if (error) throw error
            return data
        } catch (error) {
            throw error
        }
    }

    async addCompeAttempt(attemptData) {
        try {
            const { 
                data,
                error
            } = await this.supabase
                .from(this.tableCompe)
                .insert([attemptData])
                .select()
                .single()

            if (error) throw error
            return data
        } catch (error) {
            throw error
        }
    }
}

module.exports = AttemptsRepo