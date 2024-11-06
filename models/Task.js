const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  time: { type: Date, required: true },
  sellerId: { type: String, required: true },
});

module.exports = mongoose.model("Task", taskSchema);
