const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger configuration options
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Polegion API',
      version: '1.0.0',
      description: 'A comprehensive competitive programming platform API with Supabase authentication',
      contact: {
        name: 'Polegion Development Team',
        email: 'dev@polegion.com',
        url: 'https://polegion.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}/api`,
        description: 'Development server'
      }
    ],
    tags: [
      { name: 'Authentication', description: 'User authentication and authorization with Supabase' },
      { name: 'Users', description: 'User management operations' },
      { name: 'Rooms', description: 'Virtual room management for competitions' },
      { name: 'Participants', description: 'Room participant management' },
      { name: 'Problems', description: 'Programming problem management' },
      { name: 'Competitions', description: 'Competition management and lifecycle' },
      { name: 'Attempts', description: 'Solution submission and grading' },
      { name: 'Leaderboards', description: 'Rankings and statistics' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'Supabase Access Token',
          description: 'Enter the access_token received from Supabase authentication'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            error: { type: 'string' }
          }
        },
        Success: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: { type: 'object' }
          }
        }
      },
      responses: {
        BadRequestError: {
          description: 'Bad Request - Invalid input data',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        },
        UnauthorizedError: {
          description: 'Unauthorized - Authentication required',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        },
        ForbiddenError: {
          description: 'Forbidden - Insufficient permissions',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        },
        NotFoundError: {
          description: 'Not Found - Resource not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        },
        InternalServerError: {
          description: 'Internal Server Error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        }
      }
    }
  },
  apis: ['./presentation/routes/*.js'] // JSDoc will scan these files
};

// Generate the Swagger specification
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware to serve Swagger documentation
const swaggerServe = swaggerUi.serve;
const swaggerSetup = swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Polegion API Documentation",
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    tryItOutEnabled: true,
    filter: true,
    layout: "BaseLayout",
    deepLinking: true
  }
});

module.exports = {
  swaggerSpec,
  swaggerServe,
  swaggerSetup
};