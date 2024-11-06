const express = require("express");
const multer = require("multer"); // For handling file uploads
const {  uploadVideo } = require("../controllers/videoController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Use memory storage for video files



// Route to upload video
router.post("/upload", upload.single("video"), uploadVideo); 

module.exports = router;
