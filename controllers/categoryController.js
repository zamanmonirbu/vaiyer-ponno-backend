const Category = require("../models/Category");
const SubCategory = require('../models/SubCategory');


// Create a category with sub-categories
exports.createCategory = async (req, res) => {
    const session = await Category.startSession();
    session.startTransaction();
    try {
        const {categoryImage, name, subCategories } = req.body;

        // Create sub-categories
        const subCategoryDocs = await SubCategory.insertMany(subCategories, { session });

        // Create category with reference to sub-categories
        const newCategory = new Category({
            categoryImage,
            name,
            subCategories: subCategoryDocs.map(subCategory => subCategory._id)
        });
        await newCategory.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json(newCategory);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(400).json({ message: error.message });
    }
};


// Get all categories with populated subCategories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate('subCategories');
    res.status(200).json({ data: categories });
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving categories', error });
  }
};

// Get a single category by ID with populated subCategories
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate('subCategories');
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ data: category });
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving category', error });
  }
};

// Update a category
exports.updateCategory = async (req, res) => {
  try {
    const { name, categoryImage, subCategories } = req.body;
    // console.log("Body data",req.body)
    // Validate image URL
    const validImageURL = categoryImage || 'https://cdn-icons-png.flaticon.com/128/10951/10951869.png';

    // Update subCategories if needed
    const updatedSubCategories = [];
    if (subCategories && subCategories.length > 0) {
      for (const subCat of subCategories) {
        let subCategory = await SubCategory.findById(subCat._id);
        if (subCategory) {
          // Update existing subCategory
          subCategory.name = subCat.name;
          await subCategory.save();
        } else {
          // Create new subCategory if not exists
          const newSubCategory = new SubCategory({ name: subCat.name });
          await newSubCategory.save();
          updatedSubCategories.push(newSubCategory._id);
        }
      }
    }

    // Update category
    const categoryToUpdate = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name,
        categoryImage: validImageURL,
        subCategories: updatedSubCategories,
      },
      { new: true }
    );

    if (!categoryToUpdate) {
      return res.status(404).json({ message: 'Category not found' });
    }
    // console.log('Category updated successfully!', categoryToUpdate)
    res.status(200).json({ message: 'Category updated successfully!', data: categoryToUpdate });
  } catch (error) {
    // console.log("error",error)
    res.status(400).json({ message: 'Error updating category', error });
  }
};

// Delete a category and remove its subCategories
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate('subCategories');
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Delete associated subCategories
    await SubCategory.deleteMany({ _id: { $in: category.subCategories } });

    // Delete category
    await Category.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Category deleted successfully!' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting category', error });
  }
};
