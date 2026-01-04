/**
 * HintGenerationService
 * Production-safe AI hint generation with GroqCloud
 * 
 * CRITICAL DESIGN PRINCIPLES:
 * 1. AI ONLY called when wrong_streak >= 2 (pedagogically justified)
 * 2. GroqCloud free tier: 14,400 RPD, 30 RPM (vs Gemini's 20 RPD)
 * 3. Rate limiting: 1000 req/day cap, 15 req/min throttle
 * 4. Rule-based fallbacks ALWAYS available
 * 5. Never blocks learning - failures are silent
 * 
 * @see https://console.groq.com/docs/rate-limits
 */

class HintGenerationService {
  constructor() {
    // Provider configuration
    this.provider = process.env.HINT_AI_PROVIDER || 'groq'; // 'groq', 'gemini', or 'none'
    this.groqApiKey = process.env.GROQ_API_KEY;
    this.groqModel = process.env.GROQ_MODEL || 'llama-3.1-8b-instant'; // Fast, free
    
    // Fallback to Gemini if Groq unavailable
    this.geminiApiKey = process.env.GEMINI_API_KEY;
    this.geminiModel = process.env.AI_MODEL || 'gemini-2.5-flash-lite';
    
    // Rate limiting state (in-memory for MVP, should use Redis in production)
    this.requestLog = {
      daily: new Map(), // date -> count
      perMinute: []     // timestamps of last 15 requests
    };
    
    // Quota limits
    this.DAILY_LIMIT = parseInt(process.env.HINT_DAILY_LIMIT) || 1000;
    this.PER_MINUTE_LIMIT = parseInt(process.env.HINT_PER_MINUTE_LIMIT) || 15;
    
    // Cache for identical hint requests
    this.hintCache = new Map();
    this.CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours
    
    console.log('[HintService] Initialized:', {
      provider: this.provider,
      model: this.provider === 'groq' ? this.groqModel : this.geminiModel,
      hasGroqKey: !!this.groqApiKey,
      hasGeminiKey: !!this.geminiApiKey,
      dailyLimit: this.DAILY_LIMIT,
      perMinuteLimit: this.PER_MINUTE_LIMIT
    });
  }

  /**
   * Generate hint ONLY when pedagogically appropriate
   * 
   * @param {Object} params
   * @param {string} params.questionText - The geometry question
   * @param {string} params.topicName - Topic name (e.g., "Perimeter")
   * @param {number} params.difficultyLevel - 1-5
   * @param {number} params.wrongStreak - How many consecutive wrong answers
   * @param {string} params.mdpAction - Current MDP action
   * @param {string} params.representationType - 'text', 'visual', 'real_world'
   * @returns {Promise<{hint: string, source: 'ai'|'rule', reason: string}>}
   */
  async generateHint({
    questionText,
    topicName,
    difficultyLevel,
    wrongStreak = 0,
    mdpAction = '',
    representationType = 'text'
  }) {
    // GUARD 1: Only use AI when student is struggling
    if (wrongStreak < 2) {
      return {
        hint: this._getRuleBasedHint(topicName, difficultyLevel, representationType),
        source: 'rule',
        reason: 'wrong_streak < 2 - using rule-based hint'
      };
    }

    // GUARD 2: Check if MDP action warrants AI hint
    const aiWorthyActions = [
      'give_hint_then_retry',
      'repeat_same_concept_different_representation',
      'switch_to_visual_example',
      'switch_to_real_world_context'
    ];
    
    if (!aiWorthyActions.includes(mdpAction)) {
      return {
        hint: this._getRuleBasedHint(topicName, difficultyLevel, representationType),
        source: 'rule',
        reason: `MDP action '${mdpAction}' does not require AI`
      };
    }

    // GUARD 3: Check rate limits BEFORE calling AI
    const rateLimitCheck = this._checkRateLimits();
    if (!rateLimitCheck.allowed) {
      console.warn('[HintService] Rate limit exceeded:', rateLimitCheck.reason);
      return {
        hint: this._getRuleBasedHint(topicName, difficultyLevel, representationType),
        source: 'rule',
        reason: `Rate limit: ${rateLimitCheck.reason}`
      };
    }

    // GUARD 4: Check cache first
    const cacheKey = this._getCacheKey(questionText, topicName, representationType);
    const cached = this._getFromCache(cacheKey);
    if (cached) {
      console.log('[HintService] Cache HIT');
      return {
        hint: cached,
        source: 'ai-cached',
        reason: 'Retrieved from cache'
      };
    }

    // GUARD 5: Verify API keys exist
    if (!this.groqApiKey && !this.geminiApiKey) {
      console.warn('[HintService] No AI provider configured');
      return {
        hint: this._getRuleBasedHint(topicName, difficultyLevel, representationType),
        source: 'rule',
        reason: 'No API keys configured'
      };
    }

    // ALL GUARDS PASSED - Call AI
    try {
      this._trackRequest(); // Increment rate limit counters
      
      const aiHint = await this._callAI({
        questionText,
        topicName,
        difficultyLevel,
        representationType,
        wrongStreak
      });

      // Cache the result
      this._saveToCache(cacheKey, aiHint);

      return {
        hint: aiHint,
        source: 'ai',
        reason: 'AI generated (wrong_streak >= 2, MDP triggered)'
      };

    } catch (error) {
      console.error('[HintService] AI call failed:', error.message);
      
      // Silent failure - return rule-based hint
      return {
        hint: this._getRuleBasedHint(topicName, difficultyLevel, representationType),
        source: 'rule-fallback',
        reason: `AI error: ${error.message}`
      };
    }
  }

  /**
   * Call AI provider (GroqCloud or Gemini fallback)
   */
  async _callAI({ questionText, topicName, difficultyLevel, representationType, wrongStreak }) {
    const prompt = this._buildHintPrompt({
      questionText,
      topicName,
      difficultyLevel,
      representationType,
      wrongStreak
    });

    // Try GroqCloud first (better free tier)
    if (this.groqApiKey && (this.provider === 'groq' || this.provider === 'none')) {
      try {
        return await this._callGroq(prompt);
      } catch (groqError) {
        console.warn('[HintService] Groq failed, trying Gemini fallback:', groqError.message);
        // Fall through to Gemini
      }
    }

    // Fallback to Gemini
    if (this.geminiApiKey) {
      return await this._callGemini(prompt);
    }

    throw new Error('No AI provider available');
  }

  /**
   * Call GroqCloud API
   * @see https://console.groq.com/docs/text-chat
   */
  async _callGroq(prompt) {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.groqApiKey}`
      },
      body: JSON.stringify({
        model: this.groqModel,
        messages: [
          {
            role: 'system',
            content: 'You are a patient geometry tutor for elementary students (Grade 4-6). Give SHORT, concrete hints without solving the problem. Use simple words and visual language.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 100, // Keep hints SHORT
        top_p: 1
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  }

  /**
   * Call Google Gemini API (fallback)
   */
  async _callGemini(prompt) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.geminiModel}:generateContent?key=${this.geminiApiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 100
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text.trim();
  }

  /**
   * Build pedagogically-appropriate prompt
   * CRITICAL: AI constrained by chapter mastery - never introduces locked concepts
   */
  _buildHintPrompt({ questionText, topicName, difficultyLevel, representationType, wrongStreak, masteryLevel = 0, unlockedConcepts = [] }) {
    const representationGuidance = {
      'text': 'Use symbolic/algebraic language',
      'visual': 'Describe what they should visualize or draw',
      'real_world': 'Give a concrete, everyday example'
    };

    // Constraint: Define what concepts are allowed based on mastery
    const conceptConstraint = unlockedConcepts.length > 0 
      ? `ONLY use these unlocked concepts: ${unlockedConcepts.join(', ')}. NEVER mention future topics.`
      : `Focus ONLY on: ${topicName}. DO NOT introduce advanced concepts not yet learned.`;

    const masteryGuidance = masteryLevel <= 1 
      ? 'NOVICE - explain basics with concrete examples'
      : masteryLevel === 2 
      ? 'BEGINNER - build on fundamentals gently'
      : masteryLevel >= 3
      ? 'DEVELOPING+ - guide self-discovery'
      : '';

    return `A student has gotten ${wrongStreak} consecutive wrong answers on this geometry question. They need a gentle hint (NOT the answer).

**Topic**: ${topicName}
**Difficulty**: ${difficultyLevel}/10 | **Mastery**: ${masteryLevel}/5 (${masteryGuidance})
**Question**: ${questionText}
**Representation**: ${representationGuidance[representationType]}

**CONSTRAINTS**: ${conceptConstraint}

Give a SHORT hint (1-2 sentences max) that:
1. ${representationGuidance[representationType]}
2. Reminds them of the key concept or formula
3. Uses grade-school language (avoid words like "perpendicular", say "straight up and down")
4. Is encouraging

Do NOT solve the problem. Do NOT give the answer.`;
  }

  /**
   * Rule-based hints (ALWAYS available as fallback)
   * These are pedagogically designed for common topics
   */
  _getRuleBasedHint(topicName, difficultyLevel, representationType) {
    const topic = topicName.toLowerCase();

    // Visual representation hints
    if (representationType === 'visual') {
      if (topic.includes('area') || topic.includes('perimeter')) {
        return "Try drawing the shape on paper and labeling each side. Then count or measure each piece.";
      }
      if (topic.includes('angle')) {
        return "Imagine opening a door. The wider the opening, the bigger the angle. Can you picture that with this problem?";
      }
      if (topic.includes('triangle')) {
        return "Draw the triangle and mark each corner. Count how many corners (angles) you have.";
      }
    }

    // Real-world representation hints
    if (representationType === 'real_world') {
      if (topic.includes('perimeter')) {
        return "Think about walking around a playground. Perimeter is like counting your steps all the way around.";
      }
      if (topic.includes('area')) {
        return "Imagine covering a table with square tiles. Area is how many tiles you need.";
      }
      if (topic.includes('volume')) {
        return "Picture filling a box with small cubes. Volume is how many cubes fit inside.";
      }
    }

    // Default text-based hints by topic
    const defaultHints = {
      'perimeter': 'Perimeter means the distance around the outside. Add up all the side lengths.',
      'area': 'Area is the space inside the shape. For rectangles: multiply length × width.',
      'volume': 'Volume is the space inside a 3D shape. For boxes: length × width × height.',
      'angle': 'Angles are measured in degrees. A right angle is 90°, straight line is 180°.',
      'triangle': 'Remember: All triangles have 3 sides and 3 angles that add up to 180°.',
      'circle': 'For circles, remember: diameter goes all the way across, radius is half of that.',
      'polygon': 'Count the sides and angles. The number of sides = number of angles.',
      'line': 'Lines go on forever in both directions. Line segments have endpoints.'
    };

    // Find matching hint
    for (const [key, hint] of Object.entries(defaultHints)) {
      if (topic.includes(key)) {
        return hint;
      }
    }

    // Generic fallback
    return `Think about what the question is asking. What formula or concept from ${topicName} might help?`;
  }

  /**
   * Rate limiting logic
   */
  _checkRateLimits() {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // Check daily limit
    const dailyCount = this.requestLog.daily.get(today) || 0;
    if (dailyCount >= this.DAILY_LIMIT) {
      return {
        allowed: false,
        reason: `Daily limit reached (${dailyCount}/${this.DAILY_LIMIT})`
      };
    }

    // Check per-minute limit
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    
    // Remove old timestamps
    this.requestLog.perMinute = this.requestLog.perMinute.filter(ts => ts > oneMinuteAgo);
    
    if (this.requestLog.perMinute.length >= this.PER_MINUTE_LIMIT) {
      return {
        allowed: false,
        reason: `Per-minute limit reached (${this.requestLog.perMinute.length}/${this.PER_MINUTE_LIMIT})`
      };
    }

    return { allowed: true };
  }

  /**
   * Track a request for rate limiting
   */
  _trackRequest() {
    const today = new Date().toISOString().split('T')[0];
    const dailyCount = this.requestLog.daily.get(today) || 0;
    this.requestLog.daily.set(today, dailyCount + 1);
    
    this.requestLog.perMinute.push(Date.now());

    // Clean up old daily logs (keep last 7 days)
    if (this.requestLog.daily.size > 7) {
      const dates = Array.from(this.requestLog.daily.keys()).sort();
      for (let i = 0; i < dates.length - 7; i++) {
        this.requestLog.daily.delete(dates[i]);
      }
    }
  }

  /**
   * Cache management
   */
  _getCacheKey(questionText, topicName, representationType) {
    return `${topicName}|${representationType}|${questionText.substring(0, 100)}`;
  }

  _getFromCache(key) {
    const entry = this.hintCache.get(key);
    if (!entry) return null;

    // Check if expired
    if (Date.now() - entry.timestamp > this.CACHE_TTL_MS) {
      this.hintCache.delete(key);
      return null;
    }

    return entry.hint;
  }

  _saveToCache(key, hint) {
    this.hintCache.set(key, {
      hint,
      timestamp: Date.now()
    });

    // Limit cache size to 500 entries
    if (this.hintCache.size > 500) {
      const firstKey = this.hintCache.keys().next().value;
      this.hintCache.delete(firstKey);
    }
  }

  /**
   * Get current rate limit status (for monitoring)
   */
  getRateLimitStatus() {
    const today = new Date().toISOString().split('T')[0];
    const dailyCount = this.requestLog.daily.get(today) || 0;
    const perMinuteCount = this.requestLog.perMinute.filter(
      ts => ts > Date.now() - 60000
    ).length;

    return {
      daily: {
        used: dailyCount,
        limit: this.DAILY_LIMIT,
        remaining: this.DAILY_LIMIT - dailyCount
      },
      perMinute: {
        used: perMinuteCount,
        limit: this.PER_MINUTE_LIMIT,
        remaining: this.PER_MINUTE_LIMIT - perMinuteCount
      },
      cacheSize: this.hintCache.size
    };
  }
}

module.exports = HintGenerationService;
