// const userModel = require('../../domain/models/User')
const Mailer = require('../../utils/Mailer'); // Adjust path as needed
const cache = require('./cache');

class ParticipantService {
    constructor(participantRepo, roomService, userService, leaderService){
        this.participantRepo = participantRepo
        this.roomService = roomService
        this.userService = userService
        this.leaderService = leaderService
        this.CACHE_TTL = 10 * 60 * 1000; // 10 minutes for participant data
    }

    // Cache invalidation helper methods
    _invalidateParticipantCache(roomId, userId = null) {
        const roomParticipantsKey = cache.generateKey('room_participants', roomId);
        cache.delete(roomParticipantsKey);
        
        if (userId) {
            const userRoomsKey = cache.generateKey('user_joined_rooms', userId);
            cache.delete(userRoomsKey);
        }
        
        console.log('Invalidated participant cache for room:', roomId, 'user:', userId);
    }

    async joinRoom(user_id, room_code){
        try {
            const data = await this.participantRepo.addParticipant(user_id, room_code)
            // console.log('join room service ', data)
            await this.leaderService.addRoomBoard(data.room_id, data.id)
            
            // Invalidate participant cache
            this._invalidateParticipantCache(data.room_id, user_id);
            
            return data
        } catch (error) {
            throw error
        }
    }
    
    async leaveRoom(user_id, room_id){
        try {
            const result = await this.participantRepo.removeParticipant(user_id, room_id)
            
            // Invalidate participant cache
            this._invalidateParticipantCache(room_id, user_id);
            
            return result
        } catch (error) {
            throw error
        }
    }

    //ang mu get kay ang owner or ang admin
    async getRoomParticipantsForAdmin(room_id, creator_id, with_xp = false, compe_id = null ){
        try {
            const cacheKey = cache.generateKey('room_participants_admin', room_id, creator_id, with_xp, compe_id);
            
            // Check cache first
            const cached = cache.get(cacheKey);
            if (cached) {
                console.log('Cache hit: getRoomParticipantsForAdmin', room_id);
                return cached;
            }
            
            //verify if room exists
            const exist = await this.roomService.getRoomById(room_id, creator_id)
            // console.log(exist)
            if (!exist) throw new Error ('Room not found or not authorized')
            const data = await this.participantRepo.getAllParticipants(room_id)
            // console.log('data: ', data)
            const participants = await Promise.all(
                data.map(async (participant) => {
                    try {
                        // Fetch user data from users table using user_id
                        // console.log('participant: ', participant.id)
                        const userData = await this.userService.getUserById(participant.user_id)
                        if (!userData) return {}
                        return {
                            ...userData,
                            participant_id: participant.id,
                        }
                        
                    } catch (error) {
                        return {}
                    }
                })
            )
                        // console.log('participants: ', participants)
            let result;
            if (!with_xp) {
                result = participants;
            } else {
                if (compe_id === null || compe_id === -1) {
                    result = await Promise.all(
                        participants.map(async p => {
                            const res = await this.leaderService.getRoomBoardById(room_id, p.participant_id);
                            return {
                                ...p,
                                accumulated_xp: res?.accumulated_xp ?? 0
                            };
                        })
                    );
                }
                else {
                    result = await Promise.all(
                        participants.map(async p => {
                            const res = await this.leaderService.getCompeBoardById(compe_id, p.participant_id);
                            return {
                                ...p,
                                accumulated_xp: res?.accumulated_xp ?? 0
                            };
                        })
                    );
                }
            }
            
            // Cache the result
            cache.set(cacheKey, result);
            console.log('Cache miss: getRoomParticipantsForAdmin', room_id);
            
            return result
        } catch (error){
            // console.log('Error in getRoomParticipantsForAdmin service: ', error)
            throw error
        }
    }

    //ang mu get kay ang participants
    async getRoomParticipantsForUser(room_id, user_id, with_xp = false, compe_id = null){
        try {
            // console.log('I am called in services')
            //verify if room exists
            const exist = await this.roomService.isRoomExist(room_id)
            if (!exist) throw new Error ('Room not found')
            //verify if currentuser is participant
            const isPart = await this.checkPartStatus(user_id, room_id)
            if (!isPart) throw new Error ('Not authorized')
            
            const data = await this.participantRepo.getAllParticipants(room_id)
        
            const participants = await Promise.all(
                data.map(async (participant) => {
                    try {
                        // Fetch user data from users table using user_id
                        const userData = await this.userService.getUserById(participant.user_id)
                        
                        // console.log('getRoomParticipants userData: ', userData)
                        if (!userData) {
                            // console.warn(`User not found for ID: ${participant.user_id}`)
                            return {}
                        }

                        return {
                            ...userData,
                            participant_id: participant.id,
                        }
                        
                    } catch (error) {
                        // console.warn(`Error fetching user ${participant.user_id}:`, error)
                        return {}
                    }
                })
            )
            // console.log('getRoomParticipants parts: ', participants)
            
            if (!with_xp) return participants;
            else {
                if (compe_id === null || compe_id === -1) {
                    return await Promise.all(
                        participants.map(async p => {
                            const res = await this.leaderService.getRoomBoardById(room_id, p.participant_id);
                            return {
                                ...p,
                                accumulated_xp: res?.accumulated_xp ?? 0
                            };
                        })
                    );
                }
                else {
                    return await Promise.all(
                        participants.map(async p => {
                            const res = await this.leaderService.getCompeBoardById(compe_id, p.participant_id);
                            return {
                                ...p,
                                accumulated_xp: res?.accumulated_xp ?? 0
                            };
                        })
                    );
                }
            }
        } catch (error){
            // console.log('Error in getRoomParticipants service: ', error)
            throw error
        }
    }

    async checkPartStatus (user_id, room_id) {
        // console.log('i am calleed check part status ')
        try {
            return await this.participantRepo.isParticipant(user_id, room_id)
        } catch (error) {
            throw error
        }
    }

    async getTotalParticipants(room_id){
        try {
            return await this.participantRepo.getParticipantCount(room_id)
        } catch (error) {
            throw error
        }
    }

    async removeParticipant (creator, participant, room) {
        try {
            // verify if room exists
            const data = await this.roomService.getRoomById(room, creator)
            if (!data) throw new Error('Room not found or not authorized')

            return await this.participantRepo.removeParticipant(participant, room)
        } catch (error){
            throw error
        }
    }

    async getJoinedRooms(user_id) {
        try {
            const data = await this.participantRepo.getJoinedRooms(user_id)
            
            const rooms = await Promise.all(
                data.map(async (room) => {
                    try {
                        // Fetch user data from users table using user_id
                        const roomData = await this.roomService.getRoomsById(room.room_id)
                        
                        // console.log('getRoomParticipants userData: ', roomData)
                        if (!roomData) {
                            console.warn(`User not found for ID: ${room.room_id}`)
                            return null
                        }

                        return roomData
                        
                    } catch (error) {
                        console.warn(`Error fetching user ${room.room_id}:`, error)
                        return null
                    }
                })
            )
            
            return rooms
        } catch (error) {
            throw error
        }
    }

    async inviteByEmail(inviter, email, roomCode) {
//         const subject = "You're invited to join a Polegion room!";
//         const content = `Hi! ${inviter.name} (${inviter.email}) has invited you to join a room on Polegion.
// Room Code: ${roomCode}
// Join here: https://your-app-url/virtual-rooms/join/${roomCode}`;
        const mailOptions = {
            from: "Polegion <marga18nins@gmail.com>",
            to: email,
            subject: "Invite to join a room",
            template: "invite",
            context: {
                code: roomCode,
            },
        }
        await Mailer.sendMail(mailOptions);
    }

    // di ni sha mu ano sa controller
    getAllParticipants = async (room_id) => {
        try {
            return await this.participantRepo.getAllParticipants(room_id)
        } catch (error) {
            throw error
        }
    }

    getPartInfo = async (part_id) => {
        try {
            return await this.participantRepo.getParticipantById(part_id)
        } catch (error) {
            throw error
        }
    }

    getPartInfoByUserId = async (user_id, room_id) => {
        try {
            return await this.participantRepo.getParticipantByUserId(user_id, room_id)
        } catch (error) {
            throw error
        }
    }
}
module.exports = ParticipantService