class ProblemController {
  constructor(problemService) {
    this.problemService = problemService;
  }

  createProblem = async (req, res) => {
    try { 
      // console.log(req.body)
      // console.log(req.user)
      const problem = await this.problemService.createProblem(req.body, req.user);
      res.status(201).json('message: Successfully saved the problem');

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create problem" });
    }
  }
}

module.exports = ProblemController;
