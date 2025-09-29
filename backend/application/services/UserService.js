const cache = require('../cache');

class UserService {
    constructor(userRepo) {
        this.userRepo = userRepo
        this.CACHE_TTL = 10 * 60 * 1000; 
    }

    async getUserProfile(token){
        try {
            const cacheKey = cache.generateKey('user_profile', token);
            
            // Check cache first
            const cached = cache.get(cacheKey);
            if (cached) {
                console.log('Cache hit: getUserProfile', token);
                return cached;
            }
            
            // Fetch from database
            const result = await this.userRepo.getUserById(token);
            
            // Cache the result
            if (result) {
                cache.set(cacheKey, result, this.CACHE_TTL);
                console.log('Cached: getUserProfile', token);
            }
            
            return result;
        } catch (error) {
            throw error
        }
    }

    async getUserById(userId) {
        try {
            const cacheKey = cache.generateKey('user_by_id', userId);
            
            // Check cache first
            const cached = cache.get(cacheKey);
            if (cached) {
                console.log('Cache hit: getUserById', userId);
                return cached;
            }
            
            // Fetch from database
            const result = await this.userRepo.getUserByuid(userId);
            
            // Cache the result
            if (result) {
                cache.set(cacheKey, result, this.CACHE_TTL);
                console.log('Cached: getUserById', userId);
            }
            
            return result;
        } catch (error) {
            throw error
        }
    }
    
    async updateUserProfile(userData) {
        try {
            const token = await this.userRepo.getUserByToken(userData.token)
            const result = await this.userRepo.updateUser(userData, token.id);
            
            cache.delete(cache.generateKey('user_profile', userData.token));
            cache.delete(cache.generateKey('user_by_id', token.id));
            console.log('Cache invalidated: updateUserProfile');
            
            return result.toDTO();
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async updateEmail (email, userId) {
        try {
            const result = await this.userRepo.updateUserEmail(email, userId);
            
            // Invalidate user cache
            cache.delete(cache.generateKey('user_by_id', userId));
            console.log('Cache invalidated: updateEmail');
            
            return result;
        } catch (error) {
            throw error
        }
    }

    async updatePassword (password, userId) {
        try {
            const result = await this.userRepo.updateUserPassword(password, userId);
            
            // Invalidate user cache  
            cache.delete(cache.generateKey('user_by_id', userId));
            console.log('Cache invalidated: updatePassword');
            
            return result;
        } catch (error) {
            throw error
        }
    }

    // will get back at you
    async updateUserBan(userId, duration) {
        try {
            // await this.userRepo.getUserById(userData.token)
            return await this.userRepo.updateUserBan(userId, duration)
        } catch (error) {
            throw error
        }
    } 

    async uploadProfileImage(fileBuffer, fileName, mimeType, userId) {
        try {
            const result = await this.userRepo.uploadProfileImage(fileBuffer, fileName, mimeType, userId);
            
            // Invalidate profile picture cache when new image is uploaded
            cache.delete(cache.generateKey('user_profile_pic', userId));
            console.log('Cache invalidated: uploadProfileImage');
            
            return result;
        } catch (error) {
            throw error
        }
    }

    async getProfilePicture(user_id) {
        try {
            const cacheKey = cache.generateKey('user_profile_pic', user_id);
            
            // Check cache first
            const cached = cache.get(cacheKey);
            if (cached) {
                console.log('Cache hit: getProfilePicture', user_id);
                return cached;
            }
            
            // Fetch from database
            const result = await this.userRepo.getProfilePicture(user_id);
            
            // Cache the result (profile pictures change less frequently)
            if (result) {
                cache.set(cacheKey, result, this.CACHE_TTL * 2); // Cache for 20 minutes
                console.log('Cached: getProfilePicture', user_id);
            }
            
            return result;
        } catch (error) {
            throw error
        }
    }

}

module.exports = UserService