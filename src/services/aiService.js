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

const analyzeDocument = async (text, language = 'English') => {
  const model = getModel('gemini-2.5-flash', { responseMimeType: 'application/json', responseSchema: analysisSchema });
  
  return executeWithRetry(async () => {
    const localizationInstruction = `
CRITICAL LOCALIZATION RULES:
1. All descriptive fields (summary, explanation, title, snippet, event, dateOrTrigger, worstCase, penalties, financialLoss, lockIn) MUST be strictly in ${language}.
2. Technical enum values (riskStatus: "Safe", "Review", "Do Not Sign"; severity: "High", "Medium", "Low"; iconType: "Warning", "Money", "Lock"; highlightColor: "red", "yellow", "green") MUST remain in English exactly as specified in the schema.
`;
    const combinedPrompt = `${analysisPrompt}\n${localizationInstruction}\n\n--- DOCUMENT TEXT ---\n${text.substring(0, 1000000)}`; // limit size if necessary
    const result = await model.generateContent(combinedPrompt);
    const responseText = result.response.text();
    return parseJsonResponse(responseText);
  });
};

const compareDocuments = async (text1, text2, language = 'English') => {
  const model = getModel('gemini-2.5-flash', { responseMimeType: 'application/json', responseSchema: compareSchema });

  return executeWithRetry(async () => {
    const localizationInstruction = `CRITICAL: You MUST perform the comparison and provide all text fields (verdict, differences, impact, etc.) strictly in ${language}.`;
    const combinedPrompt = `${comparePrompt}\n${localizationInstruction}\n\n=== DOCUMENT 1 ===\n${text1}\n\n=== DOCUMENT 2 ===\n${text2}`;
    const result = await model.generateContent(combinedPrompt);
    const responseText = result.response.text();
    return parseJsonResponse(responseText);
  });
};

const chatWithDocument = async (documentText, analysisJson, query, language = 'English') => {
  const model = getModel('gemini-2.5-flash', {}); // optimized conversational model

  return executeWithRetry(async () => {
    const context = documentText ? `--- DOCUMENT TEXT ---\n${documentText}\n\n--- PREVIOUS ANALYSIS ---\n${JSON.stringify(analysisJson)}\n` : `General Legal Inquiry (No specific document provided).`;
    
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: chatSystemInstruction + `\n\nCRITICAL: You MUST answer strictly in ${language}. If the user asks in another language, still reply in ${language}.\n\n` + context }],
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
