// controllers/orderController.js

const Order = require("../models/Order");
const User = require("../models/User");
// Fetch orders by user ID
const getOrdersByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    //   console.log(userId);

    // Find user by userId
    const user = await User.findById(userId); // No need to use .populate("order") since order is now a string array
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch orders using the order IDs from the user's order array
    const userOrders = await Order.find({ _id: { $in: user.order } }); // Assuming the order's transaction ID is a string
    // console.log(userOrders)
    res.status(200).json(userOrders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user orders", error });
  }
};

// Fetch orders by seller ID
const getOrdersBySellerId = async (req, res) => {
  try {
    const sellerId = req.params.sellerId;
    const sellerOrders = await Order.find({ sellerIds: sellerId });
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
