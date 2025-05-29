const BaseRepo = require('./BaseRepo')
const userModel = require('../../domain/models/User')
const jwt = require('jsonwebtoken')
const { options } = require('../../server')

class UserRepo extends BaseRepo{
    constructor(supabase){
        super(supabase)
    }

    async refreshSession(refreshToken) {
        try {
            const {
                data,
                error
            } = await this.supabase.auth.refreshSession({
                refresh_token: refreshToken
            })

            if (error) throw error
            return data
        } catch (error) {
            throw error
        }
    }

    async getUserById(token){
        console.log('token', token)
        try {
            const {
                data,
                error
            } = await this.supabase.auth.getUser(token)
            console.log('data ', data)
            if (
                error ||
                !data.user
            ) throw new Error ("User not found or token invalid")
            
            // return userModel.fromDbUser(data)
            return data
        } catch (error) {
            throw error
        }
    }
    
    async updateUser(userData) {
        try {
            const {
                data,
                error
            } = await this.supabase.auth.updateUser({
                data: {
                    fullName: userData.fullName,
                    gender: userData.gender,
                    phone: userData.phone
                }
            })
            
            if (error) throw error
            
            return userModel.fromDbUser(data.user)
        } catch (error) {
            throw error
        }
    }
    
    async signInWithPassword (email, password){
        try {
            const {
                data,
                error
            } = await this.supabase.auth.signInWithPassword({
                email, 
                password
            })

            console.log('login data', data)

            // console.log(this.supabase.auth.getSession())

            if (error) throw error
            
            return data
        } catch (error) {
            throw error
        }
    }
    
    async resetPassword (email, redirectUrl){
        try {
            const { data, error } = await this.supabase.auth.resetPasswordForEmail(
                email,
                {
                    redirectTo: redirectUrl
                }
            )
            
            if (error) throw error
            return data
        } catch (error) {
            throw error
        }
    }

    async signUp (email, password, options){
        try {
            const { 
                data, 
                error 
            } = await this.supabase.auth.signUp({
                email,
                password,
                options
            })
    
            if (error) throw error
            return data
        } catch (error) {
            throw error
        }
    }

    async signOut () {
        try {
            const { error } = await this.supabase.auth.signOut()

            if (error) throw error

            return true
        } catch (error) {
            throw error
        }
    }

    async updatePasswordWithToken(token, newPassword){
        if (!token || !newPassword) throw new Error('Missing token or new password')
        
            try {
                const decoded = jwt.decode(token)

                console.log('decoded ', decoded)
                
                const userId = decoded?.sub

                console.log('userId ', userId)
                
                if (!userId) throw new Error ('Invalid token')
                
                const { error } = await this.supabase.auth.admin.updateUserById(
                    userId,
                    {
                        password: newPassword
                    }
                )

                if (error) throw new Error('Failed to update password: ', error.message)
                
                return {
                    success: true,
                    message: 'Password reset successfully'
                }
            } catch (error) {
                console.error(error)
                throw new Error(error.message || 'Something went wrong')
            }
    }

    async signInWithOAuth(provider, redirectUrl) {
        try {
            const {
                data,
                error
            } = await this.supabase.auth.signInWithOAuth({
                provider
                // options:{
                //     redirectTo: redirectUrl
                // }
            })

            if (error) throw error
            return data
        } catch (error) {
            throw error
        }
    }

    async handleOAuthCallback(code){
        try {
            const {
                data,
                error
            } = await this.supabase.auth.exchangeCodeForSession(code)

            if (error) throw error
            return data
        } catch (error) {
            throw error
        }
    }
}

module.exports = UserRepo