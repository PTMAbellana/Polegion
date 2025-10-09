const roomModel = require('../../domain/models/Room');
const cache = require('../cache');
const service = require('../services');

class RoomService {
    constructor(roomRepo){
        this.roomRepo = roomRepo
        this.CACHE_TTL = 15 * 60 * 1000; // 15 minutes for rooms
    }

    generateCode(length = 6) {
        const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ123456789';
        let result = '';
        
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        
        return result;
    }

    //used
    async getRooms (user_id){
        try {
            const cacheKey = cache.generateKey('user_rooms', user_id);
            
            // Check cache first
            const cached = cache.get(cacheKey);
            if (cached) {
                console.log('Cache hit: getRooms', user_id);
                return cached;
            }
            
            // Fetch from database
            const result = await this.roomRepo.getAllRooms(user_id);
            
            // Cache the result
            if (result) {
                cache.set(cacheKey, result, this.CACHE_TTL);
                console.log('Cached: getRooms', user_id);
            }
            
            return result;
        } catch (error) {
            throw error
        }
    }

    async getRoomsById (room_id){
        try {
            const cacheKey = cache.generateKey('room_by_id', room_id);
            
            // Check cache first
            const cached = cache.get(cacheKey);
            if (cached) {
                console.log('Cache hit: getRoomsById', room_id);
                return cached;
            }
            
            // Fetch from database
            const result = await this.roomRepo.getRoomsById(room_id);
            
            // Cache the result
            if (result) {
                cache.set(cacheKey, result, this.CACHE_TTL);
                console.log('Cached: getRoomsById', room_id);
            }
            
            return result;
        } catch (error) {
            throw error
        }
    }

    async getRoomById (roomId, user_id){
        try {
            const cacheKey = cache.generateKey('room_by_id_user', roomId, user_id);
            
            // Check cache first
            const cached = cache.get(cacheKey);
            if (cached) {
                console.log('Cache hit: getRoomById', roomId, user_id);
                return cached;
            }
            
            // Fetch from database
            const result = await this.roomRepo.getRoomById(roomId, user_id);
            
            // Cache the result
            if (result) {
                cache.set(cacheKey, result, this.CACHE_TTL);
                console.log('Cached: getRoomById', roomId, user_id);
            }
            
            return result;
        } catch (error) {
            throw error
        }
    }

    //used
    // for teachers and admins
    async getRoomByCode (roomCode, user_id){
        try {
            const cacheKey = cache.generateKey('room_by_code_admin', roomCode, user_id);
            
            // Check cache first
            const cached = cache.get(cacheKey);
            if (cached) {
                console.log('Cache hit: getRoomByCode', roomCode, user_id);
                return cached;
            }
            
            // Fetch from database
            const room = await this.roomRepo.getRoomByCode(roomCode, user_id);
            if (!room) throw new Error('Room not found');
            const participants =  await service.participantService.getRoomParticipantsForAdmin(room.id, user_id);
            const problems = await service.problemService.fetchRoomProblems(room.id, user_id);

            const result = {
                ...room.toDTO(),
                participants: participants.map(p => p.toReturnUserDTO()),
                problems: problems.map(p => p.toReturnTeacherDTO()),
            }
            // Cache the result
            if (result) {
                cache.set(cacheKey, result, this.CACHE_TTL);
                console.log('Cached: getRoomByCode', roomCode, user_id);
            }
            
            return result;
        } catch (error) {
            throw error
        }
    }
    
    //used
    // for student
    async getRoomByCodeUsers (roomCode, user_id){
        try {
            const cacheKey = cache.generateKey('room_by_code_users', roomCode);
            
            // Check cache first
            const cached = cache.get(cacheKey);
            if (cached) {
                console.log('Cache hit: getRoomByCodeUsers', roomCode);
                return cached;
            }
            
            // Fetch from database
            const room = await this.roomRepo.getRoomByCodeUsers(roomCode);
            if (!room) throw new Error('Room not found');

            const part = await service.participantService.getPartInfoByUserId(user_id, room.id)

            if (!part) {
                throw new Error('Not a participant of the room');
            }
            const participants =  await service.participantService.getRoomParticipantsForUser(room.id, user_id);
            const problems = await service.problemService.fetchRoomProblems(room.id, room.user_id);
            const teacher = await service.userService.getUserById(room.user_id);
            const competitions = await service.competitionService.getAllCompeByRoomId(room.id);

            const result = {
                ...room.toDTO(),
                participant_id: part, // no participant id for students
                participants: participants.map(p => p.toReturnUserDTO()), // no participants for students
                problems: problems.map(p => p.toReturnStudentDTO()),
                competitions: competitions.map(c => c.toDTO()),
                teacher: teacher 
            }
            // Cache the result
            if (result) {
                cache.set(cacheKey, result, this.CACHE_TTL);
                console.log('Cached: getRoomByCodeUsers', roomCode);
            }
            
            return result;
        } catch (error) {
            console.log(error)
            throw error
        }
    }
    
    async createRoom (title, description, mantra, bannerImage, user_id, visibility){
        try {
            const code = this.generateCode(6);
            const newRoom = new roomModel (
                null,
                title,
                description,
                mantra,
                bannerImage,
                user_id,
                new Date(),
                code,
                visibility
            )
            const result = await this.roomRepo.createRoom(newRoom);
            
            // Invalidate user rooms cache
            cache.delete(cache.generateKey('user_rooms', user_id));
            console.log('Cache invalidated: createRoom');
            
            return result;
        } catch (error) {
            throw error
        }
    }
    
    async updateRoom (roomId, title, description, mantra, bannerImage, user_id){
        try {
            const ur = new roomModel(
                roomId,
                title,
                description,
                mantra,
                bannerImage,
                user_id,
                null,
                null,
                null
            )
            const result = await this.roomRepo.updateRoom(roomId, user_id, ur);
            
            // Invalidate room-related cache entries
            this._invalidateRoomCache(roomId, user_id);
            
            return result;
        } catch (error) {
            throw error
        }
    }
    
    async deleteRoom (roomId, user_id) {
        try {
            const result = await this.roomRepo.deleteRoom(roomId, user_id);
            
            // Invalidate room-related cache entries
            this._invalidateRoomCache(roomId, user_id);
            
            return result;
        } catch (error) {
            throw error
        }
    }
    
    async uploadBannerImage(fileBuffer, fileName, mimeType){
        try {
            const res = await this.roomRepo.uploadBannerImage(fileBuffer, fileName, mimeType)

            return res;
        } catch (error) {
            throw error
        }
    }

    async isRoomExist(room_id = null, room_code = null){
        try {
            if (room_id) {
                return await this.roomRepo.isRoomExistById(room_id);
            } else if (room_code) {
                return await this.roomRepo.getRoomByCodeUsers(room_code);
            }
            return false;
        } catch (error) {
            throw error
        }
    }

    async updateVisibility(room_id, user_id, visibility){
        try {
            const result = await this.roomRepo.updateVisibility(room_id, user_id, visibility);
            
            // Invalidate room-related cache entries
            this._invalidateRoomCache(room_id, user_id);
            
            return result;
        } catch (error){
            throw error
        }
    }
    
    /**
     * Helper method to invalidate room-related cache entries
     * @param {string} roomId - Room ID
     * @param {string} userId - User ID
     */
    _invalidateRoomCache(roomId, userId) {
        // Invalidate specific room caches
        cache.delete(cache.generateKey('room_by_id', roomId));
        cache.delete(cache.generateKey('room_by_id_user', roomId, userId));
        cache.delete(cache.generateKey('user_rooms', userId));
        
        // Note: We can't easily invalidate room_by_code caches without knowing the code
        // This is a trade-off for performance vs consistency
        
        console.log('Cache invalidated: room-related entries for room', roomId);
    }
}

module.exports = RoomService