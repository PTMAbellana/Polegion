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
    
    async updateUserProfile(userData) {
        try {
            return await this.userRepo.updateUser(token)
        } catch (error) {
            throw error
        }
    }
}

module.exports = UserService