const BaseRepo = require('../BaseRepo')

class XPRepo extends BaseRepo {
    constructor(supabase){
        super(supabase)
        this.tableName = 'xp_transactions'
    }

    async createTransaction(transactionData) {
        try {
            const { 
                data,
                error
            } = await this.supabase
                .from(this.tableName)
                .insert([transactionData])
                .select()
                .single()

            if (error) throw error
            return data
        } catch (error) {
            throw error
        }
    }
}

module.exports = XPRepo