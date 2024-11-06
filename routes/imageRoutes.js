// imageRoutes.js
const express = require("express");
const router = express.Router();
const { uploadImage, getImage } = require("../controllers/imageController");

router.post("/upload", uploadImage);
router.get("/view/:imageId", getImage);

module.exports = router;
