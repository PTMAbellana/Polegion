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
}

module.exports = CompeController