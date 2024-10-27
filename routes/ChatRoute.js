const express = require("express");
const { createChat, findChat, userChats } = require("../controllers/ChatController.js");

const router = express.Router();

// Define route to create a new chat
router.post("/", createChat);

// Define route to get chats of a specific user by userId
router.get("/:userId", userChats);

// Define route to find a chat between two users by their IDs
router.get("/find/:firstId/:secondId", findChat);

// Export the router to be used in other parts of the application
module.exports = router;
