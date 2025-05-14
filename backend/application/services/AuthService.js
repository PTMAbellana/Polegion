class AuthService {
    constructor(userRepo){
        this.userRepo = userRepo
    }

    async login(email, password){
        try {
            return await this.userRepo.signInWithPassword(email, password)
        } catch (error) { 
            throw error
        }
    }
    
    async register (email, password, fullName, gender, phone){
        try {
            return await this.userRepo.signUp(email, password, {
                data: {
                    fullName,
                    gender,
                    phone
                }
            })
        } catch (error) { 
            throw error
        }
    }
    
    async resetPassword(email, redirectUrl){
        try {
            return await this.userRepo.resetPassword(email, redirectUrl)
        } catch (error) { 
            throw error
        }
    }
    
    async logout () {
        try {
            return await this.userRepo.signOut()
        } catch (error) { 
            throw error
        }
    }
    
    async validateToken (token){
        try {
            return await this.userRepo.getUserById(token)
        } catch (error) { 
            throw error
        }
    }
}

module.exports = AuthService