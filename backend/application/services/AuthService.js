class AuthService {
    constructor(userRepo){
        this.userRepo = userRepo
    }

    
    async refreshToken(refreshToken){
        try {
            console.log('AuthService: Refreshing token...')
            const data = await this.userRepo.refreshSession(refreshToken)
            
            if (!data || !data.session) {
                console.log('AuthService: No session data returned from UserRepo')
                throw new Error('No session data returned')
            }
            
            console.log('AuthService: Token refresh successful')
            return data
        } catch (error){
            console.error('AuthService: Token refresh failed:', error.message)
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