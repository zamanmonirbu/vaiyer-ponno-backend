const MessageModel = require("../models/MessageModel.js");

// Add a new message to a chat
const addMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;

  const message = new MessageModel({
    chatId,
    senderId,
    text,
  });

console.log(chatId)
  
try {
    const result = await message.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get all messages for a specific chat
const getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    const result = await MessageModel.find({ chatId });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = { addMessage, getMessages };
