const probModel = require('../../domain/models/Problem')

class ProblemRepo {
  constructor(supabase) {
    this.supabase = supabase;
    this.tableName = 'problems'
    this.tableCompe = 'competition_problems'
  }

  async create(problemData) {
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

}

module.exports = ProblemRepo;
