class LeaderboardController {
    constructor(leaderService){
        this.leaderService = leaderService
    }

    getRoomBoard = async(req, res) => {
        const { room_id } = req.params
        try {
            const data = await this.leaderService.getRoomBoard(room_id)
            return res.status(200).json({
               message: 'Room Leaderboard fetched successfully',
               data: data 
            })
        } catch (error) {
            if (error.message === 'Room not found') {
                return res.status(404).json({
                    message: 'Room not found',
                    error: 'The specified room does not exist' 
                })
            }
            if (error.status === 400) {
                return res.status(400).json({
                    message: 'Bad Request',
                    error: 'Invalid room ID'
                })
            }
            if (error.status === 401) {
                return res.status(401).json({
                    message: 'Unauthorized',
                    error: 'User is not authorized to access this resource'
                })
            }
            return res.status(500).json({
                message: 'Server error Room Leaderboard',
                error: error.message
            })
        }
    }
    
    getCompeBoard = async(req, res) => {
        const { room_id } = req.params
        const { competition_id } = req.query
        try{
            const data = await this.leaderService.getCompeBoard(room_id, competition_id)
            return res.status(200).json({
                message: 'Competition Leaderboard fetched successfully',
                data: data
            })
        } catch (error){
            console.log(error)
            if (error.message === 'Competition not found') {
                return res.status(404).json({
                    message: 'Competition not found',
                    error: 'The specified competition does not exist'
                })
            }
            if (error.status === 400) {
                return res.status(400).json({
                    message: 'Bad Request',
                    error: 'Invalid competition ID'
                })
            }
            if (error.status === 401) {
                return res.status(401).json({
                    message: 'Unauthorized',
                    error: 'User is not authorized to access this resource'
                })
            }
            return res.status(500).json({
                message: 'Server errore Competition Leaderboard',
                error: error.message
            })
        }
    }

    downloadRoomRecordsCSV = async(req, res) => {
        const { room_id } = req.params
        try {
            const { content, filename } = await this.leaderService.generateRoomRecordsCSV(room_id)
            
            res.setHeader('Content-Type', 'text/csv; charset=utf-8')
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
            
            return res.send(content)
        } catch (error) {
            console.log(error)
            if (error.message === 'No records found for this room') {
                return res.status(404).json({
                    message: 'No records found for this room',
                    error: 'The specified room has no student records'
                })
            }
            if (error.message === 'Room not found') {
                return res.status(404).json({
                    message: 'Room not found',
                    error: 'The specified room does not exist'
                })
            }
            if (error.status === 401) {
                return res.status(401).json({
                    message: 'Unauthorized',
                    error: 'User is not authorized to access this resource'
                })
            }
            return res.status(500).json({
                message: 'Failed to generate CSV export',
                error: error.message
            })
        }
    }

    downloadCompetitionRecordsCSV = async(req, res) => {
        const { room_id, competition_id } = req.params
        try {
            const { content, filename } = await this.leaderService.generateCompetitionRecordsCSV(room_id, competition_id)
            
            res.setHeader('Content-Type', 'text/csv; charset=utf-8')
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
            
            return res.send(content)
        } catch (error) {
            console.log(error)
            if (error.message === 'No records found for this competition') {
                return res.status(404).json({
                    message: 'No records found',
                    error: error.message
                })
            }
            if (error.message === 'Competition not found') {
                return res.status(404).json({
                    message: 'Competition not found',
                    error: 'The specified competition does not exist'
                })
            }
            if (error.status === 401) {
                return res.status(401).json({
                    message: 'Unauthorized',
                    error: 'User is not authorized to access this resource'
                })
            }
            return res.status(500).json({
                message: 'Failed to generate CSV export',
                error: error.message
            })
        }
    }
}

module.exports = LeaderboardController