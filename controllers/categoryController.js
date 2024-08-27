// controllers/categoryController.js
const Category = require('../models/categoryModel');

exports.createCategory = async (req, res) => {
  try {
    const { category, subCategories } = req.body;
    const newCategory = new Category({ category, subCategories });
    await newCategory.save();
    res.status(201).json({ message: 'Category created successfully', newCategory });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create category', error });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch categories', error });
  }
};
