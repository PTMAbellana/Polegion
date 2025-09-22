// Reusable schemas for API documentation
module.exports = {
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

  Competition: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      description: { type: 'string' },
      startTime: { type: 'string', format: 'date-time' },
      endTime: { type: 'string', format: 'date-time' },
      status: { type: 'string', enum: ['PENDING', 'ACTIVE', 'ENDED'] },
      roomId: { type: 'string' },
      createdAt: { type: 'string', format: 'date-time' }
    }
  },

  Attempt: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      userId: { type: 'string' },
      problemId: { type: 'string' },
      solution: { type: 'object' },
      score: { type: 'integer' },
      submittedAt: { type: 'string', format: 'date-time' }
    }
  },

  Error: {
    type: 'object',
    properties: {
      error: { type: 'string' },
      message: { type: 'string' },
      statusCode: { type: 'integer' }
    }
  },

  Success: {
    type: 'object',
    properties: {
      message: { type: 'string' },
      data: { type: 'object' }
    }
  }
};