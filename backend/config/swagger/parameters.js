// Common parameters used across endpoints
module.exports = {
  // Path parameters
  userId: {
    name: 'userId',
    in: 'path',
    required: true,
    schema: { type: 'string' },
    description: 'Unique identifier for the user',
    example: 'user-uuid-123'
  },

  roomId: {
    name: 'roomId',
    in: 'path',
    required: true,
    schema: { type: 'string' },
    description: 'Unique identifier for the room',
    example: 'room-uuid-456'
  },

  problemId: {
    name: 'problemId',
    in: 'path',
    required: true,
    schema: { type: 'string' },
    description: 'Unique identifier for the problem',
    example: 'problem-uuid-789'
  },

  competitionId: {
    name: 'competitionId',
    in: 'path',
    required: true,
    schema: { type: 'string' },
    description: 'Unique identifier for the competition',
    example: 'competition-uuid-101'
  },

  attemptId: {
    name: 'attemptId',
    in: 'path',
    required: true,
    schema: { type: 'string' },
    description: 'Unique identifier for the attempt',
    example: 'attempt-uuid-202'
  },

  // Query parameters
  limit: {
    name: 'limit',
    in: 'query',
    required: false,
    schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
    description: 'Number of items to return',
    example: 20
  },

  offset: {
    name: 'offset',
    in: 'query',
    required: false,
    schema: { type: 'integer', minimum: 0, default: 0 },
    description: 'Number of items to skip',
    example: 10
  },

  search: {
    name: 'search',
    in: 'query',
    required: false,
    schema: { type: 'string' },
    description: 'Search term to filter results',
    example: 'algorithm'
  },

  difficulty: {
    name: 'difficulty',
    in: 'query',
    required: false,
    schema: { type: 'string', enum: ['EASY', 'MEDIUM', 'HARD'] },
    description: 'Filter by problem difficulty',
    example: 'MEDIUM'
  },

  status: {
    name: 'status',
    in: 'query',
    required: false,
    schema: { type: 'string', enum: ['ACTIVE', 'INACTIVE', 'PENDING'] },
    description: 'Filter by status',
    example: 'ACTIVE'
  },

  sortBy: {
    name: 'sortBy',
    in: 'query',
    required: false,
    schema: { type: 'string', enum: ['createdAt', 'updatedAt', 'name', 'points'] },
    description: 'Field to sort by',
    example: 'createdAt'
  },

  sortOrder: {
    name: 'sortOrder',
    in: 'query',
    required: false,
    schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' },
    description: 'Sort order',
    example: 'desc'
  },

  // Additional path parameters
  id: {
    name: 'id',
    in: 'path',
    required: true,
    schema: { type: 'string' },
    description: 'Unique identifier',
    example: 'uuid-123'
  },

  code: {
    name: 'code',
    in: 'path',
    required: true,
    schema: { type: 'string' },
    description: 'Room code',
    example: 'ROOM123'
  },

  roomCode: {
    name: 'room_code',
    in: 'path',
    required: true,
    schema: { type: 'string' },
    description: 'Room code parameter',
    example: 'ROOM123'
  },

  compeId: {
    name: 'compe_id',
    in: 'path',
    required: true,
    schema: { type: 'string' },
    description: 'Competition ID',
    example: 'competition-uuid-123'
  },

  compeProbId: {
    name: 'compe_prob_id',
    in: 'path',
    required: true,
    schema: { type: 'string' },
    description: 'Competition problem ID',
    example: 'compe-problem-uuid-123'
  },

  // Authorization header
  authorization: {
    name: 'Authorization',
    in: 'header',
    required: true,
    schema: { type: 'string' },
    description: 'Bearer token for authentication',
    example: 'Bearer your_supabase_access_token_here'
  }
};