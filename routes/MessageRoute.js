const express = require("express");
const { addMessage, getMessages } = require("../controllers/MessageController.js");

const router = express.Router();

// Define route to add a new message
router.post("/", addMessage);

// Define route to get messages of a specific chat by chatId
router.get("/:chatId", getMessages);

// Export the router for use in other parts of the application
module.exports = router;
