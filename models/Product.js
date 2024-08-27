const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageURL: { type: String, required: true },
  subImages: { type: [String], required: true },
  unitPrice: { type: Number, required: true },
  description: { type: String, required: true },
  video: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  subCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' },
  subSubCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'SubSubCategory' },
  ratings: { type: Number, required: true },
  comments: { type: [String], required: true }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
