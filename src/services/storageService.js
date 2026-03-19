const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');
const logger = require('../utils/logger');

const STORAGE_ROOT = path.resolve(__dirname, '../../storage');
const UPLOADS_DIR = path.join(STORAGE_ROOT, 'uploads');
const DATA_DIR = path.join(STORAGE_ROOT, 'data');
const INDEX_JSON_PATH = path.join(DATA_DIR, 'index.json');

// Ensure directories exist
fs.ensureDirSync(UPLOADS_DIR);
fs.ensureDirSync(DATA_DIR);
if (!fs.existsSync(INDEX_JSON_PATH)) {
  fs.writeJsonSync(INDEX_JSON_PATH, []);
}

const writeToTempAndRename = async (filePath, data) => {
  const tempPath = `${filePath}.tmp.${crypto.randomBytes(6).toString('hex')}`;
  if (Buffer.isBuffer(data)) {
    await fs.writeFile(tempPath, data);
  } else if (typeof data === 'string') {
    await fs.writeFile(tempPath, data, 'utf8');
  } else {
    await fs.writeJson(tempPath, data, { spaces: 2 });
  }
  await fs.rename(tempPath, filePath);
};

const saveRawFile = async (fileId, originalName, fileBuffer) => {
  const ext = path.extname(originalName).toLowerCase();
  const rawFilePath = path.join(UPLOADS_DIR, `${fileId}${ext}`);
  await writeToTempAndRename(rawFilePath, fileBuffer);
  return rawFilePath;
};

const saveExtractedText = async (fileId, text) => {
  const textFilePath = path.join(DATA_DIR, `${fileId}.txt`);
  await writeToTempAndRename(textFilePath, text);
  return textFilePath;
};

const saveAnalysis = async (fileId, analysisJson) => {
  const analysisPath = path.join(DATA_DIR, `${fileId}.json`);
  await writeToTempAndRename(analysisPath, analysisJson);
  return analysisPath;
};

const getIndex = async () => {
  try {
    return await fs.readJson(INDEX_JSON_PATH);
  } catch (err) {
    logger.error('Error reading index JSON', err);
    return [];
  }
};

const updateIndex = async (entry) => {
  // Concurrent writes could overlap without proper locks, but given constraints atomic rename helps.
  const index = await getIndex();
  const existingIndex = index.findIndex(e => e.id === entry.id);
  if (existingIndex >= 0) {
    index[existingIndex] = { ...index[existingIndex], ...entry, updatedAt: new Date().toISOString() };
  } else {
    index.push({ ...entry, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  }
  await writeToTempAndRename(INDEX_JSON_PATH, index);
};

const getDocumentInfo = async (fileId) => {
  const index = await getIndex();
  return index.find(e => e.id === fileId);
};

const getExtractedText = async (fileId) => {
  const textFilePath = path.join(DATA_DIR, `${fileId}.txt`);
  if (!fs.existsSync(textFilePath)) return null;
  return fs.readFile(textFilePath, 'utf8');
};

const getAnalysis = async (fileId) => {
  const analysisPath = path.join(DATA_DIR, `${fileId}.json`);
  if (!fs.existsSync(analysisPath)) return null;
  return fs.readJson(analysisPath);
};

const deleteDocument = async (fileId) => {
  const index = await getIndex();
  const docInfo = index.find(e => e.id === fileId);
  if (!docInfo) return false;

  const ext = path.extname(docInfo.filename).toLowerCase();
  const rawFilePath = path.join(UPLOADS_DIR, `${fileId}${ext}`);
  const textFilePath = path.join(DATA_DIR, `${fileId}.txt`);
  const analysisPath = path.join(DATA_DIR, `${fileId}.json`);

  await fs.remove(rawFilePath);
  await fs.remove(textFilePath);
  await fs.remove(analysisPath);

  const newIndex = index.filter(e => e.id !== fileId);
  await writeToTempAndRename(INDEX_JSON_PATH, newIndex);
  return true;
};

const getFilePaths = async (fileId, originalName) => {
  const ext = path.extname(originalName).toLowerCase();
  const rawFilePath = path.join(UPLOADS_DIR, `${fileId}${ext}`);
  const textFilePath = path.join(DATA_DIR, `${fileId}.txt`);
  const analysisPath = path.join(DATA_DIR, `${fileId}.json`);
  return { rawFilePath, textFilePath, analysisPath };
};

module.exports = {
  saveRawFile,
  saveExtractedText,
  saveAnalysis,
  getIndex,
  updateIndex,
  getDocumentInfo,
  getExtractedText,
  getAnalysis,
  deleteDocument,
  getFilePaths
};
