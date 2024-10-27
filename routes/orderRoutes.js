const express = require("express");
const {
  getOrdersByUserId,
  getOrdersBySellerId,
  getOrderByOrderId
} = require("../controllers/orderController");
const router = express.Router();

// Route to get orders by user ID
router.get("/user/:userId", getOrdersByUserId);

// Route to get orders by seller ID
router.get("/seller/:sellerId", getOrdersBySellerId);

// Route to get order by  order ID
router.get("/success/:orderId", getOrderByOrderId);

module.exports = router;
