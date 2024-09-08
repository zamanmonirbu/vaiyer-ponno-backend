  const express = require("express");
  const {
    createComment,
    getCommentsByProduct,
    updateComment,
    deleteComment,
  } = require("../controllers/commentController");
const { userAuth } = require("../middleware/authMiddleware");

  const router = express.Router();

  // Route to create a new comment
  router.post("/comments",userAuth, createComment);

  // Route to get all comments for a product
  router.get("/comments/product/:productId", getCommentsByProduct);

  // Route to update a comment by ID
  router.put("/comments/:id", updateComment);

  // Route to delete a comment by ID
  router.delete("/comments/:id", deleteComment);

  module.exports = router;
