// Participant management endpoints - Complete set based on ParticipantRoutes.js
module.exports = {
  "/participants/join": {
    post: {
      tags: ["Participants"],
      summary: "Join a room",
      description: "Join a room using room code",
      security: [{ bearerAuth: [] }],
      requestBody: { $ref: "#/components/requestBodies/JoinRoom" },
      responses: {
        200: {
          description: "Successfully joined room",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Success" },
                  {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Successfully joined room" },
                      data: {
                        type: "object",
                        properties: {
                          room: { $ref: "#/components/schemas/Room" },
                          participant: {
                            type: "object",
                            properties: {
                              id: { type: "string", example: "participant-uuid-123" },
                              userId: { type: "string", example: "user-uuid-456" },
                              roomId: { type: "string", example: "room-uuid-789" },
                              joinedAt: { type: "string", format: "date-time", example: "2024-01-15T10:30:00Z" }
                            }
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
        409: {
          description: "Already joined or room full",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Error" },
                  {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Already joined this room" }
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

  "/participants/invite": {
    post: {
      tags: ["Participants"],
      summary: "Invite user by email",
      description: "Send room invitation to user via email",
      security: [{ bearerAuth: [] }],
      requestBody: { $ref: "#/components/requestBodies/InviteUser" },
      responses: {
        200: {
          description: "Invitation sent successfully",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Success" },
                  {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Invitation sent successfully" }
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

  "/participants/leave/{room_id}": {
    delete: {
      tags: ["Participants"],
      summary: "Leave room",
      description: "Leave a room as participant",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/RoomId" }],
      responses: {
        200: {
          description: "Successfully left room",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Success" },
                  {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Successfully left room" }
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

  "/participants/room/{room_id}/participant/{user_id}": {
    delete: {
      tags: ["Participants"],
      summary: "Remove participant",
      description: "Remove a participant from room (admin only)",
      security: [{ bearerAuth: [] }],
      parameters: [
        { $ref: "#/components/parameters/RoomId" },
        { $ref: "#/components/parameters/UserId" }
      ],
      responses: {
        200: {
          description: "Participant removed successfully",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Success" },
                  {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Participant removed successfully" }
                    }
                  }
                ]
              }
            }
          }
        },
        404: { $ref: "#/components/responses/NotFoundError" },
        401: { $ref: "#/components/responses/UnauthorizedError" },
        403: { $ref: "#/components/responses/ForbiddenError" }
      }
    }
  },

  "/participants/status/{room_id}": {
    get: {
      tags: ["Participants"],
      summary: "Check participant status",
      description: "Check if user is participant in room",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/RoomId" }],
      responses: {
        200: {
          description: "Participant status retrieved",
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
                          isParticipant: { type: "boolean", example: true },
                          joinedAt: { type: "string", format: "date-time", example: "2024-01-15T10:30:00Z" }
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

  "/participants/count/{room_id}": {
    get: {
      tags: ["Participants"],
      summary: "Get room participant count",
      description: "Get the number of participants in a room",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/RoomId" }],
      responses: {
        200: {
          description: "Participant count retrieved",
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
                          count: { type: "integer", example: 25 },
                          maxUsers: { type: "integer", example: 100 }
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

  "/participants/creator/lists/{room_id}": {
    get: {
      tags: ["Participants"],
      summary: "Get room participants (Admin view)",
      description: "Get all participants in room with admin details",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/RoomId" }],
      responses: {
        200: {
          description: "Participants retrieved successfully",
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
                            id: { type: "string", example: "participant-uuid-123" },
                            user: { $ref: "#/components/schemas/User" },
                            joinedAt: { type: "string", format: "date-time", example: "2024-01-15T10:30:00Z" },
                            role: { type: "string", example: "PARTICIPANT" }
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
        401: { $ref: "#/components/responses/UnauthorizedError" },
        403: { $ref: "#/components/responses/ForbiddenError" }
      }
    }
  },

  "/participants/user/lists/{room_id}": {
    get: {
      tags: ["Participants"],
      summary: "Get room participants (User view)",
      description: "Get all participants in room with user details",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/RoomId" }],
      responses: {
        200: {
          description: "Participants retrieved successfully",
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
                            id: { type: "string", example: "participant-uuid-123" },
                            user: {
                              type: "object",
                              properties: {
                                id: { type: "string", example: "user-uuid-456" },
                                username: { type: "string", example: "john_doe" },
                                firstName: { type: "string", example: "John" },
                                lastName: { type: "string", example: "Doe" }
                              }
                            },
                            joinedAt: { type: "string", format: "date-time", example: "2024-01-15T10:30:00Z" }
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

  "/participants/joined": {
    get: {
      tags: ["Participants"],
      summary: "Get joined rooms",
      description: "Get all rooms that the current user has joined",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Joined rooms retrieved successfully",
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
                            room: { $ref: "#/components/schemas/Room" },
                            joinedAt: { type: "string", format: "date-time", example: "2024-01-15T10:30:00Z" },
                            role: { type: "string", example: "PARTICIPANT" }
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
        401: { $ref: "#/components/responses/UnauthorizedError" }
      }
    }
  }
};