/**
 * ProblemController handles HTTP requests for problems.
 */
class ProblemController {
  constructor(problemService) {
    this.problemService = problemService;
    this.createProblem = this.createProblem.bind(this);
  }

  /**
   * Handles POST /problems to create a new problem.
   */
  async createProblem(req, res) {
    try {
      const problemData = req.body;
      const savedProblem = await this.problemService.createProblem(problemData);
      res.status(201).json({ success: true, problem: savedProblem });
    } catch (error) {
      res.status(500).json({ error: error.message || 'Failed to save problem.' });
    }
  }
}

module.exports = ProblemController;