const mongoose = require('mongoose');

// Define the schema for the Chat model
const ChatSchema = new mongoose.Schema(
  {
    members: {
      type: Array,  // Array of members involved in the chat
    },
  },
  {
    timestamps: true,  // Automatically add createdAt and updatedAt fields
  }
);

// Create the Chat model from the schema
module.exports = mongoose.model("Chat", ChatSchema);
