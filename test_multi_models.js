require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const modelsToTry = ['gemini-1.5-pro', 'gemini-pro', 'gemini-1.5-flash-001', 'gemini-1.5-pro-001'];
  
  for (const modelName of modelsToTry) {
    console.log(`Trying ${modelName}...`);
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Hi');
      console.log(`SUCCESS with ${modelName}:`, result.response.text().slice(0, 20), '...');
      return;
    } catch (error) {
       console.log(`FAILED with ${modelName}:`, error.message.split('\n')[0]);
    }
  }
}

test();
