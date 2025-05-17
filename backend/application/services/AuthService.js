class AuthService {
    constructor(userRepo){
        this.userRepo = userRepo
    }


    async refreshToken(refreshToken){
        try {
            const {
                data, 
                error
            } = await this.userRepo.refreshSession(refreshToken)
            
            if (error) throw error
            return data
        } catch (error){
            throw error
        }
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

    async resetPasswordWithToken(token, newPassword) {
        try {
            return await this.userRepo.updatePasswordWithToken(token, newPassword)
        } catch (error) {
            throw error
        }
    }
}

module.exports = AuthService