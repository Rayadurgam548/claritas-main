require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    // There isn't a direct listModels in the SDK for genAI directly usually, 
    // it's sometimes in a different sub-module but let's try to just hit flash-latest.
    console.log("Hitting gemini-1.5-flash-latest...");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const result = await model.generateContent("Hi");
    console.log("Success with gemini-1.5-flash-latest");
  } catch (err) {
    console.error("Error:", err.message);
  }
}

listModels();
