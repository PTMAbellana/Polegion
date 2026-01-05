/**
 * GroqQuestionGenerator
 * AI-powered question generation for difficulty levels 4-5 using Groq API
 * 
 * DESIGN PRINCIPLES:
 * 1. Use AI for high difficulty questions (levels 4-5) where parametric templates are limited
 * 2. Always have fallback to parametric templates if AI fails
 * 3. Validate AI output to ensure proper format
 * 4. Cache AI-generated questions to save quota
 * 5. Rate limit to protect free tier
 * 
 * TECHNOLOGY: Groq API (llama-3.1-8b-instant)
 * Rate Limits: 30 RPM, 14.4K RPD
 */

const Groq = require('groq-sdk');

class GroqQuestionGenerator {
  constructor() {
    this.apiKey = process.env.GROQ_API_KEY;
    this.model = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';
    
    if (this.apiKey) {
      this.client = new Groq({ apiKey: this.apiKey });
    }

    // Rate limiting (Groq limits: 30 RPM, 14.4K RPD)
    this.requestLog = {
      daily: new Map(),
      perMinute: []
    };
    
    this.DAILY_LIMIT = 14000; // Leave some buffer
    this.PER_MINUTE_LIMIT = 25; // Leave buffer from 30 RPM

    // Cache for generated questions
    this.questionCache = new Map();
    this.CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour

    console.log('[AIQuestionGenerator] Initialized (Groq):', {
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
      console.warn('[AIQuestionGenerator] Rate limit exceeded:', rateLimitCheck.reason);
      return null; // Will use fallback
    }

    // Check API key
    if (!this.apiKey || !this.client) {
      console.warn('[AIQuestionGenerator] No API key configured');
      return null;
    }

    // Generate cache key
    const cacheKey = `${topicName}_${difficultyLevel}_${cognitiveDomain}_${Date.now()}`;
    
    try {
      // Track request
      this._trackRequest();

      // Build prompt
      const prompt = this._buildQuestionPrompt(topicName, difficultyLevel, cognitiveDomain);

      // Call Groq
      const completion = await this.client.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: this.model,
        temperature: 0.7,
        max_tokens: 1000,
      });

      const text = completion.choices[0]?.message?.content;
      if (!text) {
        console.error('[AIQuestionGenerator] Empty response from Groq');
        return null;
      }

      // Parse and validate response
      const question = this._parseQuestionResponse(text);
      
      if (!question) {
        console.error('[AIQuestionGenerator] Failed to parse AI response');
        return null;
      }

      // Convert Groq format to standard format expected by controller
      const standardizedQuestion = {
        // Standard fields expected by controller
        id: `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        questionId: `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        question_text: question.questionText,  // Controller expects question_text
        options: question.options,             // Already correct format
        hint: question.hint,
        correct_answer: question.correctAnswer,
        type: 'ai_generated',
        cognitive_domain: cognitiveDomain,
        representation_type: 'text',
        
        // Metadata
        generatedBy: 'ai',
        model: this.model,
        difficultyLevel: difficultyLevel,
        topicName: topicName
      };

      // Cache it
      this.questionCache.set(`${topicName}_${difficultyLevel}`, {
        question: standardizedQuestion,
        timestamp: Date.now()
      });

      console.log('[AIQuestionGenerator] Generated AI question:', standardizedQuestion.id);
      return standardizedQuestion;

    } catch (error) {
      console.error('[AIQuestionGenerator] Error generating question:', error.message);
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

Return ONLY valid JSON, nothing else. No markdown, no extra text. Use this exact format and MUST escape all quotes inside strings:
{
  "questionText": "The complete question text - escape all internal quotes with backslash",
  "options": [
    {"label": "A", "text": "First option - escape internal quotes", "correct": false},
    {"label": "B", "text": "Second option - escape internal quotes", "correct": true},
    {"label": "C", "text": "Third option - escape internal quotes", "correct": false},
    {"label": "D", "text": "Fourth option - escape internal quotes", "correct": false}
  ],
  "correctAnswer": "B",
  "hint": "A helpful hint - escape internal quotes",
  "explanation": "Why this is correct"
}

CRITICAL RULES FOR JSON:
- MUST be valid JSON that JavaScript JSON.parse() can read
- ALL quotes inside string values must be escaped with backslash: \\"
- Example: If text is: What is a "square"? write it as: "text": "What is a \\"square\\"?"
- No markdown code blocks
- No extra text before or after the JSON
- Exactly 4 options, exactly 1 correct`;
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
   * Handles malformed JSON with fallback extraction
   */
  _parseQuestionResponse(responseText) {
    try {
      // Remove markdown code blocks if present
      let cleaned = responseText.trim();
      cleaned = cleaned.replace(/```json\s*/g, '');
      cleaned = cleaned.replace(/```\s*/g, '');
      
      let question = null;
      
      // Step 1: Try direct JSON parse
      try {
        question = JSON.parse(cleaned);
      } catch (parseError) {
        console.warn('[AIQuestionGenerator] Direct JSON parse failed, extracting object from response...');
        
        // Step 2: Extract JSON object from text
        const jsonStart = cleaned.indexOf('{');
        const jsonEnd = cleaned.lastIndexOf('}');
        
        if (jsonStart === -1 || jsonEnd === -1) {
          throw new Error('No JSON object found in response');
        }
        
        let jsonStr = cleaned.substring(jsonStart, jsonEnd + 1);
        
        // Step 3: Try parsing extracted JSON
        try {
          question = JSON.parse(jsonStr);
        } catch (extractedError) {
          console.warn('[AIQuestionGenerator] Extracted JSON also failed, attempting field extraction...');
          
          // Step 4: Last resort - extract fields manually using regex
          question = this._extractQuestionFields(jsonStr);
          
          if (!question) {
            throw new Error('Could not extract question fields');
          }
        }
      }

      // Validate structure
      if (!question || !question.questionText || !question.options || !question.correctAnswer || !question.hint) {
        console.error('[AIQuestionGenerator] Missing required fields in AI response');
        console.error('[AIQuestionGenerator] Got:', question);
        return null;
      }

      // Validate options
      if (!Array.isArray(question.options) || question.options.length !== 4) {
        console.error('[AIQuestionGenerator] Invalid options array, expected 4 options');
        return null;
      }

      // Validate that one option is marked correct
      const correctOptions = question.options.filter(opt => opt && opt.correct);
      if (correctOptions.length !== 1) {
        console.error('[AIQuestionGenerator] Must have exactly one correct option');
        return null;
      }

      // Ensure correctAnswer matches
      const correctOption = correctOptions[0];
      if (correctOption.label !== question.correctAnswer) {
        console.warn('[AIQuestionGenerator] Mismatch in correctAnswer, fixing...');
        question.correctAnswer = correctOption.label;
      }

      return question;

    } catch (error) {
      console.error('[AIQuestionGenerator] Error parsing AI response:', error.message);
      return null;
    }
  }

  /**
   * Extract question fields manually using regex patterns
   * Last resort when JSON parsing fails completely
   */
  _extractQuestionFields(jsonStr) {
    try {
      // Extract questionText
      const questionMatch = jsonStr.match(/"questionText"\s*:\s*"([^"]*(?:\\"[^"]*)*?)(?<!\\)"\s*,/);
      const questionText = questionMatch ? questionMatch[1].replace(/\\"/g, '"') : null;
      
      // Extract hint
      const hintMatch = jsonStr.match(/"hint"\s*:\s*"([^"]*(?:\\"[^"]*)*?)(?<!\\)"\s*[,}]/);
      const hint = hintMatch ? hintMatch[1].replace(/\\"/g, '"') : 'Try breaking down the problem';
      
      // Extract correctAnswer
      const answerMatch = jsonStr.match(/"correctAnswer"\s*:\s*"([A-D])"/);
      const correctAnswer = answerMatch ? answerMatch[1] : null;
      
      // Extract options using a simpler approach
      const optionsMatch = jsonStr.match(/"options"\s*:\s*\[([\s\S]*?)\]/);
      let options = [];
      
      if (optionsMatch) {
        const optionsStr = optionsMatch[1];
        // Match each option object  
        const optMatches = optionsStr.match(/\{[^}]*"label"\s*:\s*"([A-D])"[^}]*"text"\s*:\s*"([^"]*)"[^}]*"correct"\s*:\s*(true|false)[^}]*\}/g);
        
        if (optMatches) {
          options = optMatches.map(optStr => {
            const labelMatch = optStr.match(/"label"\s*:\s*"([A-D])"/);
            const textMatch = optStr.match(/"text"\s*:\s*"([^"]*)"/);
            const correctMatch = optStr.match(/"correct"\s*:\s*(true|false)/);
            
            return {
              label: labelMatch ? labelMatch[1] : '',
              text: textMatch ? textMatch[1] : '',
              correct: correctMatch ? correctMatch[1] === 'true' : false
            };
          });
        }
      }
      
      if (!questionText || !correctAnswer || options.length !== 4) {
        return null;
      }
      
      return {
        questionText,
        options,
        correctAnswer,
        hint
      };
    } catch (error) {
      console.error('[AIQuestionGenerator] Field extraction failed:', error.message);
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

module.exports = GroqQuestionGenerator;
