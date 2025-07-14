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
        try {
            const data = await this.compeService.getCompeByRoomId(room_id, req.user.id)
            res.status(200).json(data)
        } catch (error) {
            console.error(error)
            res.status(400).json({
                error: error.message
            })
        }
    }

    getCompeById = async(req, res) => {
        const { compe_id } = req.params
        const { room_id } = req.params
        try {
            const data = await this.compeService.getCompeById(compe_id, room_id, req.user.id)
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