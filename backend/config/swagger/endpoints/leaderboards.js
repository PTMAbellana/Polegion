// Leaderboard endpoints - Complete set based on LeaderboardRoutes.js
module.exports = {
  "/leaderboard/room/{room_id}": {
    get: {
      tags: ["Leaderboards"],
      summary: "Get room leaderboard",
      description: "Retrieve leaderboard for a specific room",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/RoomId" }],
      responses: {
        200: {
          description: "Room leaderboard retrieved successfully",
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
                          room: { $ref: "#/components/schemas/Room" },
                          leaderboard: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                rank: { type: "integer", example: 1 },
                                user: { $ref: "#/components/schemas/User" },
                                score: { type: "integer", example: 450 },
                                totalProblems: { type: "integer", example: 5 },
                                solvedProblems: { type: "integer", example: 4 },
                                totalTime: { type: "integer", example: 3600, description: "Total time in seconds" },
                                lastSubmission: { type: "string", format: "date-time", example: "2024-01-15T11:30:00Z" }
                              }
                            }
                          },
                          totalParticipants: { type: "integer", example: 25 },
                          lastUpdated: { type: "string", format: "date-time", example: "2024-01-15T11:35:00Z" }
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

  "/leaderboard/competition/{room_id}": {
    get: {
      tags: ["Leaderboards"],
      summary: "Get competition leaderboard",
      description: "Retrieve leaderboard for active competition in a room",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/RoomId" }],
      responses: {
        200: {
          description: "Competition leaderboard retrieved successfully",
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
                          competition: { $ref: "#/components/schemas/Competition" },
                          leaderboard: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                rank: { type: "integer", example: 1 },
                                user: { $ref: "#/components/schemas/User" },
                                score: { type: "integer", example: 350 },
                                totalProblems: { type: "integer", example: 3 },
                                solvedProblems: { type: "integer", example: 3 },
                                totalTime: { type: "integer", example: 2400, description: "Total time in seconds" },
                                penalty: { type: "integer", example: 0, description: "Penalty points for wrong submissions" },
                                submissions: {
                                  type: "array",
                                  items: {
                                    type: "object",
                                    properties: {
                                      problemId: { type: "string", example: "problem-uuid-123" },
                                      status: { type: "string", example: "ACCEPTED" },
                                      score: { type: "integer", example: 100 },
                                      submissionTime: { type: "string", format: "date-time", example: "2024-01-15T11:15:00Z" },
                                      attempts: { type: "integer", example: 2 }
                                    }
                                  }
                                },
                                lastSubmission: { type: "string", format: "date-time", example: "2024-01-15T11:30:00Z" }
                              }
                            }
                          },
                          totalParticipants: { type: "integer", example: 20 },
                          competitionStatus: { type: "string", example: "ACTIVE" },
                          currentProblem: { type: "integer", example: 2 },
                          timeRemaining: { type: "integer", example: 1800, description: "Time remaining in seconds" },
                          lastUpdated: { type: "string", format: "date-time", example: "2024-01-15T11:35:00Z" }
                        }
                      }
                    }
                  }
                ]
              }
            }
          }
        },
        404: {
          description: "Room or active competition not found",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Error" },
                  {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "No active competition found in this room" }
                    }
                  }
                ]
              }
            }
          }
        },
        401: { $ref: "#/components/responses/UnauthorizedError" }
      }
    }
  }
};