const express = require('express');

class ProblemRoutes {
  constructor(problemController, authMiddleware) {
    this.problemController = problemController;
    this.authMiddleware = authMiddleware;
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.use(this.authMiddleware.protect)

    // More specific routes first
    this.router.route('/room-code/:room_code')
      .get(this.problemController.getRoomProblemsByCode)

    this.router.route('/update-timer/:problem_id')
      .put(this.problemController.updateTimer)

    this.router.route('/compe-problems/:competition_id')
      .get(this.problemController.getAllCompeProblems)

    // Generic routes after
    this.router.route('/')
      .post(this.problemController.createProblem)

    this.router.route('/:room_id')
      .get(this.problemController.getRoomProblems)

    this.router.route('/:problem_id')
      .get(this.problemController.getProblem)
      .delete(this.problemController.deleteProblem)
      .put(this.problemController.updateProblem)
  
    this.router.route('/:problem_id/:competition_id')
      .post(this.problemController.addCompeProblem)
      .delete(this.problemController.removeCompeProblem)

    this.router.route('/compe-problem/:compe_prob_id')
      .get(this.problemController.getCurrCompeProblem)
  }

  getRouter() {
    return this.router;
  }
}

module.exports = ProblemRoutes;