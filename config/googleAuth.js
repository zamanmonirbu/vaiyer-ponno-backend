// config/googleAuth.js
const { google } = require('googleapis');
require('dotenv').config();

// Create an OAuth2 client with the given credentials
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// Optional: Set credentials if you already have them (e.g., after the user has authenticated)
const setCredentials = (tokens) => {
  oauth2Client.setCredentials(tokens);
};

module.exports = {
  oauth2Client,
  setCredentials,
};
