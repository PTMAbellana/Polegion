class User {
    constructor(id, email, fullname, gender, phone){
        this.id = id
        this.email = email
        this.fullname = fullname
        this.gender = gender
        this.phone = phone
    }

    static fromDbUser(supabaseUser){
        return new User (
            supabaseUser.id,
            supabaseUser.email,
            supabaseUser.fullname,
            supabaseUser.gender,
            supabaseUser.phone
        )
    }

    toDTO(){
        return{
            id: this.id,
            email: this.email,
            fullname: this.fullname,
            gender: this.gender,
            phone: this.phone
        }
    }
}

module.exports = User