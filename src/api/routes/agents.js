const express = require('express');
const router = express.Router();
const storageService = require('../../services/storageService');
const multiAgentService = require('../../services/multiAgentService');
const logger = require('../../utils/logger');

// Simple in-memory rate limiter per session/IP
const rateLimits = new Map();

const rateLimiter = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const windowMs = 1000; // 1 second debounce limit
  
  const lastRequest = rateLimits.get(ip);
  if (lastRequest && now - lastRequest < windowMs) {
    return res.status(429).json({ success: false, error: 'Too many requests. Please wait a second.' });
  }
  
  rateLimits.set(ip, now);
  next();
};

router.post('/chat', rateLimiter, async (req, res, next) => {
  try {
    const { documentId, agentType, query } = req.body;
    
    if (!documentId || !agentType || !query) {
      return res.status(400).json({ success: false, error: 'documentId, agentType, and query are required' });
    }

    // 1. Fetch document context
    const text = await storageService.getExtractedText(documentId);
    if (!text) {
      return res.status(404).json({ success: false, error: 'Document not found' });
    }

    // 2. Fetch pre-calculated analysis (risks, summary, clauses)
    const analysisJson = await storageService.getAnalysis(documentId);

    // 3. Delegate to specific agent using MultiAgentService
    const response = await multiAgentService.chatWithAgent(
      documentId,
      text,
      analysisJson,
      agentType,
      query
    );

    res.status(200).json({ success: true, data: { response } });
  } catch (error) {
    logger.error(`[Agents Router] Error chatting with ${req.body.agentType}`, error);
    next(error);
  }
});

module.exports = router;
