const mongoose = require('mongoose');

// Define the schema for the Message model
const MessageSchema = new mongoose.Schema(
  {
    chatId: {
      type: String,  // ID of the chat to which the message belongs
    },
    senderId: {
      type: String,  // ID of the user who sent the message
    },
    text: {
      type: String,  // Content of the message
    },
  },
  {
    timestamps: true,  // Automatically add createdAt and updatedAt fields
  }
);

// Create and export the Message model from the schema
module.exports = mongoose.model("Message", MessageSchema);
