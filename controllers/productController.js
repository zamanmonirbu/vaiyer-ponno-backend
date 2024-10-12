const Category = require("../models/Category");
// const Comment = require("../models/Comment");
const Product = require("../models/Product"); // Import the Product model
const Seller = require("../models/Seller");
const SubCategory = require("../models/SubCategory");

const getAllProducts = async (req, res) => {
  try {
    // Fetch the latest 16 products, sorted by creation date
    const products = await Product.find()
      .sort({ createdAt: -1 }) // Sort by creation date in descending order
      .limit(16) // Limit the results to 16 products
      .populate("seller")
      .populate({
        path: "category",
        populate: {
          path: "subCategories", // Populate the subCategories inside category
          model: "SubCategory", // The model name should be SubCategory or whatever you named it in your schema
        },
      })
      .populate({
        path: "subCategory",
        populate: {
          path: "category", // Populate the category inside subCategory if necessary
          model: "Category", // The model name should be Category or whatever you named it in your schema
        },
      })
      .populate("comment");

    res.status(200).json(products);
  } catch (error) {
    // console.log(error.message);
    res.status(400).json({ message: error.message });
  }
};

// Controller to get a single product by ID
const getProductById = async (req, res) => {
  const { id } = req.params;
  // console.log(id)
  try {
    const product = await Product.findById(req.params.id)
      .populate("seller")
      .populate("category")
      .populate("subCategory")
      .populate("comment");

    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    // console.log(error.message)
    res.status(400).json({ message: error.message });
  }
};

const getSellerProducts = async (req, res) => {
  try {
    const sellerId = req.seller._id; // Assuming the seller ID is available in req.seller
    const products = await Product.find({ seller: sellerId })
      .populate("seller")
      .populate({
        path: "category",
        populate: {
          path: "subCategories", // Assuming you want to populate the 'subCategories' field within 'category'
        },
      })
      .populate({
        path: "subCategory",
        populate: {
          path: "category", // If subCategory has a reference back to the 'category'
        },
      });
    res.json(products);
  } catch (error) {
    // console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

const getMostRatedProductsByCategory = async (req, res) => {
  try {
    const mostRatedProducts = await Product.aggregate([
      {
        $addFields: {
          averageRating: {
            $avg: "$ratings", // Compute the average rating for each product
          },
        },
      },
      {
        $sort: { averageRating: -1 }, // Sort all products by average rating in descending order
      },
      {
        $group: {
          _id: "$category", // Group by category
          mostRatedProduct: { $first: "$$ROOT" }, // Get the top product for each category
        },
      },
      {
        $lookup: {
          from: "categories", // Collection name in MongoDB
          localField: "_id", // Field from the Product collection (category ID)
          foreignField: "_id", // Field from the Category collection (category ID)
          as: "categoryDetails",
        },
      },
      { $unwind: "$categoryDetails" }, // Unwind to get the category details
      {
        $project: {
          _id: 0,
          category: "$categoryDetails.name", // Use the category name from categoryDetails
          product: "$mostRatedProduct", // Include the product details
        },
      },
    ]);

    res.status(200).json(mostRatedProducts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller function to get products with offer > 10 and sorted by offer in descending order
const getProductsWithHighOffer = async (req, res) => {
  try {
    // Find products where offer is greater than 10 and sort them by offer in descending order
    const products = await Product.find({ offer: { $gt: 10 } }).sort({
      offer: -1,
    });

    // If no products are found
    if (!products.length) {
      return res
        .status(404)
        .json({ message: "No products with high offers found." });
    }

    // Return the list of products
    res.status(200).json(products);
  } catch (error) {
    // Handle errors and send a response with status 500
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get products by category
const getProductsByCategory = async (req, res) => {
  const { categoryName } = req.params;

  try {
    // Find the category by name and populate both products and subCategories
    const category = await Category.findOne({ name: categoryName })
      .populate({
        path: "products", // Populating products
        populate: {
          path: "seller", // If you want to populate seller details inside products
        },
      })
      .populate({
        path: "subCategories", // Populating subcategories
        populate: {
          path: "products", // Populating products inside each subcategory
        },
      });

    // console.log("Category found:", category);

    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    // Get products and subcategories
    const products = category.products;
    const subCategories = category.subCategories;

    if (products.length === 0 && subCategories.length === 0) {
      return res.status(404).json({
        message: "No products or subcategories found in this category.",
      });
    }

    // Respond with both products and subcategory details
    res.json({ products, subCategories });
  } catch (error) {
    // console.error("Error fetching category:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

const getSuggestedProducts = async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await Product.findById(productId).populate("subCategory");
    if (!product) return res.status(404).json({ message: "Product not found" });

    const subCategoryId = product.subCategory._id;
    const suggestedProducts = await Product.find({
      subCategory: subCategoryId,
      _id: { $ne: productId },
    }).limit(10); // Limit to 10 products

    res.json(suggestedProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchProducts = async (req, res) => {
  const query = req.query.q; // Get the search query from the request
  try {
    // Split the query into words and create a regex pattern for each word
    const words = query.split(/\s+/).filter((word) => word); // Split by whitespace and filter out empty strings

    // Build the query using $or to match each word in the name or description
    const products = await Product.find({
      $or: words.map((word) => ({
        $or: [
          { name: { $regex: new RegExp(word, "i") } }, // Match any of the words in name
          { description: { $regex: new RegExp(word, "i") } }, // Match any of the words in description
        ],
      })),
    });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

const createProduct = async (req, res) => {
  const {
    name,
    gender,
    imageURL,
    subImages,
    unitPrice,
    description,
    video,
    category,
    subCategory,
    offer,
    area,
    cities,
    sellerLocation,
    quantity,
  } = req.body;
  const sellerId = req.seller._id;

  try {
    const newProduct = new Product({
      name,
      gender,
      seller: sellerId,
      imageURL,
      subImages,
      unitPrice,
      description,
      video,
      category,
      subCategory,
      offer,
      area,
      cities,
      sellerLocation,
      quantity,
    });
    await newProduct.save();

    // Update the seller's products and categories list
    await Seller.findByIdAndUpdate(
      sellerId,
      {
        $push: { products: newProduct._id },
        $addToSet: { category, subCategory },
      },
      { new: true, runValidators: true }
    );

    // Update the category's products and sellers list
    await Category.findByIdAndUpdate(
      category,
      {
        $push: { products: newProduct._id, sellers: sellerId },
        $addToSet: { subCategory },
      },
      { new: true, runValidators: true }
    );

    // Update the sub-category's products list, if applicable
    if (subCategory) {
      await SubCategory.findByIdAndUpdate(
        subCategory,
        {
          $push: { products: newProduct._id },
          $addToSet: { category },
        },
        { new: true, runValidators: true }
      );
    }

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const {
      name,
      gender,
      imageURL,
      subImages,
      unitPrice,
      description,
      video,
      category,
      subCategory,
      offer,
      area,
      cities,
      sellerLocation,
      quantity,
    } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        gender,
        imageURL,
        subImages,
        unitPrice,
        description,
        video,
        category,
        subCategory,
        offer,
        area,
        cities,
        sellerLocation,
        quantity,
      },
      { new: true, runValidators: true }
    )
      .populate("seller")
      .populate("category")
      .populate("subCategory");

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const sellerId = req.body.seller._id;
    await Seller.findByIdAndUpdate(
      sellerId,
      {
        $addToSet: {
          category: updatedProduct.category,
          subCategory: updatedProduct.subCategory,
        },
      },
      { new: true, runValidators: true }
    );

    // Update the category's products and sellers list if the category has changed
    await Category.findByIdAndUpdate(
      updatedProduct.category,
      {
        $addToSet: { sellers: sellerId },
      },
      { new: true, runValidators: true }
    );

    // Update the sub-category's products list if the sub-category has changed
    if (updatedProduct.subCategory) {
      await SubCategory.findByIdAndUpdate(
        updatedProduct.subCategory,
        {
          $addToSet: { category: updatedProduct.category },
        },
        { new: true, runValidators: true }
      );
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

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
  getMostRatedProductsByCategory,
  getSellerProducts,
  getProductsWithHighOffer,
  getProductsByCategory,
  getSuggestedProducts,
  searchProducts,
};
