const ChatModel = require("../models/ChatModel.js");

const createChat = async (req, res) => {
  const { senderId, receiverId } = req.body;

  try {
    // Check if a chat already exists between the two members
    const existingChat = await ChatModel.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (existingChat) {
      // If chat already exists, return the existing chat
      return res.status(200).json(existingChat);
    }

    // Create a new chat if no existing chat is found
    const newChat = new ChatModel({
      members: [senderId, receiverId],
    });

    const result = await newChat.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error creating chat', error });
  }
};

// Get all chats for a specific user
const userChats = async (req, res) => {
  try {
    const chat = await ChatModel.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Find a chat between two users
const findChat = async (req, res) => {
  try {
    const chat = await ChatModel.findOne({
      members: { $all: [req.params.firstId, req.params.secondId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = { createChat, userChats, findChat };
