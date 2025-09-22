// Problem management endpoints - Complete set based on ProblemRoutes.js
module.exports = {
  "/problems": {
    post: {
      tags: ["Problems"],
      summary: "Create a new problem",
      description: "Create a new programming problem",
      security: [{ bearerAuth: [] }],
      requestBody: { $ref: "#/components/requestBodies/CreateProblem" },
      responses: {
        201: {
          description: "Problem created successfully",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Success" },
                  {
                    type: "object",
                    properties: {
                      data: { $ref: "#/components/schemas/Problem" }
                    }
                  }
                ]
              }
            }
          }
        },
        401: { $ref: "#/components/responses/UnauthorizedError" },
        400: { $ref: "#/components/responses/BadRequestError" }
      }
    }
  },

  "/problems/room-code/{room_code}": {
    get: {
      tags: ["Problems"],
      summary: "Get room problems by code",
      description: "Retrieve all problems in a room using room code",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/RoomCode" }],
      responses: {
        200: {
          description: "Room problems retrieved successfully",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Success" },
                  {
                    type: "object",
                    properties: {
                      data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Problem" }
                      }
                    }
                  }
                ]
              }
            }
          }
        },
        404: { $ref: "#/components/responses/NotFoundError" },
        401: { $ref: "#/components/responses/UnauthorizedError" }
      }
    }
  },

  "/problems/update-timer/{problem_id}": {
    put: {
      tags: ["Problems"],
      summary: "Update problem timer",
      description: "Update the timer for a specific problem",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/ProblemId" }],
      requestBody: { $ref: "#/components/requestBodies/UpdateTimer" },
      responses: {
        200: {
          description: "Problem timer updated successfully",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Success" },
                  {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Timer updated successfully" },
                      data: { $ref: "#/components/schemas/Problem" }
                    }
                  }
                ]
              }
            }
          }
        },
        404: { $ref: "#/components/responses/NotFoundError" },
        401: { $ref: "#/components/responses/UnauthorizedError" },
        400: { $ref: "#/components/responses/BadRequestError" }
      }
    }
  },

  "/problems/compe-problems/{competition_id}": {
    get: {
      tags: ["Problems"],
      summary: "Get competition problems",
      description: "Retrieve all problems in a competition",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/CompetitionId" }],
      responses: {
        200: {
          description: "Competition problems retrieved successfully",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Success" },
                  {
                    type: "object",
                    properties: {
                      data: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            id: { type: "string", example: "compe-problem-uuid-123" },
                            problem: { $ref: "#/components/schemas/Problem" },
                            order: { type: "integer", example: 1 },
                            points: { type: "integer", example: 100 }
                          }
                        }
                      }
                    }
                  }
                ]
              }
            }
          }
        },
        404: { $ref: "#/components/responses/NotFoundError" },
        401: { $ref: "#/components/responses/UnauthorizedError" }
      }
    }
  },

  "/problems/{room_id}": {
    get: {
      tags: ["Problems"],
      summary: "Get room problems",
      description: "Retrieve all problems in a room",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/RoomId" }],
      responses: {
        200: {
          description: "Room problems retrieved successfully",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Success" },
                  {
                    type: "object",
                    properties: {
                      data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Problem" }
                      }
                    }
                  }
                ]
              }
            }
          }
        },
        404: { $ref: "#/components/responses/NotFoundError" },
        401: { $ref: "#/components/responses/UnauthorizedError" }
      }
    }
  },

  "/problems/{problem_id}": {
    get: {
      tags: ["Problems"],
      summary: "Get problem by ID",
      description: "Retrieve a specific problem by its ID",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/ProblemId" }],
      responses: {
        200: {
          description: "Problem retrieved successfully",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Success" },
                  {
                    type: "object",
                    properties: {
                      data: { $ref: "#/components/schemas/Problem" }
                    }
                  }
                ]
              }
            }
          }
        },
        404: { $ref: "#/components/responses/NotFoundError" },
        401: { $ref: "#/components/responses/UnauthorizedError" }
      }
    },

    put: {
      tags: ["Problems"],
      summary: "Update problem",
      description: "Update a problem's information",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/ProblemId" }],
      requestBody: { $ref: "#/components/requestBodies/UpdateProblem" },
      responses: {
        200: {
          description: "Problem updated successfully",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Success" },
                  {
                    type: "object",
                    properties: {
                      data: { $ref: "#/components/schemas/Problem" }
                    }
                  }
                ]
              }
            }
          }
        },
        404: { $ref: "#/components/responses/NotFoundError" },
        401: { $ref: "#/components/responses/UnauthorizedError" },
        400: { $ref: "#/components/responses/BadRequestError" }
      }
    },

    delete: {
      tags: ["Problems"],
      summary: "Delete problem",
      description: "Delete a problem",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/ProblemId" }],
      responses: {
        200: {
          description: "Problem deleted successfully",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Success" },
                  {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Problem deleted successfully" }
                    }
                  }
                ]
              }
            }
          }
        },
        404: { $ref: "#/components/responses/NotFoundError" },
        401: { $ref: "#/components/responses/UnauthorizedError" }
      }
    }
  },

  "/problems/{problem_id}/{competition_id}": {
    post: {
      tags: ["Problems"],
      summary: "Add problem to competition",
      description: "Add a problem to a competition",
      security: [{ bearerAuth: [] }],
      parameters: [
        { $ref: "#/components/parameters/ProblemId" },
        { $ref: "#/components/parameters/CompetitionId" }
      ],
      requestBody: { $ref: "#/components/requestBodies/AddCompeProblem" },
      responses: {
        201: {
          description: "Problem added to competition successfully",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Success" },
                  {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Problem added to competition successfully" },
                      data: {
                        type: "object",
                        properties: {
                          id: { type: "string", example: "compe-problem-uuid-123" },
                          problemId: { type: "string", example: "problem-uuid-456" },
                          competitionId: { type: "string", example: "competition-uuid-789" },
                          order: { type: "integer", example: 1 }
                        }
                      }
                    }
                  }
                ]
              }
            }
          }
        },
        404: { $ref: "#/components/responses/NotFoundError" },
        401: { $ref: "#/components/responses/UnauthorizedError" },
        400: { $ref: "#/components/responses/BadRequestError" }
      }
    },

    delete: {
      tags: ["Problems"],
      summary: "Remove problem from competition",
      description: "Remove a problem from a competition",
      security: [{ bearerAuth: [] }],
      parameters: [
        { $ref: "#/components/parameters/ProblemId" },
        { $ref: "#/components/parameters/CompetitionId" }
      ],
      responses: {
        200: {
          description: "Problem removed from competition successfully",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Success" },
                  {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Problem removed from competition successfully" }
                    }
                  }
                ]
              }
            }
          }
        },
        404: { $ref: "#/components/responses/NotFoundError" },
        401: { $ref: "#/components/responses/UnauthorizedError" }
      }
    }
  },

  "/problems/compe-problem/{compe_prob_id}": {
    get: {
      tags: ["Problems"],
      summary: "Get current competition problem",
      description: "Retrieve a specific competition problem by its ID",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/CompeProbId" }],
      responses: {
        200: {
          description: "Competition problem retrieved successfully",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Success" },
                  {
                    type: "object",
                    properties: {
                      data: {
                        type: "object",
                        properties: {
                          id: { type: "string", example: "compe-problem-uuid-123" },
                          problem: { $ref: "#/components/schemas/Problem" },
                          competition: { $ref: "#/components/schemas/Competition" },
                          order: { type: "integer", example: 1 },
                          isActive: { type: "boolean", example: true }
                        }
                      }
                    }
                  }
                ]
              }
            }
          }
        },
        404: { $ref: "#/components/responses/NotFoundError" },
        401: { $ref: "#/components/responses/UnauthorizedError" }
      }
    }
  }
};