const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const categorySchema = new mongoose.Schema({
  category: { type: String, required: true },
  subCategories: [subCategorySchema],  // Updated to store an array of subcategory objects
  categoryImage: { type: String, required: true },
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
