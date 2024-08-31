const Category = require("../models/Category");
const Comment = require("../models/Comment");
const Product = require("../models/Product"); // Import the Product model
const Seller = require("../models/Seller");
const SubCategory = require("../models/SubCategory");


// Controller to get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("seller")
      .populate("category")
      .populate("subCategory")
      .populate("comments");

    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller to get a single product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("seller")
      .populate("category")
      .populate("subCategory")
      .populate("comments");

    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller to create a new product
const createProduct = async (req, res) => {
  const {
    name,
    imageURL,
    subImages,
    unitPrice,
    description,
    video,
    category,
    subCategory,
    ratings,
    comments,
  } = req.body;
  const sellerId = req.seller._id; // Assuming the seller ID is available in req.seller

  try {
    // Create the new product
    const newProduct = new Product({
      name,
      seller: sellerId, // Link the product to the seller
      imageURL,
      subImages,
      unitPrice,
      description,
      video,
      category,
      subCategory,
      ratings,
      comments,
    });

    // Save the new product
    await newProduct.save();

    // Update the seller's products list
    await Seller.findByIdAndUpdate(
      sellerId,
      { $push: { products: newProduct._id } }, // Add the product ID to the seller's products array
      { new: true, runValidators: true }
    );

    // Update the category's products list
    await Category.findByIdAndUpdate(
      category,
      { $push: { products: newProduct._id } }, // Add the product ID to the category's products array
      { new: true, runValidators: true }
    );

    // Update the sub-category's products list, if applicable
    if (subCategory) {
      await SubCategory.findByIdAndUpdate(
        subCategory,
        { $push: { products: newProduct._id } }, // Add the product ID to the sub-category's products array
        { new: true, runValidators: true }
      );
    }

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller to update a product by ID
// Controller to update a product by ID
const updateProduct = async (req, res) => {
  try {
    // Ensure the seller ID is included in the update
    req.body.seller = req.seller._id;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate("seller")
      .populate("category")
      .populate("subCategory")
      .populate("comments");

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { updateProduct };

// Controller to delete a product by ID
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
