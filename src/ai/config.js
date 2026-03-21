require('dotenv').config();
const { GoogleGenerativeAI, Schema, SchemaType } = require('@google/generative-ai');

if (!process.env.GEMINI_API_KEY) {
  console.warn('WARNING: GEMINI_API_KEY is not set in environment variables.');
} else {
  console.log('GEMINI_API_KEY loaded, length:', process.env.GEMINI_API_KEY.length);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key');

// Use sensible defaults for language models
const getModel = (modelName = 'gemini-flash-latest', generationConfig = {}) => {
  return genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.1,
      ...generationConfig
    }
  });
};

module.exports = {
  genAI,
  getModel,
  SchemaType,
  Schema
};
