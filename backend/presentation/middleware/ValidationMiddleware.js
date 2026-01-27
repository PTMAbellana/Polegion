const Joi = require('joi');

/**
 * Validation schemas for API endpoints
 */
const schemas = {
  // Adaptive Learning
  submitAnswer: Joi.object({
    topicId: Joi.string().uuid().required(),
    questionId: Joi.string().uuid().required(),
    isCorrect: Joi.boolean().required(),
    timeSpent: Joi.number().min(0).max(3600000).required(), // Max 1 hour
    questionData: Joi.object().optional(),
    sessionId: Joi.string().uuid().optional()
  }),

  generateAIQuestion: Joi.object({
    topicId: Joi.string().uuid().required(),
    difficultyLevel: Joi.number().integer().min(1).max(5).required(),
    cognitiveDomain: Joi.string().valid('knowledge_recall', 'comprehension', 'application', 'analysis', 'synthesis', 'evaluation').optional()
  }),

  generateHint: Joi.object({
    questionId: Joi.string().uuid().required(),
    hintsRequested: Joi.number().integer().min(1).max(3).optional()
  }),

  generateExplanation: Joi.object({
    topicId: Joi.string().uuid().required(),
    questionText: Joi.string().min(1).max(5000).required(),
    correctAnswer: Joi.string().min(1).max(1000).required(),
    userAnswer: Joi.string().min(1).max(1000).required(),
    topic: Joi.string().min(1).max(500).optional()
  }),

  // Authentication
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(100).required()
  }),

  signup: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(100).required(),
    fullName: Joi.string().min(1).max(100).required(),
    phone: Joi.string().min(10).max(20).optional(),
    gender: Joi.string().valid('Male', 'Female', 'Other', 'Prefer not to say').optional(),
    role: Joi.string().valid('student', 'teacher', 'admin').default('student')
  }),

  refreshToken: Joi.object({
    refresh_token: Joi.string().required()
  }),

  forgotPassword: Joi.object({
    email: Joi.string().email().required()
  }),

  resetPassword: Joi.object({
    token: Joi.string().required(),
    password: Joi.string().min(6).max(100).required()
  }),

  // User Management
  updateProfile: Joi.object({
    fullName: Joi.string().min(1).max(100).optional(),
    phone: Joi.string().min(10).max(20).optional(),
    gender: Joi.string().valid('Male', 'Female', 'Other', 'Prefer not to say').optional(),
    bio: Joi.string().max(500).optional()
  }),

  changeEmail: Joi.object({
    newEmail: Joi.string().email().required()
  }),

  changePassword: Joi.object({
    newPassword: Joi.string().min(6).max(100).required()
  }),

  // Castle/Chapter Management
  awardXP: Joi.object({
    xp_amount: Joi.number().integer().min(0).max(10000).required()
  }),

  // Assessment
  submitAssessment: Joi.object({
    userId: Joi.string().uuid().required(),
    testType: Joi.string().valid('pre-test', 'post-test').required(),
    answers: Joi.array().items(Joi.object({
      question_id: Joi.number().integer().required(),
      selected_answer: Joi.string().required(),
      is_correct: Joi.boolean().required()
    })).min(1).required(),
    startTime: Joi.date().iso().required(),
    endTime: Joi.date().iso().required(),
    duration: Joi.number().integer().min(0).max(7200000).required() // Max 2 hours
  }),

  // Analytics
  startSession: Joi.object({
    topicId: Joi.string().uuid().required(),
    topicName: Joi.string().min(1).max(200).required(),
    startingMastery: Joi.number().min(0).max(100).required()
  }),

  updateSession: Joi.object({
    questionsAttempted: Joi.number().integer().min(0).required(),
    questionsCorrect: Joi.number().integer().min(0).required()
  }),

  endSession: Joi.object({
    endingMastery: Joi.number().min(0).max(100).required(),
    questionsAttempted: Joi.number().integer().min(0).required(),
    questionsCorrect: Joi.number().integer().min(0).required(),
    cognitiveDomains: Joi.object().optional()
  })
};

/**
 * Validation middleware factory
 * @param {string} schemaName - Name of the schema to validate against
 * @returns {Function} Express middleware function
 */
const validate = (schemaName) => {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    
    if (!schema) {
      console.error(`Validation schema "${schemaName}" not found`);
      return next();
    }

    const { error, value } = schema.validate(req.body, { 
      abortEarly: false,
      stripUnknown: true // Remove unknown fields
    });

    if (error) {
      const details = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        error: 'Validation failed',
        details
      });
    }

    // Replace req.body with validated and sanitized value
    req.body = value;
    next();
  };
};

module.exports = { validate, schemas };
