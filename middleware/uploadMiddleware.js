const multer = require("multer");

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Stores file in memory as buffer
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // Set max file size (e.g., 100MB)
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type; only video uploads allowed."), false);
    }
  },
});

module.exports = upload;
