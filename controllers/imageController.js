// imageController.js
const axios = require("axios");

const API_KEY = "13c60fa1ef34d09a7e455348d706165b";

// Upload image to imgbb
exports.uploadImage = async (req, res) => {
  try {
    const { image } = req.body;
    const formData = new URLSearchParams();
    formData.append("key", API_KEY);
    formData.append("image", image);

    const response = await axios.post("https://api.imgbb.com/1/upload", formData.toString(), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    res.status(200).json({ url: response.data.data.url });
  } catch (error) {
    console.error("Image upload failed:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
};

// Get image details
exports.getImage = async (req, res) => {
  const { imageId } = req.params;
  try {
    const response = await axios.get(`https://api.imgbb.com/1/upload/${imageId}?key=${API_KEY}`);
    res.status(200).json(response.data.data);
  } catch (error) {
    console.error("Failed to fetch image:", error);
    res.status(500).json({ error: "Failed to fetch image" });
  }
};
