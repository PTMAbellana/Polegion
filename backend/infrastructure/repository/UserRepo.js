const BaseRepo = require('./BaseRepo')
const userModel = require('../../domain/models/User')
const jwt = require('jsonwebtoken')
const { data } = require('autoprefixer')

class UserRepo extends BaseRepo{
    constructor(supabase){
        super(supabase)
        this.tableName = 'user_profiles'
        this.storageBucket = 'profile-images'
        this.defaultLink = 'https://uwllqanzveqanfpfnndu.supabase.co/storage/v1/object/public/profile-images/1751777126476.png'
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

    async getUserByuid(userId) {
        try {
            const {
                data,
                error
            } = await this.supabase.auth.admin.getUserById(userId)

            if (error || !data.user) throw new Error("User not found or invalid user ID")

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

    async updateUserEmail(email, userId) {
        try {
            const { data, error } = await this.supabase.auth.admin.updateUserById(
                userId,
                { email: email }
            )
            
            if (error) throw error
            return userModel.fromDbUser(data.user)
        } catch (error) {
            throw error
        }
    }

    async updateUserPassword(password, userId) {
        try {
            const { data, error } = await this.supabase.auth.admin.updateUserById(
                userId,
                { password: password }
            )
            
            if (error) throw error
            return userModel.fromDbUser(data.user)
        } catch (error) {
            throw error
        }
    }

    async updateUserBan (userId, duration = 'none') {
        try {
            const {
                data,
                error
            } = await this.supabase.auth.admin.updateUserById(
                userId, 
                { ban_duration: duration}
            )

            if (error) throw error
            return data
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

            const userId = data?.user?.id;

            const { 
                data: user, 
                error: userError 
            } = await this.supabase.from(this.tableName)
            .insert({
                user_id: userId,
                profile_pic: this.defaultLink
            })
            if (userError) {
                throw new Error('Failed to update user profile image: ' + userError.message)    
            }

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

    async getProfilePicture( user_id ) {
        try {
            const {
                data,
                error
            } = await this.supabase.from(this.tableName)
            .select('profile_pic')
            .eq('user_id', user_id)
            .single()
            if (error) throw error
            return data
        } catch (error) {
            throw error
        }
    }

    async uploadProfileImage(fileBuffer, fileName, mimeType, userId){
        try {
            const {
                data: bucket,
                error: bucketerror
            } = await this.supabase.storage
            .from(this.storageBucket)
            .upload(fileName, fileBuffer, {
                contentType: mimeType,
                // upsert: false // Set to true if you want to overwrite existing files
                upsert: true
            })
    
            if (bucketerror){
                // console.log('Upload image error: ', error) 
                throw bucketerror
            }

            const { data: urlData } = this.supabase.storage
            .from(this.storageBucket)
            .getPublicUrl(fileName)

            if (!urlData || !urlData.publicUrl) {
                throw new Error('Failed to get public URL for uploaded image');
            }
            const link = urlData.publicUrl;
            const {
                data: user,
                error: userError
            } = await this.supabase.from(this.tableName)
            .update({
                profile_pic: link
            })
            .eq('user_id', userId)
            .select()

            if (userError) {
                throw new Error('Failed to update user profile image: ' + userError.message)    
            }

            console.log(user)

            return link
        } catch (error) {
            // console.error('Error in uploadBannerImage:', error)
            throw error
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