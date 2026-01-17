/**
 * AI Usage Monitor - Check OpenAI/Groq usage and costs
 * Run: node utils/check-ai-usage.js
 */

require('dotenv').config();

async function checkAISetup() {
  console.log('\n===========================================');
  console.log('AI SETUP & USAGE CHECK');
  console.log('===========================================\n');

  // Check OpenAI
  console.log('1. OpenAI Configuration:');
  if (process.env.OPENAI_API_KEY) {
    const key = process.env.OPENAI_API_KEY;
    console.log('   ✅ API Key:', key.substring(0, 10) + '...' + key.slice(-4));
    console.log('   ✅ Model:', process.env.OPENAI_MODEL || 'gpt-4o-mini');
    
    // Test OpenAI connection
    try {
      const OpenAI = require('openai');
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      
      console.log('   🔍 Testing connection...');
      const response = await client.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [{ role: 'user', content: 'Say "OK"' }],
        max_tokens: 5
      });
      
      console.log('   ✅ Connection successful!');
      console.log('   📊 Test tokens used:', response.usage.total_tokens);
      console.log('   💰 Test cost: ~$' + ((response.usage.prompt_tokens * 0.15 + response.usage.completion_tokens * 0.60) / 1_000_000).toFixed(6));
    } catch (error) {
      console.log('   ❌ Connection failed:', error.message);
    }
  } else {
    console.log('   ❌ OPENAI_API_KEY not set in .env');
    console.log('   📝 Get key from: https://platform.openai.com/api-keys');
  }

  // Check Groq
  console.log('\n2. Groq Configuration (Failsafe):');
  if (process.env.GROQ_API_KEY) {
    const key = process.env.GROQ_API_KEY;
    console.log('   ✅ API Key:', key.substring(0, 10) + '...');
    console.log('   ✅ Model:', process.env.GROQ_MODEL || 'llama-3.1-70b-versatile');
    
    // Test Groq connection
    try {
      const Groq = require('groq-sdk');
      const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
      
      console.log('   🔍 Testing connection...');
      const response = await client.chat.completions.create({
        model: process.env.GROQ_MODEL || 'llama-3.1-70b-versatile',
        messages: [{ role: 'user', content: 'Say "OK"' }],
        max_tokens: 5
      });
      
      console.log('   ✅ Connection successful!');
      console.log('   📊 Test tokens used:', response.usage?.total_tokens || 'N/A');
      console.log('   💰 Cost: $0.00 (free)');
    } catch (error) {
      console.log('   ❌ Connection failed:', error.message);
    }
  } else {
    console.log('   ⚠️  GROQ_API_KEY not set (optional failsafe)');
  }

  // Package check
  console.log('\n3. Package Installation:');
  try {
    require('openai');
    console.log('   ✅ openai package installed');
  } catch {
    console.log('   ❌ openai package NOT installed');
    console.log('   📝 Run: npm install');
  }

  try {
    require('groq-sdk');
    console.log('   ✅ groq-sdk package installed');
  } catch {
    console.log('   ❌ groq-sdk package NOT installed');
  }

  // Usage estimate
  console.log('\n4. Cost Estimates:');
  console.log('   📊 40 students × 20 questions/day × 7 days = 5,600 questions');
  console.log('   💡 Hints needed: ~1,120 (20% of questions)');
  console.log('   💰 Estimated cost: $0.84 - $1.68 (with OpenAI GPT-4o-mini)');
  console.log('   💸 With Groq only: $0.00 (free tier)');

  console.log('\n===========================================');
  console.log('SETUP INSTRUCTIONS:');
  console.log('===========================================');
  console.log('\n1. Install OpenAI package:');
  console.log('   npm install');
  console.log('\n2. Get OpenAI API key:');
  console.log('   https://platform.openai.com/api-keys');
  console.log('\n3. Add to .env:');
  console.log('   OPENAI_API_KEY=sk-proj-...');
  console.log('   OPENAI_MODEL=gpt-4o-mini');
  console.log('   GROQ_MODEL=llama-3.1-70b-versatile');
  console.log('\n4. Restart backend:');
  console.log('   npm start\n');
}

checkAISetup().catch(console.error);
