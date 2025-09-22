class UserService {
    constructor(userRepo) {
        this.userRepo = userRepo
    }

    async getUserProfile(token){
        try {
            return await this.userRepo.getUserById(token)
        } catch (error) {
            throw error
        }
    }

    async getUserById(userId) {
        try {
            return await this.userRepo.getUserByuid(userId)
        } catch (error) {
            throw error
        }
    }
    
    async updateUserProfile(userData) {
        try {
            await this.userRepo.getUserById(userData.token)
            return await this.userRepo.updateUser(userData)
        } catch (error) {
            throw error
        }
    }

    async updateEmail (email, userId) {
        try {
            return await this.userRepo.updateUserEmail(email, userId)
        } catch (error) {
            throw error
        }
    }

    async updatePassword (password, userId) {
        try {
            return await this.userRepo.updateUserPassword(password, userId)
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
            return await this.userRepo.uploadProfileImage(fileBuffer, fileName, mimeType, userId)
        } catch (error) {
            throw error
        }
    }

    async getProfilePicture(user_id) {
        try {
            return await this.userRepo.getProfilePicture(user_id)
        } catch (error) {
            throw error
        }
    }

}

module.exports = UserService