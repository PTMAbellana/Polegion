class ParticipantController {
    constructor(participantService){
        this.participantService = participantService
    }

    joinRoom = async (req, res) => {
        console.log('join is called')
        // console.log(req.body)
        // console.log(req.user)
        const { room_code } = req.body
        // const { room_code } = req.params
        // console.log(room_code)

        if (!room_code) return res.status(400).json({
            error: 'Room code is required'
        })

        try {
            const data = await this.participantService.joinRoom(req.user.id, room_code)
            res.status(201).json({
                message: 'Successfully joined room',
                data: data
            })
        } catch (error) {
            //  console.error('Error joining room:', error.message)
            
            if (error.message === 'Room not found') 
                return res.status(404).json({ error: 'Room not found' })
            
            if (
                error.message === 'Room owner cannot be added as participant' || 
                error.message === 'Already an admin'
            ) 
                return res.status(400).json({ error: 'Room owner cannot join as participant' })

            if (error.message === 'User is already a participant in this room') 
                return res.status(400).json({ error: 'Already a participant in this room' })
            
            res.status(500).json({ error: 'Server error joining room' })
        }
    }

    leaveRoom = async (req, res) => {
        // const { room_id } = req.body
        const { room_id } = req.params

        if (!room_id) return res.status(400).json({
            error: 'Room ID required'
        })

        try {
            await this.participantService.leaveRoom(req.user.id, room_id)
            res.status(200).json({
                message: 'Successfully left room'
            })
        } catch (error) {
            console.log('Error current user leaving room: ', error)

            if (error.message === 'Participant not found')
                return res.status(404).json({
                    error: 'Not a participant in this room'
                })

            res.status(500).json({
                error: 'Server error leaving room'
            })
        }
    }

    // for admin
    getRoomParticipants = async (req, res) => {
        // console.log('getRoomParticipants called: ' , req)
        // const {room_id} = req.body
        const { room_id } = req.params 
        // console.log('getRoomParticipants called 1: ', room_id)
        try {
            const participants = await this.participantService.getRoomParticipants(room_id, req.user.id)
            // console.log('getRoomParticipants called 2: ', participants)
            res.status(200).json({
                participants
            })
            // console.log('getRoomParticipants called 3: ', res.data)
        } catch (error) {
            // console.log('Error fetching participants: ', error)

            if (error.message === 'Room not found or not authorized')
                return res.status(404).json({
                    error: 'Room not found or not authorized'
                })

            res.status(500).json({
                error: 'Server error fetching participants'
            })
        }
    }

    checkParticipantStatus = async (req, res) => {
        // const {room_id} = req.body
        const {room_id} = req.params

        try{
            const isParticipant = await this.participantService.checkPartStatus(req.user.id, room_id)
            res.status(200).json({
                isParticipant:isParticipant
            })
        } catch (error) {
            // console.error('Error checking participant: ', error)
            res.status(500).json({
                error: 'Server error checking participant status'
            })
        }
    }

    getRoomParticipantCount = async (req, res) => {
        // const {room_id} = req.body
        const {room_id} = req.params

        try {
            const count = await this.participantService.getTotalParticipants(room_id)
            res.status(200).json({
                total_participants: count
            })
        } catch (error) {
            // console.error('Error getting participant count')
            res.status(500).json({
                error: 'Server error getting participant count'
            })
        }
    }

    removeParticipant = async (req, res) => {
        // user_id = participant id
        // const {room_id, user_id} = req.body
        const {room_id, user_id} = req.params

        try {
            await this.participantService.removeParticipant(req.user.id, user_id, room_id)
        } catch (error) {
            // console.error('Error removing participant: ', error)
            res.status(500).json({
                error: 'Server error removing participant'
            })
        }
    }

    joinedRooms = async (req, res) => {
        console.log('joinedRooms called: ', req.user.id)
        try {
            const rooms = await this.participantService.getJoinedRooms(req.user.id)
            res.status(200).json({
                rooms
            })
        } catch (error) {
            console.error('Error fetching joined rooms: ', error)
            res.status(500).json({
                error: 'Server error fetching joined rooms'
            })
        }
    }

}

module.exports = ParticipantController