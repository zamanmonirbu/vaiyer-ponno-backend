const Comment = require("../models/Comment");
const Product = require("../models/Product");
// const User = require("../models/User");

const createComment = async (req, res) => {
  const { text, productId, rating } = req.body;
  const userId = req.user._id;

  try {
    // Create a new comment
    const newComment = new Comment({
      text,
      rating,
      author: userId,
      product: productId,
    });

    // Save the new comment
    await newComment.save();

    // Add the comment ID to the product's comments array
    const product = await Product.findByIdAndUpdate(
      productId,
      { $push: { comment: newComment._id } },
      { new: true, runValidators: true }
    );

    // Calculate the new average rating
    const comments = await Comment.find({ product: productId });
    const totalRatings = comments.reduce(
      (acc, comment) => acc + comment.rating,
      0
    );
    const averageRating = totalRatings / comments.length;
    console.log(averageRating);

    console.log("Rattings",product);
    // Update the product's rating field with the new average rating
    product.rating = averageRating;
    const ratingUpdate = await product.save();
    if (ratingUpdate) {
      console.log(ratingUpdate);
    } else {
      console.log("error");
    }
    res.status(201).json(newComment);
  } catch (error) {
    res.status(400).json(error);
  }
};

// Controller to get all comments for a product
const getCommentsByProduct = async (req, res) => {
  try {
    const comments = await Comment.find({ product: req.params.productId })
      .populate("author", "name") // Populate the author's name or other details
      .sort({ createdAt: -1 }); // Sort by most recent

    res.status(200).json(comments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller to update a comment by ID
const updateComment = async (req, res) => {
  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      { text: req.body.text },
      { new: true, runValidators: true }
    ).populate("author", "name");

    if (!updatedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller to delete a comment by ID
const deleteComment = async (req, res) => {
  try {
    const deletedComment = await Comment.findByIdAndDelete(req.params.id);
    if (!deletedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Optionally, remove the comment ID from the product's comments array
    await Product.findByIdAndUpdate(
      deletedComment.product,
      { $pull: { comments: deletedComment._id } },
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createComment,
  getCommentsByProduct,
  updateComment,
  deleteComment,
};
