const cache = require('../cache');
const problemModel = require('../../domain/models/Problem');

class ProblemService {
  constructor(problemRepo, roomService) {
    this.problemRepo = problemRepo
    this.roomService = roomService
    this.CACHE_TTL = 10 * 60 * 1000; // 10 minutes for problems
  }

  async createProblem(data, creator) {
    try {
      const room = await this.roomService.getRoomByCodeUsers(data.room_code)
      const {timer, ...rest} = data.problemData
      const compile = {
        ...rest,
        creator_id: creator.id,
        room_id: room.id
      }
      
      const res = await this.problemRepo.createRoomProb(compile);
   
      if (!res) throw new Error('Problem creation failed')
      const result = await this.problemRepo.createCompeProb(res.id, timer)

      // Invalidate room problems cache
      this._invalidateRoomProblemsCache(room.id, creator.id, data.room_code);

      return {
        ...res.toDTO(),
        timer: result.timer
      }
    } catch (error) {
      throw error
    }
  }
  
  async fetchRoomProblems(room_id, type) {
    console.log('i am correct!')
    try {
      const cacheKey = cache.generateKey('room_problems', room_id);
      
      // Check cache first
      const cached = cache.get(cacheKey);
      if (cached) {
        console.log('Cache hit: fetchRoomProblems', room_id);
        return cached;
      }

      const problems = await this.problemRepo.fetchRoomProblems(room_id, type);

      if (!problems || problems.length === 0) return [];
      
      const problemsWithTimers = await Promise.all(
        problems.map(async problem => {
          const timerData = await this.problemRepo.fetchCompeProblemByProbId(problem.id);
          return problemModel.fromDbProbTimer({...problem, timer: timerData?.timer});
        })
      );

      // Cache the result
      cache.set(cacheKey, problemsWithTimers, this.CACHE_TTL);
      console.log('Cached: fetchRoomProblems', room_id);

      if (type === 'student') {        
        return problemsWithTimers
          .filter(p => p.visibility === 'show')
          .map(p => p.toReturnStudentDTO());
      }
      console.log('problemsWithTimers:', problemsWithTimers);
      return problemsWithTimers.map(p => p.toReturnTeacherDTO());
    } catch (error) {
      throw error;
    }
  }
  
  async fetchRoomProblemsByCode(room_code, creator_id) {
    try {
      const cacheKey = cache.generateKey('room_problems_by_code', room_code, creator_id);
      
      // Check cache first
      const cached = cache.get(cacheKey);
      if (cached) {
        console.log('Cache hit: fetchRoomProblemsByCode', room_code, creator_id);
        return cached;
      }
      
      const room = await this.roomService.getRoomByCodeUsers(room_code)
      if (!room) throw new Error('Room not found')
      
      const problems = await this.problemRepo.fetchRoomProblems(room.id, creator_id)
      if (!problems || problems.length === 0) return [];
      
      const problemsWithTimers = await Promise.all(
        problems.map(async problem => {
          const timerData = await this.problemRepo.fetchCompeProblemByProbId(problem.id);
          return {
            ...problem,
            timer: timerData?.timer
          };
        })
      );
      
      // Cache the result
      cache.set(cacheKey, problemsWithTimers, this.CACHE_TTL);
      console.log('Cached: fetchRoomProblemsByCode', room_code, creator_id);
      
      return problemsWithTimers;
    } catch (error) {
      throw error
    }
  }

  async fetchProblem(problem_id, creator_id) {
    try {
      const cacheKey = cache.generateKey('problem_detail', problem_id, creator_id);
      
      // Check cache first
      const cached = cache.get(cacheKey);
      if (cached) {
        console.log('Cache hit: fetchProblem', problem_id, creator_id);
        return cached;
      }
      
      const res = await this.problemRepo.fetchProblemById(problem_id, creator_id)
      const data = await this.problemRepo.fetchCompeProblemByProbId(problem_id)
      const result = {
        ...res,
        timer: data.timer 
      }
      
      // Cache the result
      cache.set(cacheKey, result, this.CACHE_TTL);
      console.log('Cached: fetchProblem', problem_id, creator_id);
      
      return result;
    } catch (error) {
      throw error
    }
  }

  async fetchCurrCompeProblem(compe_prob_id) {
    try {
      const cacheKey = cache.generateKey('compe_problem', compe_prob_id);
      
      // Check cache first
      const cached = cache.get(cacheKey);
      if (cached) {
        console.log('Cache hit: fetchCurrCompeProblem', compe_prob_id);
        return cached;
      }
      
      const result = await this.problemRepo.fetchCompeById(compe_prob_id);
      
      // Cache the result
      if (result) {
        cache.set(cacheKey, result, this.CACHE_TTL);
        console.log('Cached: fetchCurrCompeProblem', compe_prob_id);
      }
      
      return result;
    } catch (error) {
      throw error
    }
  }

  async updateTimer(problem_id, timer) {
    try {
      const ok = await this.problemRepo.fetchCompeProblemByProbId(problem_id)
      if (!ok) throw new Error('Problem not found')
      
      let result;
      if (ok.competition_id !== null) {
        result = await this.problemRepo.createCompeProb(problem_id, timer);
      } else {
        result = await this.problemRepo.updateTimer(problem_id, timer);
        if (!result) throw new Error('Timer update failed');
      }
      
      // Invalidate problem-related cache
      this._invalidateProblemCache(problem_id);
      
      return result;
    } catch (error) {
      throw error
    }
  }

  async deleteProblem(problem_id, creator_id) {
    try {
      const result = await this.problemRepo.deleteProblem(problem_id, creator_id);
      
      // Invalidate problem-related cache
      this._invalidateProblemCache(problem_id);
      
      return result;
    } catch (error) {
      throw error
    }
  }

  async updateProblem(problem_id, creator_id, problemData) {
    try {
      const {timer, ...rest} = problemData
      const updatedProblem = await this.problemRepo.updateProblem(problem_id, creator_id, rest)
      if (timer) {
        const result = await this.problemRepo.updateTimer(problem_id, timer)
        return {
          ...updatedProblem.toDTO(),
          timer: result.timer
        }
      }
      
      // Invalidate problem-related cache
      this._invalidateProblemCache(problem_id);
      
      return {
        ...updatedProblem.toDTO(),
        timer: timer
      }
    } catch (error) {
      console.log('Error in updateProblem:', error);
      throw error
    }
  }

  async fetchCompeProblems(competition_id){  
    try {
      const cacheKey = cache.generateKey('competition_problems', competition_id);
      
      // Check cache first
      const cached = cache.get(cacheKey);
      if (cached) {
        console.log('Cache hit: fetchCompeProblems', competition_id);
        return cached;
      }
      
      const result = await this.problemRepo.fetchCompeProblems(competition_id);
      
      // Cache the result
      if (result) {
        cache.set(cacheKey, result, this.CACHE_TTL);
        console.log('Cached: fetchCompeProblems', competition_id);
      }
      
      return result;
    } catch (error) {
      throw error
    }
  }

  async updateCompeProblem(problem_id, competition_id) {
    try {
      return await this.problemRepo.updateProbToCompe(problem_id,competition_id)
    } catch (error) {
      throw error
    }
  }

  async addCompeProblem(problem_id, competition_id) {
    try {
      const data = await this.problemRepo.fetchCompeProblemByProbId(problem_id)
      return await this.problemRepo.addProbToCompe(problem_id,competition_id, data.timer)
    } catch (error) {
      throw error
    }
  }

  async removeCompeProblem(problem_id, competition_id) {
    try {
      const result = await this.problemRepo.removeCompeProblem(problem_id, competition_id);
      
      // Invalidate competition problems cache
      cache.delete(cache.generateKey('competition_problems', competition_id));
      this._invalidateProblemCache(problem_id);
      
      return result;
    } catch (error) {
      throw error
    }
  }
  
  /**
   * Helper method to invalidate problem-related cache entries
   * @param {string} problemId - Problem ID
   */
  _invalidateProblemCache(problemId) {
    // We need to invalidate caches but we don't have all the keys
    // This is a limitation of our cache invalidation strategy
    console.log('Cache invalidated: problem-related entries for problem', problemId);
    
    // For now, we can only invalidate specific problem detail cache
    // Room problems cache would need room_id which we don't have here
    // This is a trade-off between performance and perfect cache consistency
  }
  
  /**
   * Helper method to invalidate room problems cache
   * @param {string} roomId - Room ID
   * @param {string} creatorId - Creator ID
   * @param {string} roomCode - Room Code (optional)
   */
  _invalidateRoomProblemsCache(roomId, creatorId, roomCode = null) {
    cache.delete(cache.generateKey('room_problems', roomId, creatorId));
    if (roomCode) {
      cache.delete(cache.generateKey('room_problems_by_code', roomCode, creatorId));
    }
    console.log('Cache invalidated: room problems for room', roomId);
  }
}

module.exports = ProblemService;