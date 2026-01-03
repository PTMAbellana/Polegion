/**
 * AIExplanationService
 * Generates step-by-step explanations for student answers
 * Supports both OpenAI and Google Gemini APIs
 */

class AIExplanationService {
  constructor() {
    this.provider = process.env.AI_PROVIDER || 'openai'; // 'openai' or 'gemini'
    this.apiKey = process.env.AI_API_KEY || process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;
    this.model = process.env.AI_MODEL || 'gpt-4o-mini'; // or 'gemini-pro'
    
    // In-memory cache: key = hash(question+answer), value = explanation
    this.explanationCache = new Map();
    
    console.log('[AIExplanation] Initialized:', {
      provider: this.provider,
      model: this.model,
      hasApiKey: !!this.apiKey,
      apiKeyPrefix: this.apiKey ? this.apiKey.substring(0, 10) + '...' : 'NONE'
    });
  }

  /**
   * Generate step-by-step explanation for a student's answer
   * @param {Object} params
   * @param {string} params.questionText - The question that was asked
   * @param {Array} params.options - All answer options
   * @param {string} params.correctAnswer - The correct answer
   * @param {string} params.userAnswer - What the student selected
   * @param {boolean} params.isCorrect - Whether answer was correct
   * @param {string} params.topicName - Topic name (e.g., "Perimeter and Area")
   * @param {number} params.difficultyLevel - Question difficulty (1-5)
   * @returns {Promise<string>} Step-by-step explanation
   */
  async generateExplanation({
    questionText,
    options,
    correctAnswer,
    userAnswer,
    isCorrect,
    topicName,
    difficultyLevel
  }) {
    console.log('[AIExplanation] generateExplanation called:', {
      questionText,
      correctAnswer,
      userAnswer,
      isCorrect,
      topicName,
      hasApiKey: !!this.apiKey
    });

    if (!this.apiKey) {
      console.log('[AIExplanation] No API key, using fallback');
      return this._getFallbackExplanation({ questionText, correctAnswer, userAnswer, isCorrect });
    }

    // Check cache first to avoid unnecessary API calls
    const cacheKey = this._getCacheKey(questionText, userAnswer, isCorrect);
    if (this.explanationCache.has(cacheKey)) {
      console.log('[AIExplanation] Cache HIT - reusing cached explanation');
      return this.explanationCache.get(cacheKey);
    }
    console.log('[AIExplanation] Cache MISS - calling API');

    const prompt = this._buildPrompt({
      questionText,
      options,
      correctAnswer,
      userAnswer,
      isCorrect,
      topicName,
      difficultyLevel
    });

    try {
      console.log('[AIExplanation] Calling', this.provider, 'API...');
      let result;
      if (this.provider === 'gemini') {
        result = await this._callGemini(prompt);
        console.log('[AIExplanation] Gemini response received:', result.substring(0, 100) + '...');
      } else {
        result = await this._callOpenAI(prompt);
        console.log('[AIExplanation] OpenAI response received:', result.substring(0, 100) + '...');
      }
      
      // Cache the result for future use
      this.explanationCache.set(cacheKey, result);
      console.log('[AIExplanation] Cached explanation. Cache size:', this.explanationCache.size);
      
      return result;
    } catch (error) {
      console.error('[AIExplanation] AI generation error:', error.message);
      console.error('[AIExplanation] Full error:', error);
      return this._getFallbackExplanation({ questionText, correctAnswer, userAnswer, isCorrect });
    }
  }

  /**
   * Generate cache key from question and answer
   * Same question + same answer = same explanation
   */
  _getCacheKey(questionText, userAnswer, isCorrect) {
    // Simple hash: question + answer + correctness
    const normalized = `${questionText.toLowerCase().trim()}|${userAnswer.toLowerCase().trim()}|${isCorrect}`;
    // Use a simple hash or just return normalized string
    return normalized;
  }

  /**
   * Build the prompt for AI explanation
   */
  _buildPrompt({ questionText, options, correctAnswer, userAnswer, isCorrect, topicName, difficultyLevel }) {
    const status = isCorrect ? "correctly" : "incorrectly";
    const encouragement = isCorrect ? 
      "Reinforce why this answer is correct and what concept they demonstrated understanding of." :
      "Explain the misconception, then guide them to the correct answer without being discouraging.";

    return `You are a patient, encouraging geometry tutor for middle school students (Grade 7-10). A student just answered a question ${status}.

**Topic**: ${topicName}
**Difficulty Level**: ${difficultyLevel}/5
**Question**: ${questionText}

**Available Options**:
${options.map(opt => `- ${opt.label} ${opt.correct ? '(Correct)' : ''}`).join('\n')}

**Student's Answer**: ${userAnswer}
**Correct Answer**: ${correctAnswer}
**Result**: ${isCorrect ? '✓ Correct' : '✗ Incorrect'}

Provide a step-by-step explanation following this structure:

1. **Acknowledgment**: ${isCorrect ? 'Praise their correct answer' : 'Gently acknowledge the mistake'}
2. **Concept Review**: Briefly explain the key concept being tested (1-2 sentences)
3. **Step-by-Step Solution**: Break down how to solve this problem (2-4 clear steps)
4. **Why This Matters**: Connect to real-world application or next topic (1 sentence)
${!isCorrect ? '5. **Common Mistake**: Explain why their answer was wrong and how to avoid this error' : ''}

Keep the tone encouraging and age-appropriate. Use simple language. Keep total response under 150 words.`;
  }

  /**
   * Call OpenAI API
   */
  async _callOpenAI(prompt) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a patient, encouraging geometry tutor for middle school students. Provide clear, step-by-step explanations that build understanding.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 400
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  }

  /**
   * Call Google Gemini API
   */
  /**
   * Call Google Gemini API (v1beta endpoint - required for gemini-2.5-flash)
   */
  async _callGemini(prompt) {
    // Use v1beta with models/ prefix for gemini-2.5-flash support
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
    console.log('[AIExplanation] Gemini URL:', url.replace(this.apiKey, 'API_KEY_HIDDEN'));
    console.log('[AIExplanation] Model from env:', this.model);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
          topK: 40,
          topP: 0.95
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[AIExplanation] Gemini error response:', errorText);
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('[AIExplanation] Raw Gemini response:', JSON.stringify(data, null, 2));
    
    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
      console.error('[AIExplanation] Unexpected response structure:', data);
      throw new Error('Invalid Gemini response format');
    }
    
    const fullText = data.candidates[0].content.parts[0].text.trim();
    console.log('[AIExplanation] Full response text:', fullText);
    console.log('[AIExplanation] Response length:', fullText.length, 'characters');
    
    // Check if response was blocked by safety filters
    if (data.candidates[0].finishReason === 'SAFETY') {
      console.warn('[AIExplanation] Response blocked by safety filters');
    }
    
    return fullText;
  }

  /**
   * Fallback explanation when AI is unavailable
   */
  _getFallbackExplanation({ questionText, correctAnswer, userAnswer, isCorrect }) {
    if (isCorrect) {
      return `✓ **Correct!** Great job!\n\nYou selected "${userAnswer}" which is the right answer. You're demonstrating good understanding of this concept. Keep up the excellent work!`;
    } else {
      return `Let's review this together.\n\n**Your answer**: ${userAnswer}\n**Correct answer**: ${correctAnswer}\n\nTake a moment to think about why "${correctAnswer}" is correct. Consider reviewing the concept and trying similar problems. You're making progress!`;
    }
  }

  /**
   * Generate hint for a question (before answering)
   * @param {Object} params
   * @returns {Promise<string>} Helpful hint without giving away answer
   */
  async generateHint({ questionText, topicName, difficultyLevel }) {
    if (!this.apiKey) {
      return `Think about the key concept in ${topicName}. What formula or rule applies here?`;
    }

    const prompt = `You are a geometry tutor. A student is stuck on this question and needs a hint (NOT the answer):

**Topic**: ${topicName}
**Question**: ${questionText}

Provide a helpful hint that:
1. Reminds them of the relevant formula or concept
2. Suggests an approach without solving it
3. Is encouraging and brief (2-3 sentences max)

Do NOT give away the answer directly.`;

    try {
      if (this.provider === 'gemini') {
        return await this._callGemini(prompt);
      } else {
        return await this._callOpenAI(prompt);
      }
    } catch (error) {
      console.error('Hint generation error:', error);
      return `Think about the key concept in ${topicName}. What formula or rule applies here?`;
    }
  }
}

module.exports = AIExplanationService;
