'use strict';

const multer = require('multer');
const path = require('path');
const { AppError } = require('./errorHandler');

// Setup storage engine
const storage = multer.memoryStorage();

// Multer upload options
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new AppError('Only images are allowed', 400));
  },
});

module.exports = upload;
