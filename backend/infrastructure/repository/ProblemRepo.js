class ProblemRepo {
  constructor(supabase) {
    this.supabase = supabase;
    this.tableName = 'problems'
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
}

module.exports = ProblemRepo;
