const BaseRepo = require('./BaseRepo')

class XPRepo extends BaseRepo {
    constructor(supabase){
        super(supabase)
        this.tableName = 'xp_transactions'
    }
}

module.exports = XPRepo