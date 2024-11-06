const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
require("dotenv").config();

// Set up OAuth2 client
const oauth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// Refresh token setup (needed for uploading without re-auth)
oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

const youtube = google.youtube({
  version: "v3",
  auth: oauth2Client,
});

// Video upload function
exports.uploadVideo = async (req, res) => {
  try {
    const { title, description, tags, categoryId } = req.body;
    const videoFile = req.file; // Assuming you use multer for file upload handling

    if (!videoFile) {
      return res.status(400).json({ error: "No video file provided" });
    }

    const response = await youtube.videos.insert({
      part: "snippet,status",
      requestBody: {
        snippet: {
          title: title || "Default Title",
          description: description || "Default Description",
          tags: tags || [],
          categoryId: categoryId || "22", // Default to "People & Blogs" category
        },
        status: {
          privacyStatus: "public", // You can set to "private" or "unlisted"
        },
      },
      media: {
        body: videoFile.buffer, // Use file buffer if using multer's memory storage
      },
    });

    res.status(200).json({
      message: "Video uploaded successfully!",
      videoId: response.data.id,
    });
  } catch (error) {
    console.error("Video upload error:", error);
    res.status(500).json({ error: "Video upload failed." });
  }
};
