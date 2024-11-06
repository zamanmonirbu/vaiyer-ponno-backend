// controllers/orderController.js

const Order = require("../models/Order");
const User = require("../models/User");
// Fetch orders by user ID
// Fetch orders by user ID
const getOrdersByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch orders using the order IDs from the user's order array, sorted by creation date (descending)
    const userOrders = await Order.find({ _id: { $in: user.order } })
      .sort({ createdAt: -1 }); // Change 'createdAt' to the appropriate field for sorting
    res.status(200).json(userOrders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user orders", error });
  }
};

// Fetch orders by seller ID
const getOrdersBySellerId = async (req, res) => {
  try {
    const sellerId = req.params.sellerId;
    const sellerOrders = await Order.find({ sellerIds: sellerId })
      .sort({ createdAt: -1 }); // Change 'createdAt' to the appropriate field for sorting
    if (sellerOrders.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for this seller" });
    }
    res.status(200).json(sellerOrders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch seller orders", error });
  }
};

// Fetch orders by seller ID
const getOrderByOrderId = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    const orderDetails = await Order.findOne({ tran_id: orderId });
    if (orderDetails.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for this seller" });
    }
    res.status(200).json(orderDetails);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch seller orders", error });
  }
};

module.exports = {
  getOrdersByUserId,
  getOrdersBySellerId,
  getOrderByOrderId,
};
