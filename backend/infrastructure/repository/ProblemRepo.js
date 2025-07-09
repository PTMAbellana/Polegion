/**
 * ProblemRepo handles direct database operations for problems.
 */
class ProblemRepo {
  constructor(supabase) {
    this.supabase = supabase;
  }

  /**
   * Saves a new problem to the database.
   * @param {Object} problemData - The problem data to save.
   * @returns {Promise<Object>} - The saved problem.
   */
  async createProblem(problemData) {
    // Replace with your actual DB logic
    const { data, error } = await this.supabase
      .from('problems')
      .insert([problemData])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}

module.exports = ProblemRepo;