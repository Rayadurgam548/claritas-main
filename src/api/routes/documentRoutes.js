const express = require('express');
const { upload } = require('../middlewares/fileValidator');
const { uploadDocument, getDocuments, deleteDocument, viewDocument } = require('../../controllers/documentController');

const router = express.Router();

router.post('/upload', upload.single('document'), uploadDocument);
router.get('/documents', getDocuments);
router.delete('/documents/:id', deleteDocument);
router.get('/documents/:id/file', viewDocument);

module.exports = router;
