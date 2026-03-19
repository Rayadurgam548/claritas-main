const { getModel } = require('../ai/config');
const { analysisPrompt, analysisSchema, comparePrompt, compareSchema, chatSystemInstruction } = require('../ai/prompts');
const logger = require('../utils/logger');

const MAX_RETRIES = 1;

const executeWithRetry = async (fn) => {
  let attempt = 0;
  while (attempt <= MAX_RETRIES) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      logger.warn(`AI request failed on attempt ${attempt}. Error: ${error.message}`, { 
        stack: error.stack,
        status: error.status,
        statusText: error.statusText,
        details: error.details 
      });
      console.error("EXACT AI ERROR:", error);
      if (attempt > MAX_RETRIES) {
        throw new Error('AI analysis failed: ' + error.message);
      }
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, attempt * 1000));
    }
  }
};

const parseJsonResponse = (text) => {
  try {
    // Attempt to strip out ```json and ``` if they are returned despite prompt instructions
    let cleanText = text.trim();
    if (cleanText.startsWith('\`\`\`json')) {
      cleanText = cleanText.substring(7);
    } else if (cleanText.startsWith('\`\`\`')) {
      cleanText = cleanText.substring(3);
    }
    if (cleanText.endsWith('\`\`\`')) {
      cleanText = cleanText.substring(0, cleanText.length - 3);
    }
    return JSON.parse(cleanText.trim());
  } catch (err) {
    logger.error('Failed to parse AI JSON response', { text, err });
    throw new Error('Invalid JSON received from AI');
  }
};

const analyzeDocument = async (text) => {
  const model = getModel('gemini-2.5-flash', { responseMimeType: 'application/json', responseSchema: analysisSchema });
  
  return executeWithRetry(async () => {
    const combinedPrompt = `${analysisPrompt}\n\n--- DOCUMENT TEXT ---\n${text.substring(0, 1000000)}`; // limit size if necessary
    const result = await model.generateContent(combinedPrompt);
    const responseText = result.response.text();
    return parseJsonResponse(responseText);
  });
};

const compareDocuments = async (text1, text2) => {
  const model = getModel('gemini-2.5-flash', { responseMimeType: 'application/json', responseSchema: compareSchema });

  return executeWithRetry(async () => {
    const combinedPrompt = `${comparePrompt}\n\n=== DOCUMENT 1 ===\n${text1}\n\n=== DOCUMENT 2 ===\n${text2}`;
    const result = await model.generateContent(combinedPrompt);
    const responseText = result.response.text();
    return parseJsonResponse(responseText);
  });
};

const chatWithDocument = async (documentText, analysisJson, query) => {
  const model = getModel('gemini-2.5-flash-lite', {}); // optimized conversational model

  return executeWithRetry(async () => {
    const context = `--- DOCUMENT TEXT ---\n${documentText}\n\n--- PREVIOUS ANALYSIS ---\n${JSON.stringify(analysisJson)}\n`;
    
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: chatSystemInstruction + "\n\n" + context }],
        },
        {
          role: 'model',
          parts: [{ text: "Understood. I will answer strictly based on the provided document context." }],
        }
      ],
      generationConfig: {
        temperature: 0.2, // low temp to prevent hallucination
      }
    });

    const result = await chat.sendMessage(query);
    return result.response.text();
  });
};

module.exports = {
  analyzeDocument,
  compareDocuments,
  chatWithDocument
};
