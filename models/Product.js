const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  seller: { type: String, required: true },
  imageURL: { type: String, required: true },
  subImages: { type: [String], required: true },
  unitPrice: { type: Number, required: true },
  description: { type: String, required: true },
  video: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  subCategory: { type: String, required: false },  // Use string if subCategory is embedded in Category
  ratings: { type: Number, required: true },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }], // Assuming comments are an array
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
