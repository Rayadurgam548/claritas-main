const express = require('express');
const { analyzeDocument, compareDocuments, chatDocumentation } = require('../../controllers/aiController');

const router = express.Router();

router.post('/analyze/:id', analyzeDocument);
router.post('/compare', compareDocuments);
router.post('/chat', chatDocumentation);

module.exports = router;
