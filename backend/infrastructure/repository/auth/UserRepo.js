const BaseRepo = require('../BaseRepo')
const userModel = require('../../../domain/models/auth/User')
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
            // Get user profile data
            const {
                data: profileData,
                error: profileError
            } = await this.supabase.from(this.tableName)
            .select('*')
            .eq('user_id', userId)
            .single()

            if (profileError) throw profileError

            // Get email from auth.users
            const {
                data: authData,
                error: authError
            } = await this.supabase.auth.admin.getUserById(userId)

            console.log('User profile data:', profileData)
            console.log('Auth data:', authData?.user?.email)

            // Combine profile data with email from auth
            const userData = {
                ...profileData,
                email: authData?.user?.email || ''
            }

            return userModel.fromDbUser(userData)
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

    async createUserProfile (userId, userData, email){
        const newUser = userModel.fromInputUser(userData, userId, email).addUsertoJSON()
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
            
            // Initialize Castle 0 progress for new users
            try {
                console.log('🏰 Initializing Castle 0 for new user:', userId);
                
                // Get Castle 0 (unlock_order = 0)
                const { data: castle0, error: castleError } = await this.supabase
                    .from('castles')
                    .select('id')
                    .eq('unlock_order', 0)
                    .single();
                
                if (castleError) {
                    console.error('⚠️ Could not find Castle 0:', castleError.message);
                } else if (castle0) {
                    // Create user_castle_progress entry for Castle 0
                    const { error: progressError } = await this.supabase
                        .from('user_castle_progress')
                        .insert({
                            user_id: userId,
                            castle_id: castle0.id,
                            unlocked: true,
                            completed: false,
                            completion_percentage: 0,
                            total_xp_earned: 0
                        });
                    
                    if (progressError) {
                        console.error('⚠️ Could not create Castle 0 progress:', progressError.message);
                    } else {
                        console.log('✅ Castle 0 unlocked for new user');
                    }
                }
            } catch (initError) {
                // Don't fail user creation if castle initialization fails
                console.error('⚠️ Error initializing Castle 0, but user created successfully:', initError.message);
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
            console.log('🏰 getUserCastleProgress called for userId:', userId);
            
            // First, get all castles
            const { data: allCastles, error: castlesError } = await this.supabase
                .from('castles')
                .select('id, name, route, unlock_order')
                .order('unlock_order');

            if (castlesError) {
                console.error('❌ Error fetching castles:', castlesError);
                throw castlesError;
            }

            console.log('✅ Found castles in database:', allCastles?.length || 0);
            if (allCastles && allCastles.length > 0) {
                console.log('Castle names:', allCastles.map(c => c.name).join(', '));
            }

            if (!allCastles || allCastles.length === 0) {
                console.log('⚠️ No castles found in database');
                return [];
            }

            // Get user's castle progress
            const { data: userProgress, error } = await this.supabase
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

            if (error) {
                console.error('❌ Error fetching user progress:', error);
                throw error;
            }
            
            console.log('✅ User has progress for', userProgress?.length || 0, 'castles');
            if (userProgress && userProgress.length > 0) {
                console.log('Progress castle IDs:', userProgress.map(p => p.castle_id).join(', '));
            }

            // Create a map of user progress by castle_id
            const progressMap = new Map();
            if (userProgress && userProgress.length > 0) {
                userProgress.forEach(progress => {
                    progressMap.set(progress.castle_id, progress);
                });
            }

            // Build complete castle progress for all castles
            const castleProgress = await Promise.all(allCastles.map(async (castle) => {
                const progress = progressMap.get(castle.id);

                // Count chapters for this castle
                const { count: totalChapters } = await this.supabase
                    .from('chapters')
                    .select('*', { count: 'exact', head: true })
                    .eq('castle_id', castle.id);

                const chaptersCompleted = progress?.completion_percentage 
                    ? Math.round((progress.completion_percentage / 100) * (totalChapters || 0))
                    : 0;

                return {
                    castle_id: castle.id,
                    castle_name: castle.name || 'Unknown Castle',
                    chapters_completed: chaptersCompleted,
                    total_chapters: totalChapters || 0,
                    total_xp: progress?.total_xp_earned || 0,
                    progress_percentage: progress?.completion_percentage || 0,
                    unlocked: progress?.unlocked || false,
                    completed: progress?.completed || false
                };
            }));

            console.log(`Returning ${castleProgress.length} castles for user ${userId} (${userProgress?.length || 0} with progress)`);
            return castleProgress;
        } catch (error) {
            console.error('Error in getUserCastleProgress:', error);
            throw error;
        }
    }

    // Get user competition history
    async getUserCompetitionHistory(userId) {
        try {
            // First get the room_participant_id for this user with room information
            const { data: participantData, error: participantError } = await this.supabase
                .from('room_participants')
                .select('id, room_id')
                .eq('user_id', userId);

            if (participantError) {
                console.error('Error fetching room participants:', participantError);
                throw participantError;
            }

            if (!participantData || participantData.length === 0) {
                console.log(`No room participants found for user ${userId}`);
                return [];
            }

            // Create a map of participant_id to room_id
            const participantToRoomMap = {};
            participantData.forEach(p => {
                participantToRoomMap[p.id] = p.room_id;
            });

            const participantIds = participantData.map(p => p.id);

            // Get competition leaderboard entries for these participants
            const { data, error } = await this.supabase
                .from('competition_leaderboards')
                .select(`
                    *,
                    competition:competition_id (
                        id,
                        title,
                        status,
                        created_at
                    )
                `)
                .in('room_participant_id', participantIds)
                .order('id', { ascending: false });

            if (error) {
                console.error('Error fetching competition leaderboards:', error);
                throw error;
            }

            if (!data || data.length === 0) {
                console.log(`No competition history found for user ${userId}`);
                return [];
            }

            // Transform data and include room_id
            const competitionHistory = data.map(entry => ({
                competition_id: entry.competition_id,
                room_id: participantToRoomMap[entry.room_participant_id] || null,
                title: entry.competition?.title || 'Unknown Competition',
                accumulated_xp: entry.accumulated_xp || 0,
                rank: 0, // Rank would need to be calculated separately
                status: entry.competition?.status || 'UNKNOWN',
                date: entry.competition?.created_at || new Date().toISOString()
            }));

            console.log(`Found ${competitionHistory.length} competitions for user ${userId}`);
            return competitionHistory;
        } catch (error) {
            console.error('Error in getUserCompetitionHistory:', error);
            // Return empty array instead of throwing to allow page to load
            return [];
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