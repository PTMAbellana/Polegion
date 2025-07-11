const BaseRepo = require('./BaseRepo')

class CompeRepo extends BaseRepo {
    constructor(supabase){
        super(supabase)
        this.tableName = 'competitions'
    }
}

module.exports = CompeRepo