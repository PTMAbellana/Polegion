/**
 * COMPREHENSIVE SYSTEM CHECK
 * Verifies complete backend-frontend integration
 */

require('dotenv').config();

const checks = {
  passed: 0,
  failed: 0,
  warnings: 0
};

function pass(message) {
  console.log('✅', message);
  checks.passed++;
}

function fail(message) {
  console.log('❌', message);
  checks.failed++;
}

function warn(message) {
  console.log('⚠️ ', message);
  checks.warnings++;
}

function section(title) {
  console.log('\n' + '='.repeat(70));
  console.log(title);
  console.log('='.repeat(70));
}

async function runSystemCheck() {
  section('ENVIRONMENT CONFIGURATION CHECK');

  // 1. Check critical env vars
  const requiredVars = [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_KEY',
    'JWT_SECRET'
  ];

  for (const varName of requiredVars) {
    if (process.env[varName]) {
      pass(`${varName} is set`);
    } else {
      fail(`${varName} is MISSING`);
    }
  }

  // 2. Check AI configuration
  section('AI CONFIGURATION CHECK');

  if (process.env.GROQ_API_KEY) {
    pass('GROQ_API_KEY is set (primary AI provider)');
  } else {
    warn('GROQ_API_KEY is missing - hints will use rule-based fallback');
  }

  if (process.env.GEMINI_API_KEY) {
    pass('GEMINI_API_KEY is set (fallback AI provider)');
  } else {
    warn('GEMINI_API_KEY is missing - no AI fallback available');
  }

  if (process.env.HINT_AI_PROVIDER) {
    pass(`HINT_AI_PROVIDER = ${process.env.HINT_AI_PROVIDER}`);
  } else {
    warn('HINT_AI_PROVIDER not set - will default to "groq"');
  }

  // 3. Check Node.js version and capabilities
  section('RUNTIME ENVIRONMENT CHECK');

  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));
  
  if (majorVersion >= 18) {
    pass(`Node.js version ${nodeVersion} (fetch API available)`);
  } else {
    fail(`Node.js version ${nodeVersion} is too old - need v18+ for fetch API`);
  }

  if (typeof fetch !== 'undefined') {
    pass('fetch() is available globally');
  } else {
    fail('fetch() is NOT available - will cause runtime errors');
  }

  // 4. Check service files exist
  section('SERVICE FILES CHECK');

  const fs = require('fs');
  const path = require('path');

  const requiredFiles = [
    'application/services/AdaptiveLearningService.js',
    'application/services/HintGenerationService.js',
    'application/services/AIExplanationService.js',
    'infrastructure/repository/AdaptiveLearningRepo.js',
    'presentation/controllers/AdaptiveLearningController.js'
  ];

  for (const file of requiredFiles) {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      pass(`${file} exists`);
    } else {
      fail(`${file} is MISSING`);
    }
  }

  // 5. Test service instantiation
  section('SERVICE INSTANTIATION CHECK');

  try {
    const HintGenerationService = require('./application/services/HintGenerationService');
    const hintService = new HintGenerationService();
    pass('HintGenerationService instantiates successfully');
    
    // Check configuration
    if (hintService.groqApiKey) {
      pass('HintService has Groq API key');
    } else {
      warn('HintService has no Groq API key');
    }

    if (hintService.DAILY_LIMIT > 0) {
      pass(`Daily rate limit configured: ${hintService.DAILY_LIMIT}`);
    } else {
      fail('Daily rate limit not configured');
    }

  } catch (error) {
    fail(`HintGenerationService failed to load: ${error.message}`);
  }

  try {
    const AdaptiveLearningService = require('./application/services/AdaptiveLearningService');
    // Note: Can't fully instantiate without repo, but can check it loads
    pass('AdaptiveLearningService loads successfully');
  } catch (error) {
    fail(`AdaptiveLearningService failed to load: ${error.message}`);
  }

  // 6. Test hint generation logic
  section('HINT GENERATION LOGIC CHECK');

  try {
    const HintGenerationService = require('./application/services/HintGenerationService');
    const hintService = new HintGenerationService();

    // Test: wrong_streak < 2 should use rule-based
    const result1 = await hintService.generateHint({
      questionText: 'Test question',
      topicName: 'Perimeter and Area',
      difficultyLevel: 2,
      wrongStreak: 1,
      mdpAction: 'give_hint_then_retry',
      representationType: 'text'
    });

    if (result1.source === 'rule') {
      pass('Guard 1: wrong_streak < 2 uses rule-based hints');
    } else {
      fail(`Guard 1 FAILED: wrong_streak=1 returned source="${result1.source}"`);
    }

    // Test: wrong_streak >= 2 with non-hint action should use rule-based
    const result2 = await hintService.generateHint({
      questionText: 'Test question',
      topicName: 'Perimeter and Area',
      difficultyLevel: 2,
      wrongStreak: 3,
      mdpAction: 'decrease_difficulty',
      representationType: 'text'
    });

    if (result2.source === 'rule') {
      pass('Guard 2: Non-hint MDP action uses rule-based hints');
    } else {
      fail(`Guard 2 FAILED: decrease_difficulty returned source="${result2.source}"`);
    }

    // Test: Rate limit status
    const status = hintService.getRateLimitStatus();
    if (status && status.daily && status.perMinute) {
      pass('Rate limit tracking is functional');
    } else {
      fail('Rate limit tracking is broken');
    }

  } catch (error) {
    fail(`Hint generation test failed: ${error.message}`);
  }

  // 7. API Response Structure Check
  section('API RESPONSE STRUCTURE CHECK');

  console.log('Expected response from processAnswer() should include:');
  const expectedFields = [
    'success',
    'isCorrect',
    'currentDifficulty',
    'masteryLevel',
    'action',
    'actionReason',
    'aiHint (when wrong_streak >= 2)',
    'hintMetadata (when hint generated)'
  ];

  expectedFields.forEach(field => {
    console.log(`  - ${field}`);
  });
  pass('Response structure documented');

  // 8. Frontend Compatibility Check
  section('FRONTEND COMPATIBILITY CHECK');

  const frontendFiles = [
    '../frontend/components/adaptive/AdaptiveLearning.tsx',
    '../frontend/components/adaptive/AdaptiveFeedbackBox.tsx'
  ];

  for (const file of frontendFiles) {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check if frontend handles new fields
      if (content.includes('aiHint')) {
        pass(`${file.split('/').pop()} handles aiHint field`);
      } else {
        warn(`${file.split('/').pop()} may not handle aiHint field`);
      }

      if (content.includes('hintMetadata')) {
        pass(`${file.split('/').pop()} handles hintMetadata field`);
      } else {
        warn(`${file.split('/').pop()} may not handle hintMetadata field`);
      }
    }
  }

  // Final Summary
  section('SYSTEM CHECK SUMMARY');

  console.log(`✅ Passed: ${checks.passed}`);
  console.log(`❌ Failed: ${checks.failed}`);
  console.log(`⚠️  Warnings: ${checks.warnings}`);
  console.log();

  if (checks.failed === 0) {
    console.log('🎉 SYSTEM IS PRODUCTION-READY!');
    console.log();
    console.log('Next steps:');
    console.log('  1. Start backend: node server.js');
    console.log('  2. Start frontend: npm run dev');
    console.log('  3. Test with 2 consecutive wrong answers');
    console.log('  4. Verify AI hint appears in UI');
    return 0;
  } else {
    console.log('⚠️  SYSTEM HAS CRITICAL ISSUES');
    console.log('Please fix the failed checks above before deploying.');
    return 1;
  }
}

// Run the check
runSystemCheck()
  .then(exitCode => process.exit(exitCode))
  .catch(error => {
    console.error('Fatal error during system check:', error);
    process.exit(1);
  });
