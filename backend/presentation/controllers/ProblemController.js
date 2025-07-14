class ProblemController {
  constructor(problemService) {
    this.problemService = problemService;
  }

  createProblem = async (req, res) => {
    try { 
      console.log(req.body)
      // console.log(req.user)
      const problem = await this.problemService.createProblem(req.body, req.user);
      res.status(201).json('message: Successfully saved the problem');

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create problem" });
    }
  }

  getRoomProblems = async (req, res) => {
    const { room_id } = req.params
    try{
      const problems = await this.problemService.fetchRoomProblems(room_id, req.user.id)
      res.status(200).json(problems)
    } catch (error){
      console.log(error)
      res.status(500).json({
        error: 'Server error failed to get problems'
      })
    }
  }

  getRoomProblemsByCode = async (req, res) => {
    const { room_code } = req.params
    try {
      const problems = await this.problemService.fetchRoomProblemsByCode(room_code, req.user.id)
      res.status(200).json(problems)
    } catch (error) {
      console.error('Error fetching problems by room code:', error);
      res.status(500).json({ error: 'Server Error: Failed to fetch problems by room code' });
    }
  }

  getProblem = async (req, res) => {
    const { problem_id } = req.params
    try {
      const problem = await this.problemService.fetchProblem(problem_id, req.user.id)
      res.status(200).json(problem)
    } catch (error) {
      console.error('Error fetching problem:', error);
      res.status(500).json({ error: 'Server Error: Failed to fetch problem' });
    }
  }

  deleteProblem = async (req, res) => {
    const { problem_id } = req.params
    try {
      await this.problemService.deleteProblem(problem_id, req.user.id)
      res.status(200).json({ message: 'Problem deleted successfully' })
    } catch (error) {
      console.error('Error deleting problem:', error);
      res.status(500).json({ error: 'Server Error: Failed to delete problem' });
    }
  }

  updateProblem = async (req, res) => {
    const { problem_id } = req.params
    try {
      const updatedProblem = await this.problemService.updateProblem(problem_id, req.user.id, req.body)
      res.status(200).json(updatedProblem)
    } catch (error) {
      console.error('Error updating problem:', error);
      res.status(500).json({ error: 'Server Error: Failed to update problem' });
    }
  }
}

module.exports = ProblemController;
