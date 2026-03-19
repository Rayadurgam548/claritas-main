require('dotenv').config();
const express = require('express');
const routes = require('./src/api/routes');
const errorHandler = require('./src/api/middlewares/errorHandler');
const logger = require('./src/utils/logger');

const app = express();
const cors = require('cors');
app.use(cors());
const PORT = process.env.PORT || 5001;

// Middleware for parsing JSON (for chat and compare endpoints)
app.use(express.json());

// Serve static files (like test-upload.html)
app.use(express.static(__dirname));

// API Routes
app.use('/api', routes);

// Centralized Error Handling Middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  logger.info(`Claritas Backend is running on port ${PORT}`);
});
