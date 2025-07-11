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
    this.router.post('/', this.problemController.createProblem);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = ProblemRoutes;