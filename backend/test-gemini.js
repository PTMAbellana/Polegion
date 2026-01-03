// Test script to list available Gemini models
require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyAJa3t4tfZPqQjI6oK_UHNe2Vb3vJNVu4A';

async function listModels() {
  console.log('Testing Gemini API with key:', API_KEY.substring(0, 10) + '...');
  
  // Try listing models
  const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
  console.log('\n1. Listing available models...');
  
  try {
    const response = await fetch(listUrl);
    if (!response.ok) {
      const error = await response.text();
      console.error('List models failed:', error);
      return;
    }
    
    const data = await response.json();
    console.log('\nAvailable models:');
    data.models.forEach(model => {
      console.log(`  - ${model.name}`);
      console.log(`    Supports: ${model.supportedGenerationMethods.join(', ')}`);
    });
    
    // Try to generate content with the first available model
    const firstModel = data.models.find(m => m.supportedGenerationMethods.includes('generateContent'));
    if (firstModel) {
      console.log(`\n2. Testing generation with: ${firstModel.name}`);
      await testGeneration(firstModel.name, API_KEY);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function testGeneration(modelName, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/${modelName}:generateContent?key=${apiKey}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: 'Say hello in one sentence.' }]
        }]
      })
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.error('Generation failed:', error);
      return;
    }
    
    const data = await response.json();
    console.log('\n✓ Success! Response:');
    console.log(data.candidates[0].content.parts[0].text);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

listModels();
