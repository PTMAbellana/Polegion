class LeaderboardController {
    constructor(leaderService){
        this.leaderService = leaderService
    }

    getRoomBoard = async(req, res) => {
        const { room_id } = req.params
        try {
            const data = await this.leaderService.getRoomBoard(room_id)
            res.status(200).json({
                data
            })
        } catch (error) {
            res.status(500).json({
                error: 'Server error Room Leaderboard'
            })
        }
    }
    
    getCompeBoard = async(req, res) => {
        const { room_id } = req.params
        try{
            const data = await this.leaderService.getCompeBoard(room_id)
            res.status(200).json({
                data
            })
        } catch (error){
            console.log(error)
            res.status(500).json({
                error: 'Server error Competition Leaderboard'
            })
        }
    }
}

module.exports = LeaderboardController