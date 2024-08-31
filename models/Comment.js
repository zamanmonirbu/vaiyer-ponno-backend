const mongoose = require('mongoose');

// Define the Comment schema
const commentSchema = new mongoose.Schema({
    text: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    createdAt: { type: Date, default: Date.now }
});

// Use mongoose.models to avoid overwriting the model
const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema);

module.exports = Comment;
