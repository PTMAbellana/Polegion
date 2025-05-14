const BaseRepo = require('./BaseRepo')
const userModel = require('../../domain/models/User')

class UserRepo extends BaseRepo{
    constructor(supabase){
        super(supabase)
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

            if (error) throw error
            
            return data
        } catch (error) {
            throw error
        }
    }
    
    async resetPassword (email, redirectUrl){
        try {
            const { error } = await this.supabase.auth.resetPasswordForEmail(email,{
                redirectTo: redirectUrl
            })
            
            if (error) throw error
            return true
        } catch (error) {
            throw error
        }
    }

    async signUp (email, password, options){
        try {
            const { 
                data, 
                error 
            } = await supabase.auth.signUp({
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
}

module.exports = UserRepo