const express = require('express');

/**
 * ProblemRoutes defines the HTTP routes for problems.
 */
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
    // Add more routes as needed
  }

  getRouter() {
    return this.router;
  }
}

module.exports = ProblemRoutes;