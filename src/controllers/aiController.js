const aiService = require('../services/aiService');
const storageService = require('../services/storageService');
const logger = require('../utils/logger');

const analyzeDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const docInfo = await storageService.getDocumentInfo(id);
    if (!docInfo) {
      return res.status(404).json({ success: false, error: 'Document not found' });
    }

    const text = await storageService.getExtractedText(id);
    if (!text) {
      return res.status(500).json({ success: false, error: 'Document text not found' });
    }

    // Call AI Service
    const analysisJson = await aiService.analyzeDocument(text);

    // Save Analysis result
    await storageService.saveAnalysis(id, analysisJson);

    // Update status in index
    await storageService.updateIndex({ ...docInfo, status: 'analyzed' });

    res.status(200).json({ success: true, data: analysisJson });
  } catch (error) {
    next(error);
  }
};

const compareDocuments = async (req, res, next) => {
  try {
    const { docId1, docId2 } = req.body;
    if (!docId1 || !docId2) {
      return res.status(400).json({ success: false, error: 'docId1 and docId2 are required' });
    }

    const text1 = await storageService.getExtractedText(docId1);
    const text2 = await storageService.getExtractedText(docId2);

    if (!text1 || !text2) {
      return res.status(404).json({ success: false, error: 'One or both documents not found' });
    }

    const comparisonJson = await aiService.compareDocuments(text1, text2);

    res.status(200).json({ success: true, data: comparisonJson });
  } catch (error) {
    next(error);
  }
};

const chatDocumentation = async (req, res, next) => {
  try {
    const { documentId, query } = req.body;
    
    if (!query) {
      return res.status(400).json({ success: false, error: 'query is required' });
    }

    let text = '';
    let analysisJson = {};

    if (documentId) {
      text = await storageService.getExtractedText(documentId);
      analysisJson = await storageService.getAnalysis(documentId) || {};

      if (!text) {
        return res.status(404).json({ success: false, error: 'Document not found' });
      }
    }

    const response = await aiService.chatWithDocument(text, analysisJson, query);

    res.status(200).json({ success: true, data: { response } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  analyzeDocument,
  compareDocuments,
  chatDocumentation
};
