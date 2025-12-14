const probModel = require('../../domain/models/Problem')

class ProblemRepo {
  constructor(supabase) {
    this.supabase = supabase;
    this.tableName = 'problems'
    this.tableCompe = 'competition_problems'
  }

  async createRoomProb(problemData) {
    try {

      const { 
        data,
        error
       } = await this.supabase
        .from(this.tableName)
        .insert([problemData])
        .select()
        .single();
  
      if (error) throw error;
      return probModel.fromDbRoom(data);
    } catch (error) {
      throw error
    }
  }

  async createCompeProb(prob_id, timer) {
    try {
      const { 
        data,
        error
       } = await this.supabase
        .from(this.tableCompe)
        .insert({
          problem_id: prob_id,
          timer: timer
        })
        .select()
        .single();
  
      if (error) throw error;
      return data;
    } catch (error) {
      throw error
    }
  }

  async fetchRoomProblems(room_id) {
    try {
      const {
        data, 
        error
      } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('room_id', room_id)
      .order('created_at', {
        ascending: false
      })

      if (error) throw error
      if (!data) return []      
      const probs = data.map(prob => {
        return probModel.fromDbRoom(prob)
      })
      return probs
    } catch (error) {
      throw error
    }
  }

  async fetchProblemById(prob_id, user_id) {
    try {
      const {
        data,
        error
      } = await this.supabase.from(this.tableName)
      .select('*')
      .eq('id', prob_id)
      .eq('creator_id', user_id)
      .single()

      if (error) throw error
      if (!data) throw new Error('Problem not found')
      return probModel.fromDbRoom(data)
    } catch (error) {
      throw error
    }
  }

  async fetchCompeById(compe_prob_id) {
    try {
      console.log('fetchCompeById prob_id', compe_prob_id)
      
      // Try to find by competition_problems.id first, then by problem_id
      let data, error;
      
      // First, try querying by competition_problems.id
      const result1 = await this.supabase
        .from(this.tableCompe)
        .select(`
          id,
          timer, 
          problem:problem_id(
            id,
            title, 
            description,
            difficulty,
            max_attempts,
            expected_xp,
            hint
          )`)
        .eq('id', compe_prob_id)
        .single()
      
      if (result1.data) {
        data = result1.data;
        error = result1.error;
      } else {
        // If not found, try querying by problem_id (for when current_problem_id is passed)
        console.log('fetchCompeById: Not found by id, trying by problem_id...');
        const result2 = await this.supabase
          .from(this.tableCompe)
          .select(`
            id,
            timer, 
            problem:problem_id(
              id,
              title, 
              description,
              difficulty,
              max_attempts,
              expected_xp,
              hint
            )`)
          .eq('problem_id', compe_prob_id)
          .limit(1)
          .single()
        
        data = result2.data;
        error = result2.error;
      }

      console.log('fetchCompeById', data, error)
      if (error) throw error
      if (!data) throw new Error('Competition problem not found')
      return data;
    } catch (error) {
      throw error
    }
  }
  
  async fetchCompeProblemByProbId(prob_id) {
    try {
      // console.log('fetchCompeProblemByProbId prob_id', prob_id)
      const {
        data, error
      } = await this.supabase
      .from(this.tableCompe)
      .select('*')
      .eq('problem_id', prob_id)
      .is('competition_id', null) // Assuming you want to fetch problems not assigned to any competition
      // .maybeSingle()
      .single()

      // console.log('fetchCompeProblemByProbId', data, error)
      if (error) throw error
      if (!data) throw new Error('Competition problem not found')
      return data;
    } catch (error) {
      throw error
    }
  }

  async updateProblem(prob_id, user_id, problemData) {
    try {
      const { 
        data,
        error
       } = await this.supabase
        .from(this.tableName)
        .update({
          ...problemData,
          'updated_at': new Date()
        })
        .eq('id', prob_id)
        .eq('creator_id', user_id)
        .select()
        .single();
  
      if (error) throw error;
      return probModel.fromDbRoom(data);
    } catch (error) {
      throw error
    }
  }

  async updateTimer(prob_id, timer) {
    try {
      const { 
        data,
        error
       } = await this.supabase
        .from(this.tableCompe)
        .update({ 'timer': timer })
        .eq('problem_id', prob_id)
        .is('competition_id', null) // Assuming you want to update timer for problems not assigned to any competition
        .select()
        .maybeSingle();
  
      if (error) throw error;
      return data;
    } catch (error) {
      throw error
    }
  }

  async deleteProblem(prob_id, user_id) {
    try {
      const { 
        data,
        error
       } = await this.supabase
        .from(this.tableName)
        .delete()
        .eq('id', prob_id)
        .eq('creator_id', user_id)
        .select()
        .single();
  
      if (error) throw error;
      return data;
    } catch (error) {
      throw error
    }
  }

  async updateProblemCompe(prob_id, compe_id) {
    try {
      const { 
        data,
        error
       } = await this.supabase
        .from(this.tableCompe)
        .update({
          competition_id: compe_id
        })
        .eq('problem_id', prob_id)
        .select()
        .single()
  
      if (error) throw error;
      return data;
    } catch (error) {
      throw error
    }
  }

  async updateProbToCompe (prob_id, compe_id) {
    try {
      const { 
        data,
        error
       } = await this.supabase
        .from(this.tableCompe)
        .update({
         'added_at': new Date(),
         'competition_id': compe_id
        })
        .eq('problem_id', prob_id)
        .select()
        .single()
  
      if (error) throw error;
      return data;
    } catch (error) {
      throw error
    }
  }

  async fetchCompeProblems(compe_id) {
    try {
      console.log('fetchCompeProblems compe_id', compe_id)
      const { 
        data,
        error
      } = await this.supabase
        .from(this.tableCompe)
        .select('*, problem:problem_id(*)') // Correct join syntax
        .eq('competition_id', compe_id)
        .order('added_at', {
          ascending: false
        })
      if (error) throw error;
      console.log('fetchCompeProblems ', data)
      return data;
    } catch (error) {
      throw error
    }
  }

  async addProbToCompe(prob_id, compe_id, timer) {
    try {
      const { 
        data,
        error
       } = await this.supabase
        .from(this.tableCompe)
        .insert({
          problem_id: prob_id,
          competition_id: compe_id,
          timer: timer,
        })
        .select()
        .single();
  
      if (error) throw error;
      return data;
    } catch (error) {
      throw error
    }
  }

  async removeCompeProblem(prob_id, compe_id) {
    try {
      const { 
        data,
        error
       } = await this.supabase
        .from(this.tableCompe)
        .delete()
        .eq('problem_id', prob_id)
        .eq('competition_id', compe_id)
        .select();
  
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error removing competition problem:', error);
      throw error
    }
  }

  /**
   * Fetch all public problems in a room with stats from the view
   * @param {string} roomId - Room ID
   * @returns {Array} Public problems with statistics
   */
  async fetchPublicProblemsWithStats(roomId) {
    try {
      const { data, error } = await this.supabase
        .from('public_problems_with_stats')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching public problems with stats:', error);
      throw error;
    }
  }

  /**
   * Fetch leaderboard for a specific problem
   * @param {string} problemId - Problem ID
   * @param {number} limit - Maximum number of entries
   * @returns {Array} Leaderboard entries with user info
   */
  async fetchProblemLeaderboard(problemId, limit = 50) {
    try {
      console.log('Fetching leaderboard for problem:', problemId, 'limit:', limit);
      
      // First try to get leaderboard entries
      const { data, error } = await this.supabase
        .from('problem_leaderboards')
        .select('*')
        .eq('problem_id', problemId)
        .order('best_score', { ascending: false })
        .order('time_taken', { ascending: true })
        .limit(limit);

      if (error) {
        console.error('Supabase error fetching leaderboard:', error);
        throw error;
      }

      console.log('Raw leaderboard data:', data);

      // If no data, return empty array
      if (!data || data.length === 0) {
        console.log('No leaderboard entries found');
        return [];
      }

      // Get user details for all user_ids
      const userIds = data.map(entry => entry.user_id);
      const { data: users, error: usersError } = await this.supabase
        .from('users')
        .select('id, email, raw_user_meta_data')
        .in('id', userIds);

      if (usersError) {
        console.warn('Could not fetch user details:', usersError);
        // Continue without user details
      }

      console.log('User details:', users);

      // Create a map of user details
      const userMap = {};
      if (users) {
        users.forEach(user => {
          userMap[user.id] = user;
        });
      }

      // Format the response
      const leaderboard = data.map((entry, index) => {
        const user = userMap[entry.user_id];
        return {
          rank: index + 1,
          user_id: entry.user_id,
          username: user?.raw_user_meta_data?.full_name || 
                    user?.raw_user_meta_data?.name || 
                    user?.email?.split('@')[0] || 
                    'Anonymous',
          best_score: entry.best_score,
          time_taken: entry.time_taken,
          attempt_count: entry.attempt_count,
          last_attempt_at: entry.last_attempt_at
        };
      });

      console.log('Formatted leaderboard:', leaderboard);
      return leaderboard;
    } catch (error) {
      console.error('Error fetching problem leaderboard:', error);
      throw error;
    }
  }

  /**
   * Fetch user's statistics for a specific problem
   * @param {string} problemId - Problem ID
   * @param {string} userId - User ID
   * @returns {Object} User's stats
   */
  async fetchUserProblemStats(problemId, userId) {
    try {
      const { data, error } = await this.supabase
        .from('problem_leaderboards')
        .select('*')
        .eq('problem_id', problemId)
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
        throw error;
      }

      return data ? {
        attempts: data.attempt_count,
        best_score: data.best_score,
        last_attempt: data.last_attempt_at,
        time_taken: data.time_taken
      } : null;
    } catch (error) {
      console.error('Error fetching user problem stats:', error);
      throw error;
    }
  }

  /**
   * Get room participant by room_id and user_id
   * @param {string} roomId - Room ID
   * @param {string} userId - User ID
   * @returns {Object} Room participant
   */
  async getRoomParticipant(roomId, userId) {
    try {
      const { data, error } = await this.supabase
        .from('room_participants')
        .select('*')
        .eq('room_id', roomId)
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching room participant:', error);
      throw error;
    }
  }

  /**
   * Create a problem attempt record
   * @param {Object} attemptData - Attempt data
   * @returns {Object} Created attempt
   */
  async createProblemAttempt(attemptData) {
    try {
      const { data, error } = await this.supabase
        .from('problem_attempts')
        .insert([attemptData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating problem attempt:', error);
      throw error;
    }
  }

  /**
   * Fetch problem by ID without user check (for grading)
   * @param {string} problemId - Problem ID
   * @returns {Object} Problem data
   */
  async fetchProblemById(problemId) {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .eq('id', problemId)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Problem not found');
      
      return probModel.fromDbRoom(data);
    } catch (error) {
      console.error('Error fetching problem by ID:', error);
      throw error;
    }
  }
}

module.exports = ProblemRepo;
