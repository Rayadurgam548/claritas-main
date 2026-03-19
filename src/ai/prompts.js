const { SchemaType } = require('./config');

const analysisPrompt = `You are an elite Senior Legal Counsel and expert Document Analyzer.
Analyze the provided legal document and return ONLY a strict JSON object matching the exact schema.
Do NOT include any markdown formatting like \`\`\`json. Just the raw JSON.
Provide a highly detailed, explainable risk breakdown. 

CRITICAL INSTRUCTIONS FOR HIGH DETAIL:
1. You MUST generate exactly 3 items in the "topRisks" array. Identify the most pressing obligations, terms or hidden risks. Do not leave this empty.
2. You MUST extract at least 5 distinct legal clauses into the "clauses" array. Provide detailed explanations and actionable insights for each.
3. The "simulation" object MUST contain detailed scenarios for financialLoss, penalties, lockIn, and worstCase. Make it comprehensive.
4. Provide a substantial "summary" (at least 3-4 sentences detailing the transaction).

Your analysis MUST be exhaustive, accurate, and easy to understand for non-lawyers. Do NOT hallucinate laws, but extract context deeply.

The JSON MUST conform to this exact structure:
{
  "summary": "string - Executive summary of what the document is and its main purpose",
  "riskStatus": "Safe" | "Review" | "Do Not Sign",
  "topRisks": [
    {
      "title": "string",
      "explanation": "string (1-line)",
      "iconType": "Warning" | "Money" | "Lock",
      "severity": "High" | "Medium" | "Low",
      "confidence": number (0-100)
    }
  ],
  "simulation": {
    "financialLoss": "string - Estimated ₹ loss range or 'None'",
    "penalties": "string - Description of penalties if breached",
    "lockIn": "string - Description of lock-in period. E.g., '12 months lock-in'",
    "worstCase": "string - The worst-case scenario if the user signs"
  },
  "clauses": [
    {
      "snippet": "string - Exact or summarized text of the clause for highlighting",
      "highlightColor": "red" | "yellow" | "green",
      "tags": ["Penalty", "Interest", "Lock-in", "Liability", "Termination", "Hidden Charges"],
      "explanation": "string - Why this is important or risky",
      "legalReference": "string - E.g. Contract Act Section 73",
      "confidenceScore": number (0-100)
    }
  ],
  "timeline": [
    {
      "event": "string",
      "dateOrTrigger": "string"
    }
  ],
  "analytics": {
    "riskDistribution": { "safe": number, "moderate": number, "risky": number },
    "categories": { "penalty": number, "interest": number, "lockIn": number, "liability": number }
  }
}
`;

const analysisSchema = {
  type: SchemaType.OBJECT,
  properties: {
    summary: { type: SchemaType.STRING },
    riskStatus: { type: SchemaType.STRING, enum: ['Safe', 'Review', 'Do Not Sign'] },
    topRisks: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          title: { type: SchemaType.STRING },
          explanation: { type: SchemaType.STRING },
          iconType: { type: SchemaType.STRING, enum: ['Warning', 'Money', 'Lock'] },
          severity: { type: SchemaType.STRING, enum: ['Low', 'Medium', 'High'] },
          confidence: { type: SchemaType.NUMBER }
        },
        required: ['title', 'explanation', 'iconType', 'severity', 'confidence']
      }
    },
    simulation: {
      type: SchemaType.OBJECT,
      properties: {
        financialLoss: { type: SchemaType.STRING },
        penalties: { type: SchemaType.STRING },
        lockIn: { type: SchemaType.STRING },
        worstCase: { type: SchemaType.STRING }
      },
      required: ['financialLoss', 'penalties', 'lockIn', 'worstCase']
    },
    clauses: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          snippet: { type: SchemaType.STRING },
          highlightColor: { type: SchemaType.STRING, enum: ['red', 'yellow', 'green'] },
          tags: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING }
          },
          explanation: { type: SchemaType.STRING },
          legalReference: { type: SchemaType.STRING },
          confidenceScore: { type: SchemaType.NUMBER }
        },
        required: ['snippet', 'highlightColor', 'tags', 'explanation', 'legalReference', 'confidenceScore']
      }
    },
    timeline: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          event: { type: SchemaType.STRING },
          dateOrTrigger: { type: SchemaType.STRING }
        },
        required: ['event', 'dateOrTrigger']
      }
    },
    analytics: {
      type: SchemaType.OBJECT,
      properties: {
        riskDistribution: {
          type: SchemaType.OBJECT,
          properties: { safe: { type: SchemaType.NUMBER }, moderate: { type: SchemaType.NUMBER }, risky: { type: SchemaType.NUMBER } },
          required: ['safe', 'moderate', 'risky']
        },
        categories: {
          type: SchemaType.OBJECT,
          properties: { penalty: { type: SchemaType.NUMBER }, interest: { type: SchemaType.NUMBER }, lockIn: { type: SchemaType.NUMBER }, liability: { type: SchemaType.NUMBER } },
          required: ['penalty', 'interest', 'lockIn', 'liability']
        }
      },
      required: ['riskDistribution', 'categories']
    }
  },
  required: ['summary', 'riskStatus', 'topRisks', 'simulation', 'clauses', 'timeline', 'analytics']
};

const comparePrompt = `You are an M&A / Corporate Lawyer. Compare the two provided legal documents (Document 1 and Document 2).
Return ONLY a strict JSON object matching the exact schema. Do NOT include markdown blocks.
Identify material conflicts, detailed clause changes, and give a verdict on which document is more pro-client (assuming the client's goal is to minimize liability and maximize protection).

The JSON MUST conform to this structure exactly:
{
  "summary": "string - brief overview of differences",
  "conflicts": ["string - description of conflict"],
  "changes": [
    {
      "topic": "string",
      "doc1_stance": "string",
      "doc2_stance": "string"
    }
  ],
  "proClientVerdict": "Document 1" | "Document 2" | "Neutral"
}
`;

const compareSchema = {
  type: SchemaType.OBJECT,
  properties: {
    summary: { type: SchemaType.STRING },
    conflicts: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING }
    },
    changes: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          topic: { type: SchemaType.STRING },
          doc1_stance: { type: SchemaType.STRING },
          doc2_stance: { type: SchemaType.STRING }
        },
        required: ['topic', 'doc1_stance', 'doc2_stance']
      }
    },
    proClientVerdict: { type: SchemaType.STRING, enum: ['Document 1', 'Document 2', 'Neutral'] }
  },
  required: ['summary', 'conflicts', 'changes', 'proClientVerdict']
};

const chatSystemInstruction = `You are a helpful Legal Assistant specifically tasked with answering questions about the provided document.
Your knowledge is STRICTLY limited to the context provided.
If the answer is not in the document context, you MUST say "I cannot answer that based on the provided document."
Do not hallucinate facts. Do not provide general legal advice outside of the snippet.
CRITICAL: You must answer in very simple, plain language. Do NOT use complex legal jargon. Explain your answers as if you are talking to a smart 10-year-old or an average person with no legal training. Limit your answers to 2-3 concise paragraphs at most.`;

module.exports = {
  analysisPrompt,
  analysisSchema,
  comparePrompt,
  compareSchema,
  chatSystemInstruction
};
