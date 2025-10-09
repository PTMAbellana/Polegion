// const userModel = require('../../domain/models/User')
const Mailer = require('../../utils/Mailer'); // Adjust path as needed
const cache = require('../cache');
const participantModel = require('../../domain/models/Participant');
class ParticipantService {
    constructor(participantRepo, roomService, userService, leaderService){
        this.participantRepo = participantRepo
        this.roomService = roomService
        this.userService = userService
        this.leaderService = leaderService
        
        // Different cache TTLs for different data types
        this.PARTICIPANT_CACHE_TTL = 15 * 60 * 1000; // 15 minutes for basic participant data
        this.XP_CACHE_TTL = 2 * 60 * 1000; // 2 minutes for XP data (changes frequently)
    }

    // Cache invalidation helper methods
    _invalidateParticipantCache(roomId, userId = null) {
        // Invalidate basic participant cache
        const basicKeys = [
            cache.generateKey('room_participants_basic', roomId, '*'),
            cache.generateKey('room_participants', roomId)
        ];
        
        // Invalidate XP cache
        const xpKeys = [
            cache.generateKey('participants_xp', roomId, '*'),
            cache.generateKey('participants_xp', roomId, null),
            cache.generateKey('participants_xp', roomId, -1)
        ];
        
        // Invalidate all related caches
        [...basicKeys, ...xpKeys].forEach(key => {
            if (key.includes('*')) {
                cache.deletePattern(key);
            } else {
                cache.delete(key);
            }
        });
        
        if (userId) {
            const userRoomsKey = cache.generateKey('user_joined_rooms', userId);
            cache.delete(userRoomsKey);
        }
        
        console.log('Invalidated participant and XP cache for room:', roomId, 'user:', userId);
    }

    // Method to invalidate only XP cache (when XP changes but participants don't)
    _invalidateXPCache(roomId, compe_id = null) {
        const xpKeys = [
            cache.generateKey('participants_xp', roomId, compe_id),
            cache.generateKey('participants_xp', roomId, null),
            cache.generateKey('participants_xp', roomId, -1)
        ];
        
        xpKeys.forEach(key => cache.delete(key));
        console.log('Invalidated XP cache for room:', roomId, 'competition:', compe_id);
    }

    //used
    async joinRoom(user_id, room_code){
        try {

            const room = await this.roomService.isRoomExist(null, room_code);
            if (!room) {
                throw new Error('Room not found');
            }
            if (room.user_id === user_id) {
                throw new Error('Already an admin');
            }
            
            const isAlreadyParticipant = await this.checkPartStatus(user_id, room.id);
            if (isAlreadyParticipant) {
                throw new Error('Already a participant in this room');
            }

            const data = await this.participantRepo.addParticipant(user_id, room.id)
            await this.leaderService.addRoomBoard(data.room_id, data.id)
            
            console.log('Participant added:', data)
            // Invalidate participant cache
            this._invalidateParticipantCache(data.room_id, user_id);
            
            // Create a Participant instance and use toReturnRoomDTO()
            const participant = participantModel.fromDBParticipant(
                data.id,
                user_id,
                room
            );
            
            return participant.toReturnRoomDTO();
        } catch (error) {
            throw error
        }
    }
    
    //used
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

    // Get basic participants (cached longer)
    async getRoomParticipantsBasic(room_id, creator_id) {
        try {
            const cacheKey = cache.generateKey('room_participants_basic', room_id, creator_id);
            
            const cached = cache.get(cacheKey);
            if (cached) {
                console.log('Cache hit: getRoomParticipantsBasic', room_id);
                return cached;
            }
            
            // Verify room exists
            const exist = await this.roomService.getRoomById(room_id, creator_id);
            if (!exist) throw new Error('Room not found or not authorized');
            
            const data = await this.participantRepo.getAllParticipants(room_id);
            
            const participants = await Promise.all(
                data.map(async (participant) => {
                    try {
                        const userData = await this.userService.getUserById(participant.user_id);
                        if (!userData) return null;
                        return participantModel.fromDBParticipant(participant.id, userData, null)
                    } catch (error) {
                        return null;
                    }
                })
            );
            
            const result = participants.filter(p => p !== null);
            
            // Cache basic participants for longer
            cache.set(cacheKey, result, this.PARTICIPANT_CACHE_TTL);
            console.log('Cache miss: getRoomParticipantsBasic', room_id);
            
            return result;
        } catch (error) {
            throw error;
        }
    }

    // Get XP data separately (cached shorter)
    async getParticipantsXPData(room_id, participants, compe_id = null) {
        try {
            const cacheKey = cache.generateKey('participants_xp', room_id, compe_id);
            
            const cached = cache.get(cacheKey);
            if (cached) {
                console.log('Cache hit: getParticipantsXPData', room_id, compe_id);
                return cached;
            }
            
            let xpData;
            if (compe_id === null || compe_id === -1) {
                // Room-level XP
                xpData = await Promise.all(
                    participants.map(async p => {
                        const res = await this.leaderService.getRoomBoardById(room_id, p.participant_id);
                        return {
                            participant_id: p.participant_id,
                            accumulated_xp: res?.accumulated_xp ?? 0
                        };
                    })
                );
            } else {
                // Competition-level XP
                xpData = await Promise.all(
                    participants.map(async p => {
                        const res = await this.leaderService.getCompeBoardById(compe_id, p.participant_id);
                        return {
                            participant_id: p.participant_id,
                            accumulated_xp: res?.accumulated_xp ?? 0
                        };
                    })
                );
            }
            
            // Cache XP data for shorter time
            cache.set(cacheKey, xpData, this.XP_CACHE_TTL);
            console.log('Cache miss: getParticipantsXPData', room_id, compe_id);
            
            return xpData;
        } catch (error) {
            throw error;
        }
    }

    //used
    // Combine participants with XP data
    async getRoomParticipantsForAdmin(room_id, creator_id, with_xp = false, compe_id = null) {
        try {
            // Always get basic participants first
            const participants = await this.getRoomParticipantsBasic(room_id, creator_id);
            
            if (!with_xp) {
                return participants;
            }
            
            // Get XP data separately
            const xpData = await this.getParticipantsXPData(room_id, participants, compe_id);
            
            // Combine the data
            const result = participants.map(participant => {
                const xp = xpData.find(x => x.participant_id === participant.participant_id);
                return {
                    ...participant,
                    accumulated_xp: xp?.accumulated_xp ?? 0
                };
            });
            
            return result;
        } catch (error) {
            throw error;
        }
    }

    //used
    //ang mu get kay ang participants
    async getRoomParticipantsForUser(room_id, user_id, with_xp = false, compe_id = null) {
        try {

            const cacheKey = cache.generateKey('room_participants_basic', room_id);
            
            const cached = cache.get(cacheKey);
            if (cached) {
                console.log('Cache hit: getRoomParticipantsBasic', room_id);
                return cached;
            }

            const data = await this.participantRepo.getAllParticipants(room_id);
            
            const parts = await Promise.all(
                data.map(async (parts) => {
                    try {
                        const userData = await this.userService.getUserById(parts.user_id);
                        if (!userData) return null;
                        return participantModel.fromDBParticipant(parts.id, userData, null)
                    } catch (error) {
                        return null;
                    }
                })
            );

            const participants = parts.filter(p => p !== null);

            // Cache basic participants for longer
            cache.set(cacheKey, participants, this.PARTICIPANT_CACHE_TTL);
            console.log('Cache miss: getRoomParticipantsBasic', room_id);

            if (!with_xp) {
                return participants;
            }
            
            const xpData = await this.getParticipantsXPData(room_id, participants, compe_id);
            
            const result = participants.map(participant => {
                const xp = xpData.find(x => x.participant_id === participant.participant_id);
                return {
                    ...participant,
                    accumulated_xp: xp?.accumulated_xp ?? 0
                };
            });
            
            return result;
        } catch (error) {
            throw error;
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

    //used
    async getJoinedRooms(user_id) {
        try {
            const cacheKey = cache.generateKey('user_joined_rooms', user_id);
            
            // Check cache first
            const cached = cache.get(cacheKey);
            if (cached) {
                console.log('Cache hit: getJoinedRooms', user_id);
                return cached;
            }
            
            const data = await this.participantRepo.getJoinedRooms(user_id)
            console.log('joined rooms service: ', data)
            
            // Transform data using Participant model and toReturnRoomDTO
            const transformedData = data.map(participantData => {
                const participant = participantModel.fromDBParticipant(
                    participantData.id,
                    participantData.user_id || participantData.user,
                    participantData.room_id || participantData.room || participantData
                );
                return participant.toReturnRoomDTO();
            });
            
            // Cache the result
            cache.set(cacheKey, transformedData, this.CACHE_TTL);
            console.log('Cache miss: getJoinedRooms', user_id);
            
            return transformedData
        } catch (error) {
            throw error
        }
    }

    //used PERO TARONGONON RAWR
    async inviteByEmail(email, roomCode) {
        const mailOptions = {
            from: "Polegion <marga18nins@gmail.com>",
            to: email,
            subject: "Invite to join a room",
            template: "invite",
            context: {
                code: roomCode,
            },
        }
        try {
            await Mailer.sendMail(mailOptions);
        } catch (error) {
            throw error
        }
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