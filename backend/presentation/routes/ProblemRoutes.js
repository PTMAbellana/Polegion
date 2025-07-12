const express = require('express');

class ProblemRoutes {
  constructor(problemController, authMiddleware) {
    this.problemController = problemController;
    this.authMiddleware = authMiddleware;
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.use(this.authMiddleware.protect);

    this.router.route('/')
    .post(this.problemController.createProblem)
    
    this.router.route('/:room_id')
    .get(this.problemController.getRoomProblems)
  }

  getRouter() {
    return this.router;
  }
}

module.exports = ProblemRoutes;