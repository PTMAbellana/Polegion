class AuthService {
    constructor(userRepo, supabase){
        this.userRepo = userRepo
        this.supabase = supabase
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
            const {
                data,
                error
            } = await this.supabase.auth.signInWithPassword({
                email,
                password
            })

            if (error) {
                console.error('AuthService: Login error from Supabase:', error.message)
                throw error
            }

            if (!data || !data.session) {
                console.log('AuthService: No session data returned from Supabase')
                throw new Error('No session data returned')
            }

            const userData = await this.userRepo.getUserByUid(data.user.id)
            return {
                user: {
                    id: data.user.id,
                    email: data.user.email,
                    ...userData.toJSON() // include full profile data
                },
                session: {
                    access_token: data.session.access_token,
                    refresh_token: data.session.refresh_token,
                    expires_at: data.session.expires_at
                }
            }
        } catch (error) { 
            throw error
        }
    }
    
    async register (email, password, inputData){
        try {
            const { 
                data, 
                error 
            } = await this.supabase.auth.signUp({
                email,
                password
            })

            if (error) {
                console.error('AuthService: Registration error from Supabase:', error.message)
                throw error
            }

            if (!data || !data.user) {
                console.log('AuthService: No user data returned from Supabase during registration')
                throw new Error('No user data returned')
            }

            const userId = data.user.id
            // Save additional user info in the database
            const userData = await this.userRepo.createUserProfile(userId, inputData)
            return {
                user: {
                    id: data.user.id,
                    email: data.user.email
                },
                // in case mag change ang mind na mu direct to dashboard
                // session: {
                //     access_token: data.session.access_token,
                //     refresh_token: data.session.refresh_token,
                //     expires_at: data.session.expires_at
                // },
                profile: userData
            }
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