const logger = require('../../utils/logger');

const authenticate = (req, res, next) => {
  // Extract token from header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'No token provided, authorization denied' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Our custom token format: [base64Payload].[randomHex]
    const payloadStr = Buffer.from(token.split('.')[0], 'base64').toString('ascii');
    const decoded = JSON.parse(payloadStr);

    if (Date.now() > decoded.exp) {
      return res.status(401).json({ success: false, error: 'Token has expired' });
    }

    req.user = { id: decoded.id };
    next();
  } catch (error) {
    logger.warn(`Auth middleware failed: ${error.message}`);
    return res.status(401).json({ success: false, error: 'Token is not valid' });
  }
};

module.exports = authenticate;
