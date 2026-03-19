const pdfParse = require('pdf-parse');
const Tesseract = require('tesseract.js');
const mammoth = require('mammoth');
const fs = require('fs-extra');
const logger = require('../utils/logger');
const redactor = require('../utils/redactor');

const extractText = async (filePath, mimeType, usePrivacySettings = false) => {
  try {
    let rawText = '';

    if (mimeType === 'application/pdf') {
      const dataBuffer = await fs.readFile(filePath);
      const data = await pdfParse(dataBuffer);
      rawText = data.text;
    } else if (mimeType === 'image/jpeg' || mimeType === 'image/png') {
      const result = await Tesseract.recognize(filePath, 'eng');
      rawText = result.data.text;
    } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ path: filePath });
      rawText = result.value;
    } else if (mimeType === 'text/plain') {
      rawText = await fs.readFile(filePath, 'utf8');
    } else {
      throw new Error('Unsupported mimeType for extraction: ' + mimeType);
    }

    // Normalize text: remove extra whitespace and non-printable characters
    let cleanText = rawText
      .replace(/[^\x20-\x7E\n\r\t]/g, '') // remove non-printable
      .replace(/\s+/g, ' ') // collapse whitespaces
      .trim();

    if (!cleanText || cleanText.length < 10) {
      throw new Error('Unable to read document clearly. Try a better image or document.');
    }

    if (usePrivacySettings) {
      cleanText = redactor.redact(cleanText);
    }

    return cleanText;
  } catch (err) {
    logger.error(`Error extracting text from ${filePath}`, err);
    throw err;
  }
};

module.exports = {
  extractText
};
