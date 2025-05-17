const BaseRepo = require('./BaseRepo')
const userModel = require('../../domain/models/User')
const jwt = require('jsonwebtoken')

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
        try {
            const {
                data,
                error
            } = await this.supabase.auth.getUser(token)
            
            if (
                error ||
                !data.user
            ) throw new Error ("User not found or token invalid")
            
            return userModel.fromDbUser(data.user)
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

    // async updatePasswordWithToken(token, newPassword) {
    //     try {
    //         // Verify token first
    //         // const { data: userData, error: userError } = await this.supabase.auth.getUser(token)
            
    //         // console.error('userrespo data', userData)
    //         // console.error('userrespo data.user', userData.user)
    //         // console.error('userrespo error', userError)

    //         // if (userError || !userData.user) {
    //         //     throw new Error('Invalid or expired reset token')
    //         // }

    //         // const { data: sessionData, error: sessionError } = await this.supabase.auth.setSession({
    //         //     access_token: token
    //         // })

    //         // console.log('sessionData ', sessionData)

    //         // if (sessionError || !sessionData.session) {
    //         //     throw new Error('Failed to authenticate with token')
    //         // }

    //         console.log('token ', token)
    //         const { data: sessionData, error: verifyError } = await this.supabase.auth.verifyOtp({
    //             token,
    //             type: 'recovery'
    //         })

    //         console.error('sessionData ', sessionData)

    //         if (verifyError || !sessionData.session) {
    //             throw new Error('Invalid or expired reset token')
    //         }

    //         // Update password
    //         const { data, error } = await this.supabase.auth.updateUser({
    //             password: newPassword
    //         })

    //         console.error('data ', data)
    //         console.error('error ', error)

    //         if (error) throw error

    //         // return userModel.fromDbUser(data.user)
    //         return {
    //             user: data.user, 
    //             message: 'Password updated successfully'
    //         }
    //     } catch (error) {
    //         throw error
    //     }
    // }
}

module.exports = UserRepo