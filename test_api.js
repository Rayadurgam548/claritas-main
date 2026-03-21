require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log('Testing with API Key (length):', apiKey ? apiKey.length : 0);
  
  if (!apiKey) {
    console.error('ERROR: No GEMINI_API_KEY found in .env');
    return;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

  try {
    const result = await model.generateContent('Hi, say "API works"');
    console.log('RESPONSE:', result.response.text());
  } catch (error) {
    console.error('API CALL FAILED:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

test();
