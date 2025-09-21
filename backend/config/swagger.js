const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Polegion API',
      version: '1.0.0',
      description: 'A competitive programming platform API with Prisma and Neon',
      contact: {
        name: 'Polegion Team',
        email: 'support@polegion.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
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
          summary: 'User login',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 6 }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Login successful' },
            401: { description: 'Invalid credentials' }
          }
        }
      },
      '/auth/register': {
        post: {
          tags: ['Authentication'],
          summary: 'User registration',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password', 'username'],
                  properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 6 },
                    username: { type: 'string' },
                    firstName: { type: 'string' },
                    lastName: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            201: { description: 'User created successfully' },
            400: { description: 'User already exists' }
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
          summary: 'Refresh JWT token',
          responses: {
            200: { description: 'Token refreshed successfully' }
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
                    name: { type: 'string' },
                    description: { type: 'string' },
                    maxUsers: { type: 'integer' }
                  }
                }
              }
            }
          },
          responses: {
            201: { description: 'Room created successfully' }
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
          summary: 'Join a room',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['roomCode'],
                  properties: {
                    roomCode: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Successfully joined room' }
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
          summary: 'Submit solution',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['problemId', 'solution'],
                  properties: {
                    problemId: { type: 'string' },
                    solution: { type: 'string' },
                    language: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Solution submitted successfully' }
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