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
            await this.userRepo.getUserById(userData.token)
            return await this.userRepo.updateUser(userData)
        } catch (error) {
            throw error
        }
    }
}

module.exports = UserService