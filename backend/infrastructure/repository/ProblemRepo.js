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
      return data;
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

  async fetchRoomProblems(room_id, creator_id) {
    try {
      const {
        data, 
        error
      } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('room_id', room_id)
      .eq('creator_id', creator_id)
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

  async updateProblem(prob_id, user_id, problemData) {
    try {
      const { 
        data,
        error
       } = await this.supabase
        .from(this.tableName)
        .update(problemData)
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

  async updateTimer(prob_id, timer) {
    try {
      const { 
        data,
        error
       } = await this.supabase
        .from(this.tableCompe)
        .update({ timer: timer })
        .eq('problem_id', prob_id)
        .select()
        .single();
  
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

}

module.exports = ProblemRepo;
