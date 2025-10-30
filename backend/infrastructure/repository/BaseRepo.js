class BaseRepo {
    constructor(supabase) {
        if (this.constructor === BaseRepo) throw new Error ("Cannot instantiate abstract class")
        this.supabase = supabase
    }
}

module.exports = BaseRepo