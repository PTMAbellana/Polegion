class ParticipantController {
    constructor(participantService){
        this.participantService = participantService
    }

    joinRoom = async (req, res) => {
        const { room_code } = req.body

        if (!room_code) return res.status(400).json({
            message: 'Join room failed',
            error: 'Room code is required'
        })

        try {
            const data = await this.participantService.joinRoom(req.user.id, room_code)
            res.status(201).json({
                message: 'Successfully joined room',
                data: data
            })
        } catch (error) {
             console.error('Error joining room:', error)
            
            if (error.message === 'Room not found') 
                return res.status(404).json({ 
                    message: 'Join room failed',
                    error: 'Room not found' 
                })
            
            if (
                error.message === 'Room owner cannot be added as participant' || 
                error.message === 'Already an admin'
            ) 
                return res.status(400).json({ 
                    message: 'Join room failed',
                    error: 'Room owner cannot join as participant' 
                })

            if (error.message === 'User is already a participant in this room') 
                return res.status(400).json({ 
                    message: 'Join room failed',
                    error: 'Already a participant in this room' 
                })

            if (error.status === 401) 
                return res.status(401).json({ 
                    message: 'Unauthorized',
                    error: 'Invalid token' 
                })

            return res.status(500).json({ 
                message: 'Server error joining room',
                error: error.message
            })
        }
    }

    leaveRoom = async (req, res) => {
        // const { room_id } = req.body
        const { room_id } = req.params

        if (!room_id) return res.status(400).json({
            message: 'Leave room failed',
            error: 'Room ID required'
        })

        try {
            await this.participantService.leaveRoom(req.user.id, room_id)
            return res.status(200).json({
                message: 'Successfully left room'
            })
        } catch (error) {
            console.log('Error current user leaving room: ', error)

            if (error.message === 'Participant not found')
                return res.status(404).json({
                    message: 'Leave room failed',
                    error: 'Participant not found'
                })

            if (error.status === 401) 
                return res.status(401).json({
                    message: 'Unauthorized',
                    error: 'Invalid token'
                })

            return res.status(500).json({
                message: 'Server error leaving room',
                error: error.message
            })
        }
    }

    // for admin
    getRoomParticipantsAdmin = async (req, res) => {
        // console.log('getRoomParticipants called: ' , req)
        // const {room_id} = req.body
        const { room_id } = req.params
        // console.log(req.query)
        const withXp = req.query.withXp === 'true';
        const compe_id = req.query.compe_id ? parseInt(req.query.compe_id) : -1; 
        // console.log('getRoomParticipants called 1: ', room_id)
        try {
            const participants = await this.participantService.getRoomParticipantsForAdmin(room_id, req.user.id, withXp, compe_id)
            // console.log('getRoomParticipants called 2: ', participants)
            return res.status(200).json({
               message: 'Successfully fetched participants',
               data: participants 
            })
            // console.log('getRoomParticipants called 3: ', res.data)
        } catch (error) {
            console.log('Error fetching participants: ', error)

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
                message: 'Server error fetching participants',
                error: error.message
            })
        }
    }
    
    // for users
    getRoomParticipantsUser = async (req, res) => {
        const { room_id } = req.params 
        const withXp = req.query.withXp === 'true';
        const compe_id = req.query.compe_id ? parseInt(req.query.compe_id) : -1; 
        try {
            const participants = await this.participantService.getRoomParticipantsForUser(room_id, req.user.id, withXp, compe_id)
            console.log('participants: ', participants)
            return res.status(200).json({
                message: 'Successfully fetched participants',
                data: participants
            })
        } catch (error) {
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
                message: 'Server error fetching participants',
                error: error.message
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
        // console.log(req.params)
        const {room_id} = req.params

        try {
            const count = await this.participantService.getTotalParticipants(room_id)
            res.status(200).json({
                total_participants: count
            })
        } catch (error) {
            console.error('Error getting participant count')
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
            return res.status(201).json({
                message: 'Successfully removed a participant'
            })
        } catch (error) {
            // console.error('Error removing participant: ', error)
            if (error.message === 'Participant not found') {
                return res.status(404).json({
                    message: 'Participant not found',
                    error: 'Not found'
                })
            }
            if (error.status === 401) {
                return res.status(401).json({
                    message: 'Unauthorized - Invalid token',
                    error: 'Invalid token'
                })
            }
            return res.status(500).json({
                message: 'Server error removing participant',
                error: error.message
            })
        }
    }

    joinedRooms = async (req, res) => {
        // console.log('joinedRooms called: ', req.user.id)
        try {
            const data = await this.participantService.getJoinedRooms(req.user.id)
            if (!data) {
                return res.status(404).json({
                    message: 'No joined rooms found',
                    error: 'Not found'
                })
            }
            return res.status(200).json({
                message: 'Successfully fetched joined rooms',
                data: data
            })
        } catch (error) {
            console.error('Error fetching joined rooms: ', error)
            if (error.status === 400) {
                return res.status(400).json({
                    message: 'Bad request',
                    error: error.message
                })
            }
            if (error.status === 401) {
                return res.status(401).json({
                    message: 'Unauthorized',
                    error: 'Invalid token'
                })
            }
            return res.status(500).json({
                message: 'Server error fetching joined rooms',
                error: error.message
            })
        }
    }

    async inviteByEmail(req, res) {
        const { email, roomCode } = req.body;
        try {
            await this.participantService.inviteByEmail(email, roomCode);
                return res.json({ 
                    message: 'Invitation sent successfully' 
                });
            } catch (error) {
                if (error.status === 400) {
                    return res.status(400).json({ 
                        message: 'Failed to send invitation.',
                        error: error.message 
                    });
                }
                if (error.status === 404) {
                    return res.status(404).json({ 
                        message: 'Failed to send invitation.',
                        error: error.message 
                    });
                }
                if (error.status === 401) {
                    return res.status(401).json({ 
                        message: 'Unauthorized',
                        error: 'Invalid token' 
                    });
                }
                return res.status(500).json({ 
                    message: 'Failed to send invitation.',
                    error: error.message 
                });
            }
        }
}

module.exports = ParticipantController