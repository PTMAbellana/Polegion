// Competition management endpoints - Complete set based on CompetitionRoutes.js
module.exports = {
  "/competitions": {
    post: {
      tags: ["Competitions"],
      summary: "Create a new competition",
      description: "Create a new competition in a room",
      security: [{ bearerAuth: [] }],
      requestBody: { $ref: "#/components/requestBodies/CreateCompetition" },
      responses: {
        201: {
          description: "Competition created successfully",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Success" },
                  {
                    type: "object",
                    properties: {
                      data: { $ref: "#/components/schemas/Competition" }
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

  "/competitions/{room_id}": {
    get: {
      tags: ["Competitions"],
      summary: "Get all competitions in room",
      description: "Retrieve all competitions in a specific room",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/RoomId" }],
      responses: {
        200: {
          description: "Competitions retrieved successfully",
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
                        items: { $ref: "#/components/schemas/Competition" }
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

  "/competitions/{room_id}/{compe_id}": {
    get: {
      tags: ["Competitions"],
      summary: "Get competition by ID",
      description: "Retrieve a specific competition by room ID and competition ID",
      security: [{ bearerAuth: [] }],
      parameters: [
        { $ref: "#/components/parameters/RoomId" },
        { $ref: "#/components/parameters/CompeId" }
      ],
      responses: {
        200: {
          description: "Competition retrieved successfully",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Success" },
                  {
                    type: "object",
                    properties: {
                      data: { $ref: "#/components/schemas/Competition" }
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

  "/competitions/{compe_id}/start": {
    post: {
      tags: ["Competitions"],
      summary: "Start competition",
      description: "Start a competition and begin the first problem",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/CompeId" }],
      responses: {
        200: {
          description: "Competition started successfully",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Success" },
                  {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Competition started successfully" },
                      data: {
                        type: "object",
                        properties: {
                          competition: { $ref: "#/components/schemas/Competition" },
                          currentProblem: { $ref: "#/components/schemas/Problem" },
                          startTime: { type: "string", format: "date-time", example: "2024-01-15T10:00:00Z" }
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
        400: {
          description: "Competition already started or no problems",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Error" },
                  {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Competition already started" }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  },

  "/competitions/{compe_id}/next": {
    patch: {
      tags: ["Competitions"],
      summary: "Move to next problem",
      description: "Advance competition to the next problem",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/CompeId" }],
      responses: {
        200: {
          description: "Moved to next problem successfully",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Success" },
                  {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Moved to next problem successfully" },
                      data: {
                        type: "object",
                        properties: {
                          currentProblem: { $ref: "#/components/schemas/Problem" },
                          problemNumber: { type: "integer", example: 2 },
                          totalProblems: { type: "integer", example: 5 }
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
        400: {
          description: "No more problems or competition not active",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Error" },
                  {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "No more problems available" }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  },

  "/competitions/{compe_id}/pause": {
    patch: {
      tags: ["Competitions"],
      summary: "Pause competition",
      description: "Pause an active competition",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/CompeId" }],
      responses: {
        200: {
          description: "Competition paused successfully",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Success" },
                  {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Competition paused successfully" },
                      data: {
                        type: "object",
                        properties: {
                          competition: { $ref: "#/components/schemas/Competition" },
                          pausedAt: { type: "string", format: "date-time", example: "2024-01-15T10:30:00Z" }
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
        400: {
          description: "Competition not active",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Error" },
                  {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Competition is not active" }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  },

  "/competitions/{compe_id}/resume": {
    patch: {
      tags: ["Competitions"],
      summary: "Resume competition",
      description: "Resume a paused competition",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/CompeId" }],
      responses: {
        200: {
          description: "Competition resumed successfully",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Success" },
                  {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Competition resumed successfully" },
                      data: {
                        type: "object",
                        properties: {
                          competition: { $ref: "#/components/schemas/Competition" },
                          resumedAt: { type: "string", format: "date-time", example: "2024-01-15T10:35:00Z" }
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
        400: {
          description: "Competition not paused",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Error" },
                  {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Competition is not paused" }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  },

  "/competitions/{compe_id}/auto-advance": {
    post: {
      tags: ["Competitions"],
      summary: "Enable auto-advance",
      description: "Enable automatic advancement to next problem after timer",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/CompeId" }],
      requestBody: { $ref: "#/components/requestBodies/AutoAdvance" },
      responses: {
        200: {
          description: "Auto-advance enabled successfully",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Success" },
                  {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Auto-advance enabled successfully" },
                      data: {
                        type: "object",
                        properties: {
                          autoAdvance: { type: "boolean", example: true },
                          advanceInterval: { type: "integer", example: 300 }
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
    }
  }
};