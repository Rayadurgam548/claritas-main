const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

const storageDir = path.resolve(__dirname, '../../../storage/uploads');

// Ensure upload dir exists
if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir, { recursive: true });
}

// Memory storage for inspection before saving to disk
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error('Invalid file type. Only PDF, DOCX, TXT, JPG, and PNG are allowed.'), false);
  }

  // Validate extension
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.docx', '.txt'];

  if (!allowedExtensions.includes(ext)) {
    return cb(new Error('Invalid file extension.'), false);
  }

  // We rely on mimetype and the final extension validation above
  cb(null, true);
};

const limits = {
  fileSize: 5 * 1024 * 1024, // 5MB
};

const upload = multer({
  storage,
  fileFilter,
  limits
});

module.exports = { upload };
