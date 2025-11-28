const BaseRepo = require('./BaseRepo')
const userModel = require('../../domain/models/User')
const jwt = require('jsonwebtoken')

class UserRepo extends BaseRepo{
    constructor(supabase){
        super(supabase)
        this.tableName = 'user_profiles'
        this.storageBucket = 'profile-images'
        this.defaultLink = 'https://uwllqanzveqanfpfnndu.supabase.co/storage/v1/object/public/profile-images/1751777126476.png'
    }

    // for getProfile na route /profile
    async getUserByUid(userId) {
        try {
            const {
                data,
                error
            } = await this.supabase.from(this.tableName)
            .select('*')
            .eq('user_id', userId)
            .single()

            if (error) throw error

            console.log('User profile data:', data)

            return userModel.fromDbUser(data)
        } catch (error) {
            console.error('Error in getUserByUid:', error)
            throw error
        }
    }

    async getUserByToken(token){
        try {
            const {
                data,
                error
            } = await this.supabase.auth.getUser(token)
            
            if (error) {
                // More specific error handling based on Supabase error
                if (error.message && error.message.includes('expired')) {
                    throw new Error ("Token expired")
                }
                throw new Error (`Token validation failed: ${error.message || 'Unknown error'}`)
            }
            
            if (!data.user) {
                throw new Error ("User not found")
            }
            
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
    
    async updateUser(userData, userId) {
        try {
            const {
                data,
                error
            } = await this.supabase
            .from(this.tableName)
            .update({
                first_name: userData.first_name,
                last_name: userData.last_name,
                gender: userData.gender,
                phone: userData.phone
            })
            .eq('user_id', userId)
            .select()
            .single()

            if (error) throw error

            return userModel.fromInputUser(data, userId)
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

    async createUserProfile (userId, userData){
        const newUser = userModel.fromInputUser(userData, userId).toJSON()
        try {
            const { 
                data, 
                error 
            } = await this.supabase.from(this.tableName)
            .insert({
                user_id: userId,
                ...newUser
            })
            .select()
            .single()
            if (error) {
                throw new Error('Failed to create user profile: ' + error.message)
            }
            return data
        } catch (error) {
            throw error
        }
    }

    async updatePasswordWithToken(token, newPassword){
        if (!token || !newPassword) throw new Error('Missing token or new password')
        
            try {
                const decoded = jwt.decode(token)

                // console.log('decoded ', decoded)
                
                const userId = decoded?.sub

                // console.log('userId ', userId)
                
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

    // Get user castle progress with details
    async getUserCastleProgress(userId) {
        try {
            const { data, error } = await this.supabase
                .from('user_castle_progress')
                .select(`
                    *,
                    castles (
                        id,
                        name,
                        route,
                        unlock_order
                    )
                `)
                .eq('user_id', userId);

            if (error) throw error;

            // Return empty array if no data
            if (!data || data.length === 0) {
                console.log(`No castle progress found for user ${userId}`);
                return [];
            }

            // Sort by castle unlock_order
            const sortedData = data.sort((a, b) => {
                const orderA = a.castles?.unlock_order || 0;
                const orderB = b.castles?.unlock_order || 0;
                return orderA - orderB;
            });

            // Get total chapters for each castle
            const castleProgress = await Promise.all(sortedData.map(async (progress) => {
                // Count chapters for this castle
                const { count: totalChapters } = await this.supabase
                    .from('chapters')
                    .select('*', { count: 'exact', head: true })
                    .eq('castle_id', progress.castle_id);

                const chaptersCompleted = progress.completion_percentage 
                    ? Math.round((progress.completion_percentage / 100) * (totalChapters || 0))
                    : 0;

                return {
                    castle_id: progress.castle_id,
                    castle_name: progress.castles?.name || 'Unknown Castle',
                    chapters_completed: chaptersCompleted,
                    total_chapters: totalChapters || 0,
                    total_xp: progress.total_xp_earned || 0,
                    progress_percentage: progress.completion_percentage || 0,
                    unlocked: progress.unlocked || false,
                    completed: progress.completed || false
                };
            }));

            console.log(`Found ${castleProgress.length} castles for user ${userId}`);
            return castleProgress;
        } catch (error) {
            console.error('Error in getUserCastleProgress:', error);
            throw error;
        }
    }

    // Get user competition history
    async getUserCompetitionHistory(userId) {
        try {
            const { data, error } = await this.supabase
                .from('competition_participants')
                .select(`
                    *,
                    competitions (
                        id,
                        title,
                        status,
                        created_at
                    )
                `)
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Transform data
            const competitionHistory = data.map(participant => ({
                competition_id: participant.competition_id,
                title: participant.competitions?.title || 'Unknown Competition',
                accumulated_xp: participant.accumulated_xp || 0,
                rank: participant.rank || 0,
                status: participant.competitions?.status || 'UNKNOWN',
                date: participant.competitions?.created_at || participant.created_at
            }));

            return competitionHistory;
        } catch (error) {
            console.error('Error in getUserCompetitionHistory:', error);
            throw error;
        }
    }

    // Get user assessment scores (pretest and posttest)
    async getUserAssessmentScores(userId) {
        try {
            const { data, error } = await this.supabase
                .from('user_assessment_results')
                .select('test_type, percentage, total_score, max_score, completed_at')
                .eq('user_id', userId)
                .order('completed_at', { ascending: false });

            if (error) throw error;

            // Handle empty results
            if (!data || data.length === 0) {
                console.log(`No assessment results found for user ${userId}`);
                return {
                    pretest_score: null,
                    posttest_score: null,
                    pretest_completed_at: null,
                    posttest_completed_at: null
                };
            }

            // Get the most recent pretest and posttest
            const pretest = data.find(result => result.test_type === 'pretest');
            const posttest = data.find(result => result.test_type === 'posttest');

            const result = {
                pretest_score: pretest ? Math.round(pretest.percentage) : null,
                posttest_score: posttest ? Math.round(posttest.percentage) : null,
                pretest_completed_at: pretest?.completed_at || null,
                posttest_completed_at: posttest?.completed_at || null
            };

            console.log(`Assessment scores for user ${userId}:`, result);
            return result;
        } catch (error) {
            console.error('Error in getUserAssessmentScores:', error);
            throw error;
        }
    }
}

module.exports = UserRepo