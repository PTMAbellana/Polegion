class ProblemController {
  constructor(problemService) {
    this.problemService = problemService;
  }

  createProblem = async (req, res) => {
    try { 
      console.log(req.body)
      // console.log(req.user)
      const data = await this.problemService.createProblem(req.body, req.user);
      res.status(201).json({
        message: "Problem created successfully",
        data: data
      });

    } catch (err) {
      console.error(err);
      if (err.message === 'Room not found or not authorized') {
        return res.status(404).json({ 
          message: "Room not found or not authorized",
          error: "Not found"
        });
      }
      if (err.status === 401) {
        return res.status(401).json({ 
          message: "Unauthorized",
          error: "Invalid token"
        });
      }
      res.status(500).json({ 
        message: "Failed to create problem",
        error: err.message
      });
    }
  }

  getRoomProblems = async (req, res) => {
    const { room_id, type } = req.params
    try{
      const problems = await this.problemService.fetchRoomProblems(room_id, type)
      return res.status(200).json({
        message: 'Successfully fetched problems',
        data: problems
      })
    } catch (error){
      console.log(error)
      if (error.message === 'Room not found or not authorized')
        return res.status(404).json({
          message: 'Room not found or not authorized',
          error: 'Not found'
        })
      if (error.status === 401)
        return res.status(401).json({
          message: 'Unauthorized',
          error: 'Invalid token'
        })
      return res.status(500).json({
        message: 'Server error failed to get problems',
        error: error.message
      })
    }
  }

  getRoomProblemsByCode = async (req, res) => {
    const { room_code } = req.params
    try {
      const problems = await this.problemService.fetchRoomProblemsByCode(room_code, req.user.id)
      console.log('problems by code', problems)
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
      // console.log('problem', problem)
      res.status(200).json(problem)
    } catch (error) {
      console.error('Error fetching problem:', error);
      res.status(500).json({ error: 'Server Error: Failed to fetch problem' });
    }
  }

  getCurrCompeProblem = async (req, res) => {
    const { compe_prob_id } = req.params
    try {
      const problem = await this.problemService.fetchCurrCompeProblem(compe_prob_id)
      res.status(200).json(problem)
    } catch (error) {
      console.error('Error fetching competition problems:', error);
      res.status(500).json({ error: 'Server Error: Failed to fetch competition problems' });
    } 
  }

  deleteProblem = async (req, res) => {
    const { problem_id } = req.params
    try {
      await this.problemService.deleteProblem(problem_id, req.user.id)
      res.status(200).json({ 
        message: 'Problem deleted successfully' 
      })
    } catch (error) {
      console.error('Error deleting problem:', error);
      if (error.message === 'Problem not found or not authorized') {
        return res.status(404).json({ 
          message: 'Problem not found or not authorized',
          error: 'Not found' 
        });
      }
      if (error.status === 401) {
        return res.status(401).json({ 
          message: 'Unauthorized',
          error: 'Invalid token' 
        });
      }
      res.status(500).json({ 
        message: 'Server Error: Failed to delete problem',
        error: error.message 
      });
    }
  }

  updateProblem = async (req, res) => {
    const { problem_id } = req.params
    try {
      const data = await this.problemService.updateProblem(problem_id, req.user.id, req.body)
      res.status(200).json({
        message: 'Problem updated successfully',
        data: data
      })
    } catch (error) {
      console.error('Error updating problem:', error);
      if (error.message === 'Problem not found or not authorized') {
        return res.status(404).json({ 
          message: 'Problem not found or not authorized',
          error: 'Not found' 
        });
      }
      if (error.status === 401) {
        return res.status(401).json({ 
          message: 'Unauthorized',
          error: 'Invalid token' 
        });
      }
      res.status(500).json({ 
        message: 'Server Error: Failed to update problem',
        error: error.message 
      });
    }
  }

  updateTimer = async (req, res) => {
    const { problem_id } = req.params
    const { timer } = req.body
    try {
      const updatedTimer = await this.problemService.updateTimer(problem_id, timer)
      res.status(200).json(updatedTimer)
    } catch (error) {
      console.error('Error updating timer:', error);
      res.status(500).json({ error: 'Server Error: Failed to update timer' });
    }
  }

  getAllCompeProblems = async (req, res) => {
    const { competition_id } = req.params
    try {
      const problems = await this.problemService.fetchCompeProblems(competition_id)
      res.status(200).json(problems)
    } catch (error) {
      console.error('Error fetching competition problems:', error);
      res.status(500).json({ error: 'Server Error: Failed to fetch competition problems' });
    }
  }

  addCompeProblem = async (req, res) => {
    const { problem_id, competition_id } = req.params
    // console.log('Adding competition problem:', problem_id, competition_id)
    try {
      // const addedProblem = await this.problemService.updateCompeProblem(problem_id, competition_id)
      const addedProblem = await this.problemService.addCompeProblem(problem_id, competition_id)
      res.status(200).json(addedProblem)
    } catch (error) {
      console.error('Error adding competition problem:', error);
      res.status(500).json({ error: 'Server Error: Failed to add competition problem' });
    }
  }

  removeCompeProblem = async (req, res) => {
    const { problem_id, competition_id } = req.params
    try {
      const removedProblem = await this.problemService.removeCompeProblem(problem_id, competition_id)
      res.status(200).json(removedProblem)
    } catch (error) {
      console.error('Error removing competition problem:', error);
      res.status(500).json({ error: 'Server Error: Failed to remove competition problem' });
    }
  }

  // Get all public problems in a room
  getPublicProblems = async (req, res) => {
    const { room_id } = req.params;
    try {
      const problems = await this.problemService.fetchPublicProblems(room_id, req.user.id);
      res.status(200).json({
        message: 'Successfully fetched public problems',
        data: problems
      });
    } catch (error) {
      console.error('Error fetching public problems:', error);
      if (error.message === 'Room not found or not authorized') {
        return res.status(404).json({
          message: 'Room not found or not authorized',
          error: 'Not found'
        });
      }
      res.status(500).json({
        message: 'Server Error: Failed to fetch public problems',
        error: error.message
      });
    }
  }

  // Get a single public problem by ID
  getPublicProblem = async (req, res) => {
    const { problem_id } = req.params;
    try {
      const problem = await this.problemService.fetchPublicProblemById(problem_id, req.user.id);
      res.status(200).json({
        message: 'Successfully fetched problem',
        data: problem
      });
    } catch (error) {
      console.error('Error fetching public problem:', error);
      if (error.message === 'Problem not found or not public') {
        return res.status(404).json({
          message: 'Problem not found or not accessible',
          error: 'Not found'
        });
      }
      res.status(500).json({
        message: 'Server Error: Failed to fetch problem',
        error: error.message
      });
    }
  }

  // Get leaderboard for a specific problem
  getProblemLeaderboard = async (req, res) => {
    const { problem_id } = req.params;
    const { limit = 50 } = req.query;
    try {
      const leaderboard = await this.problemService.fetchProblemLeaderboard(problem_id, parseInt(limit));
      res.status(200).json({
        message: 'Successfully fetched leaderboard',
        data: leaderboard
      });
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      if (error.message === 'Problem not found') {
        return res.status(404).json({
          message: 'Problem not found',
          error: 'Not found'
        });
      }
      res.status(500).json({
        message: 'Server Error: Failed to fetch leaderboard',
        error: error.message
      });
    }
  }

  // Submit attempt for a public problem
  submitPublicProblemAttempt = async (req, res) => {
    const { problem_id } = req.params;
    const { solution } = req.body;
    try {
      const result = await this.problemService.submitPublicProblemAttempt(
        problem_id,
        req.user.id,
        solution
      );
      res.status(200).json({
        message: 'Submission graded successfully',
        data: result
      });
    } catch (error) {
      console.error('Error submitting problem attempt:', error);
      if (error.message === 'Problem not found or not public') {
        return res.status(404).json({
          message: 'Problem not found or not public',
          error: 'Not found'
        });
      }
      if (error.message === 'Not a participant in this room') {
        return res.status(403).json({
          message: 'Not a participant in this room',
          error: 'Forbidden'
        });
      }
      res.status(500).json({
        message: 'Server Error: Failed to submit attempt',
        error: error.message
      });
    }
  }

  // Get user's best attempt for a problem
  getUserProblemStats = async (req, res) => {
    const { problem_id } = req.params;
    try {
      const stats = await this.problemService.fetchUserProblemStats(problem_id, req.user.id);
      res.status(200).json({
        message: 'Successfully fetched user stats',
        data: stats
      });
    } catch (error) {
      console.error('Error fetching user problem stats:', error);
      res.status(500).json({
        message: 'Server Error: Failed to fetch user stats',
        error: error.message
      });
    }
  }
}

module.exports = ProblemController;
