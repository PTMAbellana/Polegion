class CompeService {
    constructor(compeRepo, partService, leaderService){
        this.compeRepo = compeRepo
        this.partService = partService
        this.leaderService = leaderService
    }

    async addCompe(room_id, title) {
        try {
            const data = await this.compeRepo.addCompe(room_id, title)
            const parts = await this.partService.getAllParticipants(room_id)
            await Promise.all(
                parts.map(async (part) => {
                    return await this.leaderService.addCompeBoard(data.id, part.id)
                })
            ) 
            return data
        }  catch (error) {
            throw error
        }
    }
}

module.exports = CompeService