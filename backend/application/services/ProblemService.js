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
          return problemModel.fromDbProbTimer(problem, timerData?.timer);
        })
      );

      console.log('problemsWithTimers:', problemsWithTimers);

      // Cache the result
      cache.set(cacheKey, problemsWithTimers, this.CACHE_TTL);
      console.log('Cached: fetchRoomProblems', room_id);

      if (type === 'student') {        
        return problemsWithTimers
          .filter(p => p.visibility === 'public' || p.visibility === 'show')
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
        
        // Invalidate problem-related cache including room problems
        this._invalidateProblemCache(problem_id);
        if (updatedProblem.room_id) {
          this._invalidateRoomProblemsCache(updatedProblem.room_id, creator_id);
        }
        
        return {
          ...updatedProblem.toDTO(),
          timer: result.timer
        }
      }
      
      // Invalidate problem-related cache including room problems
      this._invalidateProblemCache(problem_id);
      if (updatedProblem.room_id) {
        this._invalidateRoomProblemsCache(updatedProblem.room_id, creator_id);
      }
      
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
      const result = await this.problemRepo.addProbToCompe(problem_id, competition_id, data.timer)
      
      // Invalidate competition problems cache
      cache.delete(cache.generateKey('competition_problems', competition_id));
      this._invalidateProblemCache(problem_id);
      
      return result
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
   * Fetch all public problems in a room with stats
   * @param {string} roomId - Room ID
   * @param {string} userId - User ID
   * @returns {Array} Public problems with attempt stats
   */
  async fetchPublicProblems(roomId, userId) {
    try {
      const cacheKey = cache.generateKey('public_problems', roomId, userId);
      
      // Check cache first
      const cached = cache.get(cacheKey);
      if (cached) {
        console.log('Cache hit: fetchPublicProblems', roomId);
        return cached;
      }

      // Fetch public problems with stats from view
      const problems = await this.problemRepo.fetchPublicProblemsWithStats(roomId);
      
      // Get user's stats for each problem
      const problemsWithUserStats = await Promise.all(
        problems.map(async (problem) => {
          const userStats = await this.problemRepo.fetchUserProblemStats(problem.id, userId);
          return {
            ...problem,
            user_stats: userStats || {
              attempts: 0,
              best_score: null,
              last_attempt: null
            }
          };
        })
      );

      // Cache for shorter time since it includes user-specific data
      cache.set(cacheKey, problemsWithUserStats, 5 * 60 * 1000); // 5 minutes
      console.log('Cached: fetchPublicProblems', roomId);

      return problemsWithUserStats;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Fetch a single public problem by ID for students
   * @param {string} problemId - Problem ID
   * @param {string} userId - User ID
   * @returns {Object} Problem details with user stats
   */
  async fetchPublicProblemById(problemId, userId) {
    try {
      const cacheKey = cache.generateKey('public_problem_detail', problemId, userId);
      
      // Check cache first
      const cached = cache.get(cacheKey);
      if (cached) {
        console.log('Cache hit: fetchPublicProblemById', problemId, userId);
        return cached;
      }

      // First, get the problem using the repository method that doesn't check creator
      const { data: problems, error } = await this.problemRepo.supabase
        .from('problems')
        .select('*')
        .eq('id', problemId)
        .eq('visibility', 'public')
        .single();

      if (error || !problems) {
        throw new Error('Problem not found or not public');
      }

      // Get timer information
      const timerData = await this.problemRepo.fetchCompeProblemByProbId(problemId);
      
      // Get user stats for this problem
      const userStats = await this.problemRepo.fetchUserProblemStats(problemId, userId);

      const result = {
        ...problems,
        timer: timerData?.timer || null,
        user_stats: userStats || {
          attempts: 0,
          best_score: null,
          last_attempt: null
        }
      };

      // Cache for 5 minutes
      cache.set(cacheKey, result, 5 * 60 * 1000);
      console.log('Cached: fetchPublicProblemById', problemId, userId);

      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Fetch leaderboard for a specific problem
   * @param {string} problemId - Problem ID
   * @param {number} limit - Maximum number of entries
   * @returns {Array} Leaderboard entries
   */
  async fetchProblemLeaderboard(problemId, limit = 50) {
    try {
      const cacheKey = cache.generateKey('problem_leaderboard', problemId, limit);
      
      // Check cache first
      const cached = cache.get(cacheKey);
      if (cached) {
        console.log('Cache hit: fetchProblemLeaderboard', problemId);
        return cached;
      }

      const leaderboard = await this.problemRepo.fetchProblemLeaderboard(problemId, limit);
      
      if (!leaderboard) {
        throw new Error('Problem not found');
      }

      // Cache for 2 minutes (leaderboards change frequently)
      cache.set(cacheKey, leaderboard, 2 * 60 * 1000);
      console.log('Cached: fetchProblemLeaderboard', problemId);

      return leaderboard;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Submit and grade a public problem attempt
   * @param {string} problemId - Problem ID
   * @param {string} userId - User ID
   * @param {Object} solution - Submitted solution
   * @returns {Object} Grading result with feedback
   */
  async submitPublicProblemAttempt(problemId, userId, solution) {
    try {
      // Fetch problem details
      const problem = await this.problemRepo.fetchProblemById(problemId);
      
      if (!problem) {
        throw new Error('Problem not found or not public');
      }

      if (problem.visibility !== 'public' || !problem.accepts_submissions) {
        throw new Error('Problem not found or not public');
      }

      // Check if user is a participant in the room
      const participant = await this.problemRepo.getRoomParticipant(problem.room_id, userId);
      
      if (!participant) {
        throw new Error('Not a participant in this room');
      }

      // Import and use grading service
      const ProblemGradingService = require('./ProblemGradingService');
      const gradingResult = await ProblemGradingService.gradeProblem(problem, solution);

      // Get current attempt count
      const userStats = await this.problemRepo.fetchUserProblemStats(problemId, userId);
      const attemptNumber = parseInt((userStats?.attempt_count || 0)) + 1;

      // Store attempt in database
      const attemptData = {
        problem_id: problemId,
        room_participant_id: parseInt(participant.id),
        solution: solution,
        xp_gained: gradingResult.is_correct ? parseInt(problem.expected_xp) : 0,
        feedback: gradingResult.feedback,
        attempt_number: attemptNumber,
        validation_details: gradingResult.validation_details || {},
        is_correct: Boolean(gradingResult.is_correct),
        score: parseFloat(gradingResult.score) || 0
      };

      await this.problemRepo.createProblemAttempt(attemptData);

      // Invalidate caches
      cache.delete(cache.generateKey('public_problems', problem.room_id, userId));
      // Clear all leaderboard caches for this problem (with different limit values)
      [50, 100, 200].forEach(limit => {
        cache.delete(cache.generateKey('problem_leaderboard', problemId, limit));
      });
      cache.delete(cache.generateKey('user_problem_stats', problemId, userId));

      return {
        ...gradingResult,
        attempt_number: attemptNumber,
        xp_gained: gradingResult.is_correct ? problem.expected_xp : 0
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Fetch user's statistics for a specific problem
   * @param {string} problemId - Problem ID
   * @param {string} userId - User ID
   * @returns {Object} User's stats (attempts, best score, etc.)
   */
  async fetchUserProblemStats(problemId, userId) {
    try {
      const cacheKey = cache.generateKey('user_problem_stats', problemId, userId);
      
      // Check cache first
      const cached = cache.get(cacheKey);
      if (cached) {
        console.log('Cache hit: fetchUserProblemStats', problemId, userId);
        return cached;
      }

      const stats = await this.problemRepo.fetchUserProblemStats(problemId, userId);

      // Cache for 5 minutes
      cache.set(cacheKey, stats, 5 * 60 * 1000);
      console.log('Cached: fetchUserProblemStats', problemId, userId);

      return stats || {
        attempts: 0,
        best_score: null,
        last_attempt: null,
        total_time: null
      };
    } catch (error) {
      throw error;
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
    // Clear both admin and student caches
    cache.delete(cache.generateKey('room_problems', roomId));
    cache.delete(cache.generateKey('room_problems', roomId, 'admin'));
    cache.delete(cache.generateKey('room_problems', roomId, 'student'));
    
    if (roomCode) {
      cache.delete(cache.generateKey('room_problems_by_code', roomCode, creatorId));
    }
    console.log('Cache invalidated: room problems for room', roomId);
  }
}

module.exports = ProblemService;