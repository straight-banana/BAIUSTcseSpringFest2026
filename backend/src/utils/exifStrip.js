'use strict';

const fs = require('fs').promises;
const path = require('path');

async function stripExifAndSave(file) {
  // Mock function. Real implementation would use sharp or exifr to strip EXIF data.
  // For this hackathon, we simply save the file to a public/uploads directory.
  
  const uploadDir = path.join(__dirname, '../../uploads');
  await fs.mkdir(uploadDir, { recursive: true });

  const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
  const filePath = path.join(uploadDir, filename);

  await fs.writeFile(filePath, file.buffer);

  return `/uploads/${filename}`;
}

module.exports = { stripExifAndSave };
