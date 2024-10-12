const express = require("express");
const {
  getOrdersByUserId,
  getOrdersBySellerId,
} = require("../controllers/orderController");
const router = express.Router();

// Route to get orders by user ID
router.get("/user/:userId", getOrdersByUserId);

// Route to get orders by seller ID
router.get("/seller/:sellerId", getOrdersBySellerId);

module.exports = router;
