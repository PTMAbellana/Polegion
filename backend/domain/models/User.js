class User {
    constructor(id, email, fullName, gender, phone, role = 'user'){
        this.id = id
        this.email = email
        this.fullName = fullName
        this.gender = gender
        this.phone = phone
        this.role = role
    }

    static fromDbUser(supabaseUser){
        return new User (
            supabaseUser.id,
            supabaseUser.email,
            supabaseUser.user_metadata?.fullName || 'User',
            supabaseUser.user_metadata?.gender || '',
            supabaseUser.user_metadata?.phone || ''
        )
    }

    toDTO(){
        return{
            id: this.id,
            email: this.email,
            fullName: this.fullName,
            gender: this.gender,
            phone: this.phone
        }
    }

    toJSON(){
        return {
            id: this.id,
            email: this.email,
            fullName: this.fullName,
            gender: this.gender,
            phone: this.phone,
            role: this.role
        }
    }

    getAuthData () {
        return {
            id: this.id,
            email: this.email,
            phone: this.phone
        }
    }
}

module.exports = User