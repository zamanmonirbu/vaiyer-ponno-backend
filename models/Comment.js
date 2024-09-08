const mongoose = require('mongoose');

// Define the Comment schema
const commentSchema = new mongoose.Schema({
    text: { type: String, required: true },
    rating:{type:Number},
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
},
{ timestamps: true });

// Use mongoose.models to avoid overwriting the model
const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema);

module.exports = Comment;
