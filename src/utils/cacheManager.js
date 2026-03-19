/**
 * Ultra-simple in-memory cache for Multi-Agent responses.
 * Reduces Gemini API costs and latency for repeated identical queries.
 */
const crypto = require('crypto');

const memoryCache = new Map();

// Helper to hash complex objects (like documentId + query)
const generateKey = (documentId, agentType, query) => {
  const raw = `${documentId}-${agentType}-${query.trim().toLowerCase()}`;
  return crypto.createHash('sha256').update(raw).digest('hex');
};

const getCache = (documentId, agentType, query) => {
  const key = generateKey(documentId, agentType, query);
  const record = memoryCache.get(key);
  
  if (record) {
    // Check if expired (e.g., 24 hour TTL)
    if (Date.now() > record.expiresAt) {
      memoryCache.delete(key);
      return null;
    }
    return record.value;
  }
  return null;
};

const setCache = (documentId, agentType, query, value, ttlMinutes = 60 * 24) => {
  const key = generateKey(documentId, agentType, query);
  memoryCache.set(key, {
    value,
    expiresAt: Date.now() + ttlMinutes * 60 * 1000,
  });
};

module.exports = {
  getCache,
  setCache,
};
