/**
 * TEST SUITE: HintGenerationService
 * Run this to verify production-safe AI hint system
 * 
 * Usage: node backend/test-hint-service.js
 */

require('dotenv').config();
const HintGenerationService = require('./application/services/HintGenerationService');

// Test scenarios
const tests = [
  {
    name: 'Test 1: wrong_streak < 2 (should use rule-based)',
    params: {
      questionText: 'What is the perimeter of a rectangle with length 5 and width 3?',
      topicName: 'Perimeter and Area',
      difficultyLevel: 2,
      wrongStreak: 1, // NOT enough to trigger AI
      mdpAction: 'maintain_difficulty',
      representationType: 'text'
    },
    expectedSource: 'rule'
  },
  {
    name: 'Test 2: wrong_streak >= 2 with hint action (should use AI)',
    params: {
      questionText: 'What is the perimeter of a rectangle with length 5 and width 3?',
      topicName: 'Perimeter and Area',
      difficultyLevel: 2,
      wrongStreak: 2, // Enough to trigger AI
      mdpAction: 'give_hint_then_retry', // AI-worthy action
      representationType: 'text'
    },
    expectedSource: 'ai'
  },
  {
    name: 'Test 3: wrong_streak >= 2 but non-hint action (should use rule-based)',
    params: {
      questionText: 'Find the area of a triangle with base 8 and height 6',
      topicName: 'Perimeter and Area',
      difficultyLevel: 3,
      wrongStreak: 3,
      mdpAction: 'decrease_difficulty', // NOT a hint action
      representationType: 'text'
    },
    expectedSource: 'rule'
  },
  {
    name: 'Test 4: Visual representation hint',
    params: {
      questionText: 'How many sides does a hexagon have?',
      topicName: 'Polygon Classification',
      difficultyLevel: 1,
      wrongStreak: 2,
      mdpAction: 'switch_to_visual_example',
      representationType: 'visual'
    },
    expectedSource: 'ai'
  },
  {
    name: 'Test 5: Real-world representation hint',
    params: {
      questionText: 'Calculate the volume of a box with dimensions 4×3×2',
      topicName: 'Volume',
      difficultyLevel: 3,
      wrongStreak: 2,
      mdpAction: 'switch_to_real_world_context',
      representationType: 'real_world'
    },
    expectedSource: 'ai'
  }
];

async function runTests() {
  console.log('='.repeat(70));
  console.log('HINT GENERATION SERVICE - PRODUCTION SAFETY TESTS');
  console.log('='.repeat(70));
  console.log();

  const hintService = new HintGenerationService();
  
  console.log('📋 Configuration Check:');
  console.log('  Provider:', hintService.provider);
  console.log('  Groq Key:', hintService.groqApiKey ? '✅ Present' : '❌ Missing');
  console.log('  Gemini Key:', hintService.geminiApiKey ? '✅ Present (fallback)' : '❌ Missing');
  console.log('  Daily Limit:', hintService.DAILY_LIMIT);
  console.log('  Per-Minute Limit:', hintService.PER_MINUTE_LIMIT);
  console.log();

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    console.log('-'.repeat(70));
    console.log(`🧪 ${test.name}`);
    console.log('-'.repeat(70));
    
    try {
      const result = await hintService.generateHint(test.params);
      
      console.log('📥 Input:');
      console.log('  Question:', test.params.questionText);
      console.log('  Topic:', test.params.topicName);
      console.log('  Wrong Streak:', test.params.wrongStreak);
      console.log('  MDP Action:', test.params.mdpAction);
      console.log('  Representation:', test.params.representationType);
      console.log();
      
      console.log('📤 Output:');
      console.log('  Hint:', result.hint);
      console.log('  Source:', result.source);
      console.log('  Reason:', result.reason);
      console.log();

      // Verify expected behavior
      const sourceMatch = test.expectedSource === 'ai' 
        ? ['ai', 'ai-cached'].includes(result.source)
        : result.source.includes('rule');
        
      if (sourceMatch) {
        console.log('✅ PASS: Got expected source type');
        passed++;
      } else {
        console.log(`❌ FAIL: Expected ${test.expectedSource}, got ${result.source}`);
        failed++;
      }

    } catch (error) {
      console.log('❌ ERROR:', error.message);
      failed++;
    }
    
    console.log();
  }

  // Rate limit status
  console.log('='.repeat(70));
  console.log('📊 RATE LIMIT STATUS');
  console.log('='.repeat(70));
  const status = hintService.getRateLimitStatus();
  console.log('Daily:', JSON.stringify(status.daily, null, 2));
  console.log('Per-Minute:', JSON.stringify(status.perMinute, null, 2));
  console.log('Cache Size:', status.cacheSize);
  console.log();

  // Summary
  console.log('='.repeat(70));
  console.log('TEST SUMMARY');
  console.log('='.repeat(70));
  console.log(`✅ Passed: ${passed}/${tests.length}`);
  console.log(`❌ Failed: ${failed}/${tests.length}`);
  console.log();

  if (failed === 0) {
    console.log('🎉 ALL TESTS PASSED - SYSTEM PRODUCTION-READY');
  } else {
    console.log('⚠️  SOME TESTS FAILED - REVIEW CONFIGURATION');
  }
  console.log('='.repeat(70));
}

// Run tests
runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
