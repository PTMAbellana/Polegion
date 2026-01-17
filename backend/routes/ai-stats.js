/**
 * API Endpoint: GET /api/admin/ai-stats
 * Real-time AI usage monitoring
 * 
 * Returns:
 * - OpenAI requests, tokens, cost
 * - Groq requests, tokens
 * - Cache hit rate
 * - Total cost
 */

const express = require('express');
const router = express.Router();

// This will be injected by the server
let aiGeneratorInstance = null;

function setAIGenerator(aiGenerator) {
  aiGeneratorInstance = aiGenerator;
}

router.get('/api/admin/ai-stats', (req, res) => {
  try {
    if (!aiGeneratorInstance) {
      return res.json({
        error: 'AI generator not initialized',
        hint: 'Restart backend after installing OpenAI package'
      });
    }

    const stats = aiGeneratorInstance.getStats();
    
    res.json({
      timestamp: new Date().toISOString(),
      openai: {
        requests: stats.openai.requests,
        tokens: stats.openai.tokens,
        cost_usd: `$${stats.openai.estimatedCost.toFixed(4)}`,
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini'
      },
      groq: {
        requests: stats.groq.requests,
        tokens: stats.groq.tokens,
        cost_usd: '$0.0000 (free)',
        model: process.env.GROQ_MODEL || 'llama-3.1-70b-versatile'
      },
      cache: {
        size: stats.cacheSize,
        hit_rate: stats.totalRequests > 0 
          ? `${((stats.cacheSize / stats.totalRequests) * 100).toFixed(1)}%`
          : '0%'
      },
      totals: {
        requests: stats.totalRequests,
        cost_usd: `$${stats.openai.estimatedCost.toFixed(4)}`,
        primary_provider: stats.openai.requests > stats.groq.requests ? 'OpenAI' : 'Groq'
      },
      estimated_weekly_cost: {
        students_40: '$0.84 - $1.68',
        students_80: '$1.68 - $3.36',
        per_student: '$0.02 - $0.04'
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get AI stats',
      message: error.message
    });
  }
});

module.exports = { router, setAIGenerator };
