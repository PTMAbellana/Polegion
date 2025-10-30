class CompeController {
    constructor(compeService){
        this.compeService = compeService
    }

    addCompe = async (req, res) => {
        const { room_id, title } = req.body
        try {
            const data = await this.compeService.addCompe(room_id, title)
            res.status(200).json(data)
        } catch (error) {
            console.error(error)
            res.status(400).json({
                error: error.message
            })
        }
    }

    getAllCompe = async(req, res) => {
        const { room_id } = req.params
        const { type } = req.query || 'admin'
        try {
            const data = await this.compeService.getCompeByRoomId(room_id, req.user.id, type)
            return res.status(200).json({
                message: 'Successfully fetched competitions',
                data: data
            })
        } catch (error) {
            console.error(error)
            if (error.message === 'Room not found or not authorized')
                return res.status(404).json({
                    message: 'Room not found or not authorized',
                    error: 'Not found'
                })
            if (error.status === 401)
                return res.status(401).json({
                    message: 'Unauthorized',
                    error: 'Invalid token'
                })
            return res.status(500).json({
                message: 'Server error fetching competitions',
                error: error.message
            })
        }
    }

    
    getCompeById = async(req, res) => {
        const { room_id, compe_id } = req.params
        const { type } = req.query || 'creator'
        try {
            const data = await this.compeService.getCompeById(compe_id, room_id, req.user.id, type)
            res.status(200).json(data)  
        } catch (error) {
            console.error(error)
            res.status(400).json({
                error: error.message
            })
        }
    }

    startCompe = async (req, res) => {
        const { compe_id } = req.params
        const { problems } = req.body
        try {
            const data = await this.compeService.startCompetition(compe_id, problems)
            res.status(200).json(data)
        } catch (error) {
            console.error(error)
            res.status(400).json({
                error: error.message
            })
        }
    }

    nextProblem = async (req, res) => {
        const { compe_id } = req.params
        const { problems, current_index } = req.body
        try {
            const data = await this.compeService.nextProblem(compe_id, problems, current_index)
            res.status(200).json(data)
        } catch (error) {
            console.error(error)
            res.status(400).json({
                error: error.message
            })
        }
    }

    pauseCompe = async (req, res) => {
        const { compe_id } = req.params
        try {
            const data = await this.compeService.pauseCompetition(compe_id)
            res.status(200).json(data)
        } catch (error) {
            console.error(error)
            res.status(400).json({
                error: error.message
            })
        }
    }

    resumeCompe = async (req, res) => {
        const { compe_id } = req.params
        try {
            const data = await this.compeService.resumeCompetition(compe_id)
            res.status(200).json(data)
        } catch (error) {
            console.error(error)
            res.status(400).json({
                error: error.message
            })
        }
    }

    autoAdvanceCompe = async (req, res) => {
        const { compe_id } = req.params
        try {
            const data = await this.compeService.autoAdvanceCompetition(compe_id)
            if (!data) {
                return res.status(400).json({
                    error: 'Competition not active or invalid state'
                })
            }
            res.status(200).json(data)
        } catch (error) {
            console.error(error)
            res.status(400).json({
                error: error.message
            })
        }
    }
}

module.exports = CompeController