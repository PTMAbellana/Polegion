const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Import modular components
const schemas = require('./swagger/schemas');
const requestBodies = require('./swagger/requestBodies');
const parameters = require('./swagger/parameters');

// Import endpoint definitions
const authEndpoints = require('./swagger/endpoints/auth');
const userEndpoints = require('./swagger/endpoints/users');
const roomEndpoints = require('./swagger/endpoints/rooms');

// Reusable components
const components = {
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
};

// Helper function to create endpoint definitions
const createEndpoint = (method, summary, tag, options = {}) => {
  const endpoint = {
    [method]: {
      tags: [tag],
      summary,
      ...(options.auth && { security: [{ bearerAuth: [] }] }),
      ...(options.requestBody && { requestBody: options.requestBody }),
      ...(options.parameters && { parameters: options.parameters }),
      responses: options.responses || {
        200: { description: 'Success' },
        400: { description: 'Bad Request' },
        401: { description: 'Unauthorized' },
        500: { description: 'Internal Server Error' }
      }
    }
  };
  return endpoint;
};

// Request body templates
const requestBodies = {
  login: {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
            password: { type: 'string', minLength: 6, example: 'password123' }
          }
        }
      }
    }
  },
  register: {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          required: ['email', 'password', 'username'],
          properties: {
            email: { type: 'string', format: 'email', example: 'jane.smith@example.com' },
            password: { type: 'string', minLength: 6, example: 'securePassword456' },
            username: { type: 'string', example: 'jane_smith' },
            firstName: { type: 'string', example: 'Jane' },
            lastName: { type: 'string', example: 'Smith' }
          }
        }
      }
    }
  },
  createRoom: {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', example: 'Algorithm Practice Room' },
            description: { type: 'string', example: 'A room for practicing data structures and algorithms' },
            maxUsers: { type: 'integer', example: 50, minimum: 1, maximum: 1000 }
          }
        }
      }
    }
  },
  joinRoom: {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          required: ['roomCode'],
          properties: {
            roomCode: { type: 'string', example: 'ROOM123' }
          }
        }
      }
    }
  },
  submitSolution: {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          required: ['problemId', 'solution'],
          properties: {
            problemId: { type: 'string', example: 'problem-uuid-123' },
            solution: { type: 'string', example: 'function twoSum(nums, target) {\n  // Your solution here\n  return [];\n}' },
            language: { type: 'string', enum: ['javascript', 'python', 'java', 'cpp'], example: 'javascript' }
          }
        }
      }
    }
  },
  refreshToken: {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          required: ['refreshToken'],
          properties: {
            refreshToken: { type: 'string', example: 'your_refresh_token_here' }
          }
        }
      }
    }
  }
};

// Path parameters
const pathParams = {
  id: { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
  roomId: { name: 'roomId', in: 'path', required: true, schema: { type: 'string' } }
};

// Define all your endpoints here (much cleaner!)
const paths = {
  // Authentication endpoints
  '/auth/login': createEndpoint('post', 'User login with Supabase', 'Authentication', {
    requestBody: requestBodies.login,
    responses: {
      200: { 
        description: 'Login successful', 
        content: { 
          'application/json': { 
            schema: { 
              type: 'object', 
              properties: { 
                user: { 
                  $ref: '#/components/schemas/User' 
                }, 
                access_token: { 
                  type: 'string' 
                } 
              } 
            } 
          } 
        } 
      },
      401: { description: 'Invalid credentials' }
    }
  }),

  '/auth/register': createEndpoint('post', 'User registration with Supabase', 'Authentication', {
    requestBody: requestBodies.register,
    responses: {
      201: { description: 'User created successfully' },
      400: { description: 'User already exists' }
    }
  }),

  '/auth/logout': createEndpoint('post', 'User logout', 'Authentication', {
    auth: true,
    responses: { 200: { description: 'Logout successful' } }
  }),

  '/auth/refresh-token': createEndpoint('post', 'Refresh Supabase session token', 'Authentication', {
    requestBody: requestBodies.refreshToken
  }),

  // User endpoints
  '/users/profile': {
    ...createEndpoint('get', 'Get user profile', 'Users', { auth: true }),
    ...createEndpoint('put', 'Update user profile', 'Users', { auth: true })
  },

  // Room endpoints
  '/rooms': {
    ...createEndpoint('get', 'Get all rooms', 'Rooms', { auth: true }),
    ...createEndpoint('post', 'Create new room', 'Rooms', { 
      auth: true, 
      requestBody: requestBodies.createRoom 
    })
  },

  '/rooms/id/{id}': createEndpoint('get', 'Get room by ID', 'Rooms', {
    auth: true,
    parameters: [pathParams.id]
  }),

  // Participant endpoints
  '/participants/join': createEndpoint('post', 'Join a room using room code', 'Participants', {
    auth: true,
    requestBody: requestBodies.joinRoom
  }),

  // Problem endpoints
  '/problems/{roomId}': createEndpoint('get', 'Get room problems', 'Problems', {
    auth: true,
    parameters: [pathParams.roomId]
  }),

  // Competition endpoints
  '/competitions': createEndpoint('post', 'Create competition', 'Competitions', { auth: true }),

  // Attempt endpoints
  '/attempts/submit': createEndpoint('post', 'Submit programming solution', 'Attempts', {
    auth: true,
    requestBody: requestBodies.submitSolution
  }),

  // Leaderboard endpoints
  '/leaderboard/room/{roomId}': createEndpoint('get', 'Get room leaderboard', 'Leaderboard', {
    auth: true,
    parameters: [pathParams.roomId]
  })
};

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
    components,
    paths
  },
  apis: []
};

const specs = swaggerJsdoc(options);
module.exports = specs;