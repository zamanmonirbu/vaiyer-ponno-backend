// models/Category.js
const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
  name: String,
  subSubCategories: [String],
});

const categorySchema = new mongoose.Schema({
  category: { type: String, required: true },
  subCategories: [subCategorySchema],
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
