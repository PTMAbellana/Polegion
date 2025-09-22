// Request body templates for different endpoints
module.exports = {
  // Authentication requests
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
  },

  // Room requests
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

  updateRoom: {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Updated Room Name' },
            description: { type: 'string', example: 'Updated description' },
            maxUsers: { type: 'integer', example: 100 }
          }
        }
      }
    }
  },

  // Participant requests
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

  // Problem requests
  createProblem: {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          required: ['title', 'description', 'difficulty'],
          properties: {
            title: { type: 'string', example: 'Two Sum Problem' },
            description: { type: 'string', example: 'Given an array of integers...' },
            difficulty: { type: 'string', enum: ['EASY', 'MEDIUM', 'HARD'], example: 'EASY' },
            points: { type: 'integer', example: 100 },
            timeLimit: { type: 'integer', example: 60 }
          }
        }
      }
    }
  },

  // Attempt requests
  submitSolution: {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          required: ['problemId', 'solution'],
          properties: {
            problemId: { 
              type: 'string', 
              example: 'problem-uuid-123',
              description: 'The ID of the problem being solved'
            },
            solution: { 
              type: 'object',
              description: 'JSONB data representing the solution (stored in Supabase)',
              example: [
                {
                  "x": 347,
                  "y": 170,
                  "id": 1753199195126,
                  "area": 295.59,
                  "size": 194,
                  "type": "circle",
                  "color": "#e3dcc2",
                  "radius": 40,
                  "diameter": 19.4,
                  "circumference": 60.95
                }
              ],
              additionalProperties: true
            }
          }
        }
      }
    }
  },

  // User requests
  updateProfile: {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            username: { type: 'string', example: 'new_username' },
            firstName: { type: 'string', example: 'John' },
            lastName: { type: 'string', example: 'Doe' }
          }
        }
      }
    }
  },

  // Competition requests
  createCompetition: {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          required: ['name', 'roomId'],
          properties: {
            name: { type: 'string', example: 'Weekly Coding Challenge' },
            description: { type: 'string', example: 'Weekly competitive programming challenge' },
            roomId: { type: 'string', example: 'room-uuid-123' },
            duration: { type: 'integer', example: 3600, description: 'Competition duration in seconds' },
            autoStart: { type: 'boolean', example: false, description: 'Whether to start automatically' }
          }
        }
      }
    }
  },

  // Auth-specific requests
  resetPassword: {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          required: ['email'],
          properties: {
            email: { type: 'string', format: 'email', example: 'user@example.com' }
          }
        }
      }
    }
  },

  resetPasswordConfirm: {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          required: ['token', 'password'],
          properties: {
            token: { type: 'string', example: 'reset-token-123' },
            password: { type: 'string', minLength: 6, example: 'newPassword123' }
          }
        }
      }
    }
  },

  changeEmail: {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          required: ['newEmail'],
          properties: {
            newEmail: { type: 'string', format: 'email', example: 'newemail@example.com' },
            password: { type: 'string', example: 'currentPassword123' }
          }
        }
      }
    }
  },

  changePassword: {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          required: ['currentPassword', 'newPassword'],
          properties: {
            currentPassword: { type: 'string', example: 'currentPassword123' },
            newPassword: { type: 'string', minLength: 6, example: 'newPassword456' }
          }
        }
      }
    }
  },

  changeVisibility: {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          required: ['roomId', 'isVisible'],
          properties: {
            roomId: { type: 'string', example: 'room-uuid-123' },
            isVisible: { type: 'boolean', example: true }
          }
        }
      }
    }
  },

  inviteUser: {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          required: ['email', 'roomCode'],
          properties: {
            email: { type: 'string', format: 'email', example: 'friend@example.com' },
            roomCode: { type: 'string', example: 'ROOM123' },
            message: { type: 'string', example: 'Join my coding room!' }
          }
        }
      }
    }
  },

  updateTimer: {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          required: ['timeLimit'],
          properties: {
            timeLimit: { type: 'integer', example: 1800, description: 'Time limit in seconds' }
          }
        }
      }
    }
  },

  updateProblem: {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            title: { type: 'string', example: 'Updated Problem Title' },
            description: { type: 'string', example: 'Updated problem description...' },
            difficulty: { type: 'string', enum: ['EASY', 'MEDIUM', 'HARD'], example: 'MEDIUM' },
            points: { type: 'integer', example: 150 },
            timeLimit: { type: 'integer', example: 120 },
            testCases: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  input: { type: 'string', example: '[1,2,3], 6' },
                  expectedOutput: { type: 'string', example: '[1,2]' }
                }
              }
            }
          }
        }
      }
    }
  },

  addCompeProblem: {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            order: { type: 'integer', example: 1, description: 'Order of problem in competition' }
          }
        }
      }
    }
  },

  autoAdvance: {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          required: ['enabled'],
          properties: {
            enabled: { type: 'boolean', example: true },
            interval: { type: 'integer', example: 300, description: 'Auto-advance interval in seconds' }
          }
        }
      }
    }
  }
};