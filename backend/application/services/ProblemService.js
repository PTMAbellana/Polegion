/**
 * ProblemService contains business logic for problems.
 */
class ProblemService {
  constructor(problemRepo) {
    this.problemRepo = problemRepo;
  }

  /**
   * Creates and saves a new problem.
   * @param {Object} problemData - The problem data.
   * @returns {Promise<Object>} - The saved problem.
   */
  async createProblem(problemData) {
    // Add any business logic here (validation, etc.)
    return await this.problemRepo.createProblem(problemData);
  }
}

module.exports = ProblemService;