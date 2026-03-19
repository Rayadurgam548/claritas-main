const { v4: uuidv4 } = require('uuid');
const path = require('path');
const storageService = require('../services/storageService');
const extractionService = require('../services/extractionService');
const logger = require('../utils/logger');

const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded or invalid file format' });
    }

    const fileId = uuidv4();
    const originalName = req.file.originalname;
    const mimeType = req.file.mimetype;
    const privacyMode = req.body.privacyMode === 'true';

    // 1. Save raw file and get path
    const rawFilePath = await storageService.saveRawFile(fileId, originalName, req.file.buffer);

    // 2. Extract and clean text
    const cleanText = await extractionService.extractText(rawFilePath, mimeType, privacyMode);

    // 3. Save extracted text
    await storageService.saveExtractedText(fileId, cleanText);

    // 4. Update index.json
    const entry = {
      id: fileId,
      filename: originalName,
      status: 'uploaded',
      privacyMode
    };
    await storageService.updateIndex(entry);

    res.status(201).json({
      success: true,
      data: entry
    });
  } catch (error) {
    next(error);
  }
};

const getDocuments = async (req, res, next) => {
  try {
    const index = await storageService.getIndex();
    res.status(200).json({ success: true, count: index.length, data: index });
  } catch (error) {
    next(error);
  }
};

const deleteDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await storageService.deleteDocument(id);
    
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Document not found' });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

const viewDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    const docInfo = await storageService.getDocumentInfo(id);
    if (!docInfo) {
      return res.status(404).json({ success: false, error: 'Document not found' });
    }

    const { rawFilePath } = await storageService.getFilePaths(id, docInfo.filename);
    
    if (!require('fs-extra').existsSync(rawFilePath)) {
       return res.status(404).json({ success: false, error: 'File on disk not found' });
    }
    res.sendFile(rawFilePath);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadDocument,
  getDocuments,
  deleteDocument,
  viewDocument
};
