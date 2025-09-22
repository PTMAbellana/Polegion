// Room management endpoints - Complete set based on RoomRoutes.js
module.exports = {
  "/rooms/upload-banner": {
    post: {
      tags: ["Rooms"],
      summary: "Upload room banner image",
      description: "Upload banner image for a room",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                bannerImage: {
                  type: 'string',
                  format: 'binary',
                  description: 'Banner image file (JPEG, PNG, max 10MB)'
                },
                roomId: {
                  type: 'string',
                  description: 'Room ID to upload banner for'
                }
              },
              required: ['bannerImage', 'roomId']
            }
          }
        }
      },
      responses: {
        200: {
          description: "Banner uploaded successfully",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Success" },
                  {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Banner uploaded successfully" },
                      data: {
                        type: "object",
                        properties: {
                          bannerUrl: { type: "string", example: "https://example.com/banners/room123.jpg" }
                        }
                      }
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
  "/rooms": {
    get: {
      tags: ["Rooms"],
      summary: "Get all rooms",
      description: "Retrieve a list of all rooms",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Rooms retrieved successfully",
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
                        items: { $ref: "#/components/schemas/Room" }
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
    },

    post: {
      tags: ["Rooms"],
      summary: "Create a new room",
      description: "Create a new room for competitions",
      security: [{ bearerAuth: [] }],
      requestBody: { $ref: "#/components/requestBodies/CreateRoom" },
      responses: {
        201: {
          description: "Room created successfully",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Success" },
                  {
                    type: "object",
                    properties: {
                      data: { $ref: "#/components/schemas/Room" }
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

  "/rooms/id/{id}": {
    get: {
      tags: ["Rooms"],
      summary: "Get room by ID",
      description: "Retrieve a specific room by its ID",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/Id" }],
      responses: {
        200: {
          description: "Room retrieved successfully",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Success" },
                  {
                    type: "object",
                    properties: {
                      data: { $ref: "#/components/schemas/Room" }
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
      tags: ["Rooms"],
      summary: "Update room",
      description: "Update room information",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/Id" }],
      requestBody: { $ref: "#/components/requestBodies/UpdateRoom" },
      responses: {
        200: {
          description: "Room updated successfully",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Success" },
                  {
                    type: "object",
                    properties: {
                      data: { $ref: "#/components/schemas/Room" }
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
      tags: ["Rooms"],
      summary: "Delete room",
      description: "Delete a room",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/Id" }],
      responses: {
        200: {
          description: "Room deleted successfully",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Success" },
                  {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Room deleted successfully" }
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

  "/rooms/admin/code/{code}": {
    get: {
      tags: ["Rooms"],
      summary: "Get room by code (Admin)",
      description: "Retrieve room information by code for administrators",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/Code" }],
      responses: {
        200: {
          description: "Room retrieved successfully",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Success" },
                  {
                    type: "object",
                    properties: {
                      data: { $ref: "#/components/schemas/Room" }
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

  "/rooms/user/code/{code}": {
    get: {
      tags: ["Rooms"],
      summary: "Get room by code (User)",
      description: "Retrieve room information by code for regular users",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/Code" }],
      responses: {
        200: {
          description: "Room retrieved successfully",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Success" },
                  {
                    type: "object",
                    properties: {
                      data: { $ref: "#/components/schemas/Room" }
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

  "/rooms/change-visibility": {
    put: {
      tags: ["Rooms"],
      summary: "Change room visibility",
      description: "Change the visibility status of a room",
      security: [{ bearerAuth: [] }],
      requestBody: { $ref: "#/components/requestBodies/ChangeVisibility" },
      responses: {
        200: {
          description: "Room visibility updated successfully",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Success" },
                  {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Room visibility updated successfully" },
                      data: { $ref: "#/components/schemas/Room" }
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

  "/rooms/{roomId}/join": {
    post: {
      tags: ["Rooms"],
      summary: "Join room",
      description: "Join a room as a participant",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/RoomId" }],
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
        404: {
          description: "Room not found",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Error" },
                  {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Room not found" }
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
  },

  "/rooms/{roomId}/leave": {
    post: {
      tags: ["Rooms"],
      summary: "Leave room",
      description: "Leave a room as a participant",
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
        404: {
          description: "Room not found or not a participant",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Error" },
                  {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Room not found or not a participant" }
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
  },

  "/rooms/{roomId}/participants": {
    get: {
      tags: ["Rooms"],
      summary: "Get room participants",
      description: "Retrieve all participants in a room",
      security: [{ bearerAuth: [] }],
      parameters: [
        { $ref: "#/components/parameters/RoomId" },
        { $ref: "#/components/parameters/Limit" },
        { $ref: "#/components/parameters/Offset" }
      ],
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
                        type: "object",
                        properties: {
                          participants: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                id: { type: "string", example: "participant-uuid-123" },
                                user: { $ref: "#/components/schemas/User" },
                                joinedAt: { type: "string", format: "date-time", example: "2024-01-15T10:30:00Z" }
                              }
                            }
                          },
                          pagination: {
                            type: "object",
                            properties: {
                              total: { type: "integer", example: 25 },
                              page: { type: "integer", example: 1 },
                              limit: { type: "integer", example: 10 },
                              totalPages: { type: "integer", example: 3 }
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
        404: {
          description: "Room not found",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Error" },
                  {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Room not found" }
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