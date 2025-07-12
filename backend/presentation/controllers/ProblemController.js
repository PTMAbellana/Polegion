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
}

module.exports = ProblemController;
