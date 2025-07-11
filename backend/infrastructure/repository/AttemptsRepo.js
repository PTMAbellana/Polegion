const BaseRepo = require('./BaseRepo')

class AttemptsRepo extends BaseRepo {
    constructor(supabase){
        super(supabase)
        this.tableName = 'problem_attempts'
        this.tableCompe = 'competition_problem_attempts'
    }
}

module.exports = AttemptsRepo