/**
 * Direct GroqCloud API Test
 * Verifies API key is working and calls are being tracked
 */

require('dotenv').config();

async function testGroqDirect() {
  const apiKey = process.env.GROQ_API_KEY;
  const model = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';

  console.log('='.repeat(70));
  console.log('DIRECT GROQCLOUD API TEST');
  console.log('='.repeat(70));
  console.log('API Key:', apiKey ? apiKey.substring(0, 15) + '...' : 'MISSING');
  console.log('Model:', model);
  console.log();

  if (!apiKey) {
    console.log('❌ GROQ_API_KEY not found in .env');
    return;
  }

  console.log('📡 Making direct API call to GroqCloud...');
  console.log();

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant.'
          },
          {
            role: 'user',
            content: 'Say "Hello from GroqCloud!" in one sentence.'
          }
        ],
        temperature: 0.7,
        max_tokens: 50
      })
    });

    console.log('Response Status:', response.status, response.statusText);
    console.log();

    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ API Error Response:');
      console.log(errorText);
      return;
    }

    const data = await response.json();
    
    console.log('✅ SUCCESS! GroqCloud API is working!');
    console.log();
    console.log('Response:');
    console.log(JSON.stringify(data, null, 2));
    console.log();
    console.log('AI Response:', data.choices[0].message.content);
    console.log();
    console.log('✅ Check your GroqCloud dashboard - usage should increment');
    console.log('   Dashboard: https://console.groq.com/');

  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log();
    console.log('Possible issues:');
    console.log('  1. Invalid API key');
    console.log('  2. Network connection problem');
    console.log('  3. API endpoint changed');
  }
}

testGroqDirect();
