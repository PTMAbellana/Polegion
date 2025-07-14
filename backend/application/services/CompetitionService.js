class CompeService {
    constructor(compeRepo){
        this.compeRepo = compeRepo
    }

    async addCompe(room_id, title) {
        try {
            const data = await this.compeRepo.addCompe(room_id, title)
            return data
        }  catch (error) {
            throw error
        }
    }
}

module.exports = CompeService