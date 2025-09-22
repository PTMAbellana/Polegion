const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Polegion API',
      version: '1.0.0',
      description: 'A competitive programming platform API with Supabase authentication',
      contact: {
        name: 'Polegion Team',
        email: 'support@polegion.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}/api`,
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'Supabase Access Token',
          description: 'Enter the access_token received from login'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string', format: 'email' },
            username: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            avatar: { type: 'string' },
            role: { type: 'string', enum: ['STUDENT', 'INSTRUCTOR', 'ADMIN'] },
            xp: { type: 'integer' },
            level: { type: 'integer' },
            isActive: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Room: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            code: { type: 'string' },
            isActive: { type: 'boolean' },
            maxUsers: { type: 'integer' },
            creatorId: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Problem: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            difficulty: { type: 'string', enum: ['EASY', 'MEDIUM', 'HARD'] },
            points: { type: 'integer' },
            timeLimit: { type: 'integer' },
            isActive: { type: 'boolean' },
            roomId: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' },
            statusCode: { type: 'integer' }
          }
        }
      }
    },
    paths: {
      '/auth/login': {
        post: {
          tags: ['Authentication'],
          summary: 'User login with Supabase',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { 
                      type: 'string', 
                      format: 'email',
                      example: 'john.doe@example.com'
                    },
                    password: { 
                      type: 'string', 
                      minLength: 6,
                      example: 'password123'
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Login successful',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      user: { $ref: '#/components/schemas/User' },
                      session: { type: 'object' },
                      access_token: { 
                        type: 'string',
                        description: 'Use this token in Authorization header'
                      },
                      refresh_token: { type: 'string' }
                    }
                  }
                }
              }
            },
            401: { 
              description: 'Invalid credentials',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' }
                }
              }
            }
          }
        }
      },
      '/auth/register': {
        post: {
          tags: ['Authentication'],
          summary: 'User registration with Supabase',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password', 'username'],
                  properties: {
                    email: { 
                      type: 'string', 
                      format: 'email',
                      example: 'jane.smith@example.com'
                    },
                    password: { 
                      type: 'string', 
                      minLength: 6,
                      example: 'securePassword456'
                    },
                    username: { 
                      type: 'string',
                      example: 'jane_smith'
                    },
                    firstName: { 
                      type: 'string',
                      example: 'Jane'
                    },
                    lastName: { 
                      type: 'string',
                      example: 'Smith'
                    }
                  }
                }
              }
            }
          },
          responses: {
            201: { 
              description: 'User created successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      user: { $ref: '#/components/schemas/User' },
                      message: { type: 'string' }
                    }
                  }
                }
              }
            },
            400: { 
              description: 'User already exists',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' }
                }
              }
            }
          }
        }
      },
      '/auth/logout': {
        post: {
          tags: ['Authentication'],
          summary: 'User logout',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Logout successful' }
          }
        }
      },
      '/auth/refresh-token': {
        post: {
          tags: ['Authentication'], 
          summary: 'Refresh Supabase session token',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['refreshToken'],
                  properties: {
                    refreshToken: { 
                      type: 'string',
                      example: 'your_refresh_token_here'
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: { 
              description: 'Token refreshed successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      session: { type: 'object' },
                      user: { $ref: '#/components/schemas/User' },
                      access_token: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/users/profile': {
        get: {
          tags: ['Users'],
          summary: 'Get user profile',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'User profile retrieved',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/User' }
                }
              }
            }
          }
        },
        put: {
          tags: ['Users'],
          summary: 'Update user profile',
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    username: { type: 'string' },
                    firstName: { type: 'string' },
                    lastName: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Profile updated successfully' }
          }
        }
      },
      '/rooms': {
        get: {
          tags: ['Rooms'],
          summary: 'Get all rooms',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'List of rooms',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Room' }
                  }
                }
              }
            }
          }
        },
        post: {
          tags: ['Rooms'],
          summary: 'Create new room',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name'],
                  properties: {
                    name: { 
                      type: 'string',
                      example: 'Algorithm Practice Room'
                    },
                    description: { 
                      type: 'string',
                      example: 'A room for practicing data structures and algorithms'
                    },
                    maxUsers: { 
                      type: 'integer',
                      example: 50,
                      minimum: 1,
                      maximum: 1000
                    }
                  }
                }
              }
            }
          },
          responses: {
            201: { 
              description: 'Room created successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      room: { $ref: '#/components/schemas/Room' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/rooms/id/{id}': {
        get: {
          tags: ['Rooms'],
          summary: 'Get room by ID',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' }
            }
          ],
          responses: {
            200: {
              description: 'Room details',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Room' }
                }
              }
            }
          }
        }
      },
      '/participants/join': {
        post: {
          tags: ['Participants'],
          summary: 'Join a room using room code',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['roomCode'],
                  properties: {
                    roomCode: { 
                      type: 'string',
                      example: 'ROOM123'
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: { 
              description: 'Successfully joined room',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      room: { $ref: '#/components/schemas/Room' }
                    }
                  }
                }
              }
            },
            404: {
              description: 'Room not found',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' }
                }
              }
            }
          }
        }
      },
      '/problems/{roomId}': {
        get: {
          tags: ['Problems'],
          summary: 'Get room problems',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'roomId',
              in: 'path',
              required: true,
              schema: { type: 'string' }
            }
          ],
          responses: {
            200: {
              description: 'List of problems',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Problem' }
                  }
                }
              }
            }
          }
        }
      },
      '/competitions': {
        post: {
          tags: ['Competitions'],
          summary: 'Create competition',
          security: [{ bearerAuth: [] }],
          responses: {
            201: { description: 'Competition created successfully' }
          }
        }
      },
      '/attempts/submit': {
        post: {
          tags: ['Attempts'],
          summary: 'Submit programming solution',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['problemId', 'solution'],
                  properties: {
                    problemId: { 
                      type: 'string',
                      example: 'problem-uuid-123'
                    },
                    solution: { 
                      type: 'string',
                      example: 'function twoSum(nums, target) {\n  // Your solution here\n  return [];\n}'
                    },
                    language: { 
                      type: 'string',
                      enum: ['javascript', 'python', 'java', 'cpp'],
                      example: 'javascript'
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: { 
              description: 'Solution submitted successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      attemptId: { type: 'string' },
                      status: { 
                        type: 'string',
                        enum: ['PENDING', 'ACCEPTED', 'WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED']
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/leaderboard/room/{roomId}': {
        get: {
          tags: ['Leaderboard'],
          summary: 'Get room leaderboard',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'roomId',
              in: 'path',
              required: true,
              schema: { type: 'string' }
            }
          ],
          responses: {
            200: { description: 'Room leaderboard' }
          }
        }
      }
    }
  },
  apis: []
};

const specs = swaggerJsdoc(options);

module.exports = specs;