/**
 * GeminiQuestionGenerator
 * AI-powered question generation for difficulty levels 4-5
 * 
 * DESIGN PRINCIPLES:
 * 1. Use AI for high difficulty questions (levels 4-5) where parametric templates are limited
 * 2. Always have fallback to parametric templates if AI fails
 * 3. Validate AI output to ensure proper format
 * 4. Cache AI-generated questions to save quota
 * 5. Rate limit to protect free tier
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiQuestionGenerator {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.model = process.env.AI_MODEL || 'gemini-2.0-flash-exp';
    
    if (this.apiKey) {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
      this.gemini = this.genAI.getGenerativeModel({ model: this.model });
    }

    // Rate limiting
    this.requestLog = {
      daily: new Map(),
      perMinute: []
    };
    
    this.DAILY_LIMIT = parseInt(process.env.AI_QUESTION_DAILY_LIMIT) || 20;
    this.PER_MINUTE_LIMIT = parseInt(process.env.AI_QUESTION_PER_MINUTE_LIMIT) || 10;

    // Cache for generated questions
    this.questionCache = new Map();
    this.CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour

    console.log('[GeminiQuestionGenerator] Initialized:', {
      model: this.model,
      hasApiKey: !!this.apiKey,
      dailyLimit: this.DAILY_LIMIT,
      perMinuteLimit: this.PER_MINUTE_LIMIT
    });
  }

  /**
   * Generate AI question for difficulty 4-5
   * 
   * @param {Object} params
   * @param {string} params.topicName - Topic name (e.g., "Area of Triangles")
   * @param {number} params.difficultyLevel - 4 or 5
   * @param {string} params.cognitiveDomain - Cognitive domain (e.g., "analytical_thinking")
   * @param {Array} params.excludeQuestionIds - Question IDs to avoid duplicates
   * @returns {Promise<Object>} Generated question with options, answer, hint
   */
  async generateQuestion({ topicName, difficultyLevel, cognitiveDomain, excludeQuestionIds = [] }) {
    // Validate difficulty level
    if (difficultyLevel < 4) {
      throw new Error('AI generation only for difficulty 4-5. Use parametric templates for 1-3.');
    }

    // Check rate limits
    const rateLimitCheck = this._checkRateLimits();
    if (!rateLimitCheck.allowed) {
      console.warn('[GeminiQuestionGenerator] Rate limit exceeded:', rateLimitCheck.reason);
      return null; // Will use fallback
    }

    // Check API key
    if (!this.apiKey || !this.gemini) {
      console.warn('[GeminiQuestionGenerator] No API key configured');
      return null;
    }

    // Generate cache key
    const cacheKey = `${topicName}_${difficultyLevel}_${cognitiveDomain}_${Date.now()}`;
    
    try {
      // Track request
      this._trackRequest();

      // Build prompt
      const prompt = this._buildQuestionPrompt(topicName, difficultyLevel, cognitiveDomain);

      // Call Gemini
      const result = await this.gemini.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse and validate response
      const question = this._parseQuestionResponse(text);
      
      if (!question) {
        console.error('[GeminiQuestionGenerator] Failed to parse AI response');
        return null;
      }

      // Add metadata
      question.generatedBy = 'ai';
      question.model = this.model;
      question.difficultyLevel = difficultyLevel;
      question.topicName = topicName;
      question.cognitiveDomain = cognitiveDomain;
      question.questionId = `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Cache it
      this.questionCache.set(cacheKey, {
        question,
        timestamp: Date.now()
      });

      return question;

    } catch (error) {
      console.error('[GeminiQuestionGenerator] Error generating question:', error.message);
      return null; // Will use fallback
    }
  }

  /**
   * Build the AI prompt for question generation
   */
  _buildQuestionPrompt(topicName, difficultyLevel, cognitiveDomain) {
    const difficultyDescription = difficultyLevel === 5 
      ? 'Very challenging, requiring multi-step reasoning and creative problem-solving'
      : 'Challenging, requiring analytical thinking and complex calculations';

    const domainDescription = this._getCognitiveDomainDescription(cognitiveDomain);

    return `You are an expert geometry teacher creating a ${difficultyDescription} question for elementary students.

TOPIC: ${topicName}
DIFFICULTY LEVEL: ${difficultyLevel}/5
COGNITIVE DOMAIN: ${cognitiveDomain} - ${domainDescription}

Create a geometry question that:
1. Is appropriate for the topic and difficulty level
2. Has EXACTLY 4 multiple choice options (A, B, C, D)
3. Has only ONE correct answer
4. Includes a helpful hint for struggling students
5. Uses clear, child-friendly language
6. Involves interesting scenarios (real-world contexts preferred)

Return your response in this EXACT JSON format:
{
  "questionText": "The complete question text here",
  "options": [
    {"label": "A", "text": "First option", "correct": false},
    {"label": "B", "text": "Second option", "correct": true},
    {"label": "C", "text": "Third option", "correct": false},
    {"label": "D", "text": "Fourth option", "correct": false}
  ],
  "correctAnswer": "B",
  "hint": "A helpful hint that guides without giving away the answer",
  "explanation": "Why this answer is correct (for teacher reference)"
}

IMPORTANT:
- Only output the JSON, no other text
- Ensure the "correct" field matches the "correctAnswer"
- Make the question engaging and age-appropriate
- Use whole numbers when possible
- Include units in answers (cm, m, cm², etc.)`;
  }

  /**
   * Get cognitive domain description for prompt
   */
  _getCognitiveDomainDescription(domain) {
    const descriptions = {
      'knowledge_recall': 'Recalling basic facts and formulas',
      'concept_understanding': 'Understanding relationships between geometric concepts',
      'procedural_skills': 'Applying step-by-step procedures',
      'analytical_thinking': 'Analyzing complex shapes and multi-step problems',
      'problem_solving': 'Solving real-world geometry problems',
      'higher_order_thinking': 'Creative reasoning and advanced problem-solving'
    };

    return descriptions[domain] || 'Advanced geometric reasoning';
  }

  /**
   * Parse AI response into question object
   */
  _parseQuestionResponse(responseText) {
    try {
      // Remove markdown code blocks if present
      let cleaned = responseText.trim();
      cleaned = cleaned.replace(/```json\s*/g, '');
      cleaned = cleaned.replace(/```\s*/g, '');
      
      // Parse JSON
      const question = JSON.parse(cleaned);

      // Validate structure
      if (!question.questionText || !question.options || !question.correctAnswer || !question.hint) {
        console.error('[GeminiQuestionGenerator] Missing required fields in AI response');
        return null;
      }

      // Validate options
      if (!Array.isArray(question.options) || question.options.length !== 4) {
        console.error('[GeminiQuestionGenerator] Invalid options array');
        return null;
      }

      // Validate that one option is marked correct
      const correctOptions = question.options.filter(opt => opt.correct);
      if (correctOptions.length !== 1) {
        console.error('[GeminiQuestionGenerator] Must have exactly one correct option');
        return null;
      }

      // Ensure correctAnswer matches
      const correctOption = correctOptions[0];
      if (correctOption.label !== question.correctAnswer) {
        console.warn('[GeminiQuestionGenerator] Mismatch in correctAnswer, fixing...');
        question.correctAnswer = correctOption.label;
      }

      return question;

    } catch (error) {
      console.error('[GeminiQuestionGenerator] Error parsing AI response:', error.message);
      return null;
    }
  }

  /**
   * Check rate limits
   */
  _checkRateLimits() {
    const now = Date.now();
    const today = new Date().toDateString();

    // Check daily limit
    const dailyCount = this.requestLog.daily.get(today) || 0;
    if (dailyCount >= this.DAILY_LIMIT) {
      return {
        allowed: false,
        reason: `Daily limit reached (${this.DAILY_LIMIT})`
      };
    }

    // Check per-minute limit
    const oneMinuteAgo = now - 60000;
    this.requestLog.perMinute = this.requestLog.perMinute.filter(t => t > oneMinuteAgo);
    
    if (this.requestLog.perMinute.length >= this.PER_MINUTE_LIMIT) {
      return {
        allowed: false,
        reason: `Per-minute limit reached (${this.PER_MINUTE_LIMIT})`
      };
    }

    return { allowed: true };
  }

  /**
   * Track request for rate limiting
   */
  _trackRequest() {
    const now = Date.now();
    const today = new Date().toDateString();

    // Track daily
    const dailyCount = this.requestLog.daily.get(today) || 0;
    this.requestLog.daily.set(today, dailyCount + 1);

    // Track per-minute
    this.requestLog.perMinute.push(now);

    // Clean old daily entries (keep last 7 days)
    if (this.requestLog.daily.size > 7) {
      const dates = Array.from(this.requestLog.daily.keys());
      const oldestDate = dates[0];
      this.requestLog.daily.delete(oldestDate);
    }
  }

  /**
   * Clean expired cache entries
   */
  _cleanCache() {
    const now = Date.now();
    for (const [key, value] of this.questionCache.entries()) {
      if (now - value.timestamp > this.CACHE_TTL_MS) {
        this.questionCache.delete(key);
      }
    }
  }

  /**
   * Get usage statistics
   */
  getUsageStats() {
    const today = new Date().toDateString();
    return {
      dailyCount: this.requestLog.daily.get(today) || 0,
      dailyLimit: this.DAILY_LIMIT,
      perMinuteCount: this.requestLog.perMinute.length,
      perMinuteLimit: this.PER_MINUTE_LIMIT,
      cacheSize: this.questionCache.size
    };
  }
}

module.exports = GeminiQuestionGenerator;
