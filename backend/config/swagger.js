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
const participantEndpoints = require('./swagger/endpoints/participants');
const problemEndpoints = require('./swagger/endpoints/problems');
const competitionEndpoints = require('./swagger/endpoints/competitions');
const attemptEndpoints = require('./swagger/endpoints/attempts');
const leaderboardEndpoints = require('./swagger/endpoints/leaderboards');

// Helper function to create error responses
const createErrorResponse = (description, message) => ({
  description,
  content: {
    'application/json': {
      schema: {
        allOf: [
          { $ref: '#/components/schemas/Error' },
          {
            type: 'object',
            properties: {
              message: { type: 'string', example: message }
            }
          }
        ]
      }
    }
  }
});

// Combine all paths from different endpoint files
const allPaths = {
  ...authEndpoints,
  ...userEndpoints,
  ...roomEndpoints,
  ...participantEndpoints,
  ...problemEndpoints,
  ...competitionEndpoints,
  ...attemptEndpoints,
  ...leaderboardEndpoints
};

// Convert requestBodies to proper format for components
const formattedRequestBodies = {};
Object.keys(requestBodies).forEach(key => {
  // Convert camelCase to PascalCase for component references
  const componentKey = key.charAt(0).toUpperCase() + key.slice(1);
  formattedRequestBodies[componentKey] = requestBodies[key];
});

// Convert parameters to proper format for components
const formattedParameters = {};
Object.keys(parameters).forEach(key => {
  // Convert camelCase to PascalCase for component references
  const componentKey = key.charAt(0).toUpperCase() + key.slice(1);
  formattedParameters[componentKey] = parameters[key];
});

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
      },
      {
        url: 'https://api.polegion.com',
        description: 'Production server'
      }
    ],
    tags: [
      { name: 'Authentication', description: 'User authentication and authorization with Supabase' },
      { name: 'Users', description: 'User management operations' },
      { name: 'Rooms', description: 'Virtual room management for competitions' },
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
      
      schemas: schemas,

      responses: {
        BadRequestError: createErrorResponse('Bad Request - Invalid input data', 'Invalid request data'),
        UnauthorizedError: createErrorResponse('Unauthorized - Authentication required', 'Authentication required'),
        ForbiddenError: createErrorResponse('Forbidden - Insufficient permissions', 'Insufficient permissions'),
        NotFoundError: createErrorResponse('Not Found - Resource not found', 'Resource not found'),
        ConflictError: createErrorResponse('Conflict - Resource already exists', 'Resource already exists'),
        InternalServerError: createErrorResponse('Internal Server Error', 'Internal server error occurred')
      },

      requestBodies: formattedRequestBodies,
      parameters: formattedParameters
    },

    paths: allPaths
  },
  apis: ['./presentation/routes/*.js']
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