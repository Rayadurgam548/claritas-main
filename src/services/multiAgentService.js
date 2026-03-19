const { getModel } = require('../ai/config');
const { reduceContext } = require('../utils/contextReducer');
const cacheManager = require('../utils/cacheManager');
const logger = require('../utils/logger');

const AGENT_PROMPTS = {
  lawyer: `You are an elite Senior Lawyer. 👨‍⚖️
Your SOLE domain is legal risks, contract liabilities, indemnification, breaches, and jurisprudence.
CRITICAL INSTRUCTION: If the user asks a question OUTSIDE of pure legal liability or contract law (e.g., zoning, criminal fraud, or financial rates), you MUST REJECT the query by stating: "That is outside my expertise as your Legal Counsel. Please consult the appropriate specialist."
Answer in short, punchy bullet points. Always assign a 'Risk Level' (Low/Medium/High) at the top.`,

  police: `You are a Police Detective & Criminal Investigator. 🚓
Your SOLE domain is criminal implications, fraud, illegal activities, and penal code violations.
CRITICAL INSTRUCTION: If the user asks about civil contracts, interest rates, or city zoning, you MUST REJECT the query by stating: "This doesn't seem to be a criminal matter. Please direct this to the relevant authority."
Speak with authority. Look for red flags that indicate crime.`,

  municipal: `You are a strict Municipal Code Officer. 🏢
Your SOLE domain is civic compliance, zoning laws, property regulations, building codes, and municipal taxes.
CRITICAL INSTRUCTION: If the user asks about corporate law, criminal fraud, or bank loans, you MUST REJECT the query by stating: "My jurisdiction is strictly local municipal compliance. This query is out of my bounds."
Focus on compliance and permits.`,

  bank: `You are a Senior Bank Manager & Financial Auditor. 💰
Your SOLE domain is financial risks, interest rates, credit implications, loan defaults, and ROI.
CRITICAL INSTRUCTION: If the user asks about criminal charges, city zoning, or purely legal indemnities, you MUST REJECT the query by stating: "As a financial officer, I only evaluate monetary risk and credit details. Please consult another agent."
Focus on money, math, and financial ruin.`,

  core: `You are the Core Analyzer Brain. 🧠
You understand the overall summary and general intent of the document. You can answer general questions but you defer deep specialized analysis to your sub-agents. Keep answers concise.`
};

const chatWithAgent = async (documentId, documentText, analysisJson, agentType, query) => {
  // 1. Check Cache First (Zero API Cost)
  const cachedResponse = cacheManager.getCache(documentId, agentType, query);
  if (cachedResponse) {
    logger.info(`[Multi-Agent] CACHE HIT for ${agentType} on doc ${documentId}`);
    return cachedResponse;
  }

  // 2. Compress Context (Massive Token Savings)
  // Instead of sending 50 pages of documentText, we send the dense RAG-lite summary.
  const compressedContext = reduceContext(analysisJson, documentText);

  // 3. Select Agent Persona
  const systemPrompt = AGENT_PROMPTS[agentType];
  if (!systemPrompt) {
    throw new Error('Invalid agent type');
  }

  // 4. Hit Gemini API
  logger.info(`[Multi-Agent] API CALL for ${agentType} on doc ${documentId}. Context Size: ${compressedContext.length} chars`);
  
  const model = getModel('gemini-2.5-flash-lite', {}); // optimized fast model
  const chat = model.startChat({
    history: [
      {
        role: 'user',
        parts: [{ text: `${systemPrompt}\n\n${compressedContext}` }],
      },
      {
        role: 'model',
        parts: [{ text: `Understood. I am operating strictly as the ${agentType} agent. I will only use the provided context and reject out-of-bounds queries.` }],
      }
    ],
    generationConfig: {
      temperature: 0.1, // extremely low temperature for strict adherence to rules
      maxOutputTokens: 800
    }
  });

  try {
    const result = await chat.sendMessage(query);
    const responseText = result.response.text();
    
    // 5. Save to Cache
    cacheManager.setCache(documentId, agentType, query, responseText);

    return responseText;
  } catch (error) {
    logger.error(`[Multi-Agent] API Error for ${agentType}`, error);
    throw new Error(`Failed to generate response for ${agentType}`);
  }
};

module.exports = {
  chatWithAgent
};
