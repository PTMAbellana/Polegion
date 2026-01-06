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
   * @param {string} params.topicFilter - Specific subtopics (e.g., "parallel_lines|perpendicular_lines")
   * @param {number} params.difficultyLevel - 4 or 5
   * @param {string} params.cognitiveDomain - Cognitive domain (e.g., "analytical_thinking")
   * @param {Array} params.excludeQuestionIds - Question IDs to avoid duplicates
   * @returns {Promise<Object>} Generated question with options, answer, hint
   */
  async generateQuestion({ topicName, topicFilter, difficultyLevel, cognitiveDomain, excludeQuestionIds = [] }) {
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

      // Build prompt with specific topic context
      const prompt = this._buildQuestionPrompt(topicName, topicFilter, difficultyLevel, cognitiveDomain);

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
   * 
   * WHY topicFilter: The topic name alone (e.g., "Points, Lines, and Planes") is too broad.
   * The topicFilter provides specific subtopics (e.g., "parallel_lines|perpendicular_lines")
   * to ensure the AI generates relevant questions for the current learning focus.
   */
  _buildQuestionPrompt(topicName, topicFilter, difficultyLevel, cognitiveDomain) {
    const difficultyDescription = difficultyLevel === 5 
      ? 'Very challenging, requiring multi-step reasoning and creative problem-solving'
      : 'Challenging, requiring analytical thinking and complex calculations';

    const domainDescription = this._getCognitiveDomainDescription(cognitiveDomain);
    
    // Parse topic filter into readable subtopics
    const subtopics = topicFilter ? topicFilter.split('|').map(f => 
      f.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    ).join(', ') : 'general concepts';

    return `You are an expert geometry teacher creating a ${difficultyDescription} question for elementary students.

TOPIC: ${topicName}
SPECIFIC FOCUS: ${subtopics}
DIFFICULTY LEVEL: ${difficultyLevel}/5
COGNITIVE DOMAIN: ${cognitiveDomain} - ${domainDescription}

CRITICAL: The question MUST be about the SPECIFIC FOCUS topics listed above.
Example: If focus is "Parallel Lines, Perpendicular Lines", DO NOT create questions about volume, area, or unrelated topics.

Create a geometry question that:
1. Is SPECIFICALLY about the focus topics (${subtopics})
2. Has EXACTLY 4 multiple choice options (A, B, C, D)
3. Each option should be SHORT and CONCISE (max 15 words per option)
4. Has only ONE correct answer
5. The CORRECT answer MUST be included in the options list
6. Includes a helpful hint for struggling students
7. Uses clear, child-friendly language
8. Involves interesting scenarios (real-world contexts preferred)

CRITICAL MATHEMATICAL CORRECTNESS:
- Calculate the correct answer FIRST
- Then create 3 plausible but INCORRECT distractors
- VERIFY the correct answer is one of the 4 options before returning
- Double-check your math (e.g., rectangle perimeter = 2(length + width), NOT just length + width)

CRITICAL: ALL 4 OPTIONS MUST BE DIFFERENT!
- NEVER repeat the same value in multiple options
- Each option must be UNIQUE and DISTINCT
- Example BAD (WRONG): ["96 cubic meters", "96 square meters", "96 cubic meters", "96 cubic meters"] ← DUPLICATE VALUES!
- Example GOOD (CORRECT): ["96 cubic meters", "48 cubic meters", "120 cubic meters", "192 cubic meters"] ← ALL DIFFERENT!
- Create realistic wrong answers:
  * Common student mistakes (e.g., forgetting to multiply by 2, using wrong formula)
  * Off-by-one errors
  * Different magnitude (double, half, etc.)

IMPORTANT: Keep answer choices SHORT and to the point. Avoid long explanations in the options.
Good example: "46 feet"
Bad example: "The total perimeter is 46 feet because we use the formula 2(l+w)"

Return ONLY valid JSON, nothing else. No markdown, no extra text. Use this exact format and MUST escape all quotes inside strings:
{
  "questionText": "The complete question text - escape all internal quotes with backslash",
  "options": [
    {"label": "A", "text": "First option - SHORT and concise", "correct": false},
    {"label": "B", "text": "Second option - SHORT and concise", "correct": true},
    {"label": "C", "text": "Third option - SHORT and concise", "correct": false},
    {"label": "D", "text": "Fourth option - SHORT and concise", "correct": false}
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
- Exactly 4 options, exactly 1 correct
- Each option text MUST be under 15 words (preferably under 10)`;
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

      // CRITICAL: Validate NO duplicate options (all options must be unique)
      const optionTexts = question.options.map(opt => opt.text.trim().toLowerCase());
      const uniqueTexts = new Set(optionTexts);
      if (uniqueTexts.size < 4) {
        console.error('[AIQuestionGenerator] DUPLICATE OPTIONS detected!');
        console.error('Options:', question.options.map(o => o.text));
        console.error('AI generated identical choices - rejecting question');
        return null; // Force fallback to parametric template
      }

      // Ensure correctAnswer matches
      const correctOption = correctOptions[0];
      if (correctOption.label !== question.correctAnswer) {
        console.warn('[AIQuestionGenerator] Mismatch in correctAnswer, fixing...');
        question.correctAnswer = correctOption.label;
      }

      // CRITICAL: Validate mathematical correctness for geometry questions
      // Extract numbers from question and answer to detect obvious errors
      const questionLower = question.questionText.toLowerCase();
      const correctText = correctOption.text.trim();
      
      // Extract ALL numbers from question (dimensions, measurements)
      const dimensionMatches = question.questionText.match(/(\d+(?:\.\d+)?)\s*(?:feet|ft|meters|m|units|cm|mm|km)/gi);
      const correctAnswerMatch = correctText.match(/(\d+(?:\.\d+)?)/);
      
      if (dimensionMatches && correctAnswerMatch) {
        const dimensions = dimensionMatches.map(d => parseFloat(d));
        const answerNum = parseFloat(correctAnswerMatch[0]);
        
        // VOLUME VALIDATION (rectangular prism, cube, cylinder, etc.)
        if (questionLower.includes('volume')) {
          let expectedVolume = null;
          
          // Rectangular prism: length × width × height
          if ((questionLower.includes('rectangular prism') || questionLower.includes('box') || questionLower.includes('container')) 
              && dimensions.length >= 3) {
            expectedVolume = dimensions[0] * dimensions[1] * dimensions[2];
            console.log(`[AIQuestionGenerator] Rectangular prism volume check: ${dimensions[0]} × ${dimensions[1]} × ${dimensions[2]} = ${expectedVolume}`);
          }
          // Cube: side³
          else if (questionLower.includes('cube') && dimensions.length >= 1) {
            expectedVolume = Math.pow(dimensions[0], 3);
            console.log(`[AIQuestionGenerator] Cube volume check: ${dimensions[0]}³ = ${expectedVolume}`);
          }
          // Cylinder: π × r² × h
          else if (questionLower.includes('cylinder') && dimensions.length >= 2) {
            const radius = questionLower.includes('radius') ? dimensions[0] : dimensions[0] / 2;
            const height = dimensions[dimensions.length - 1];
            expectedVolume = Math.PI * radius * radius * height;
            console.log(`[AIQuestionGenerator] Cylinder volume check: π × ${radius}² × ${height} = ${expectedVolume}`);
          }
          
          if (expectedVolume !== null && Math.abs(answerNum - expectedVolume) > 1) {
            console.error(`[AIQuestionGenerator] MATH ERROR: Volume should be ${expectedVolume.toFixed(2)}, got ${answerNum}`);
            console.error('Question:', question.questionText);
            console.error('Correct answer:', correctText);
            console.error('All options:', question.options.map(o => o.text));
            return null; // Reject incorrect math
          }
        }
        
        // PERIMETER VALIDATION
        else if (questionLower.includes('perimeter') && dimensions.length >= 2) {
          let expectedPerimeter = null;
          
          if (questionLower.includes('rectangle')) {
            expectedPerimeter = 2 * (dimensions[0] + dimensions[1]);
          } else if (questionLower.includes('square')) {
            expectedPerimeter = 4 * dimensions[0];
          }
          
          if (expectedPerimeter !== null && Math.abs(answerNum - expectedPerimeter) > 0.1) {
            console.error(`[AIQuestionGenerator] MATH ERROR: Perimeter should be ${expectedPerimeter}, got ${answerNum}`);
            console.error('Question:', question.questionText);
            return null;
          }
        }
        
        // AREA VALIDATION  
        else if (questionLower.includes('area') && dimensions.length >= 1) {
          let expectedArea = null;
          
          if (questionLower.includes('rectangle') && dimensions.length >= 2) {
            expectedArea = dimensions[0] * dimensions[1];
          } else if (questionLower.includes('square')) {
            expectedArea = dimensions[0] * dimensions[0];
          } else if (questionLower.includes('triangle') && dimensions.length >= 2) {
            expectedArea = 0.5 * dimensions[0] * dimensions[1];
          } else if (questionLower.includes('circle')) {
            const radius = questionLower.includes('radius') ? dimensions[0] : dimensions[0] / 2;
            expectedArea = Math.PI * radius * radius;
          }
          
          if (expectedArea !== null && Math.abs(answerNum - expectedArea) > 1) {
            console.error(`[AIQuestionGenerator] MATH ERROR: Area should be ${expectedArea.toFixed(2)}, got ${answerNum}`);
            console.error('Question:', question.questionText);
            return null;
          }
        }
      }

      // Log for debugging
      console.log('[AIQuestionGenerator] Question validated:', {
        question: question.questionText.substring(0, 60) + '...',
        correctOption: correctText,
        allOptions: question.options.map(opt => opt.text.trim())
      });

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
