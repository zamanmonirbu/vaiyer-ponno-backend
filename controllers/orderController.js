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



// Fetch orders by seller ID with specific null status fields
const getOrdersBySellerId = async (req, res) => {
  try {
    const sellerId = req.params.sellerId;
    
    // Find orders by sellerId with the specified fields as null
    const sellerOrders = await Order.find({
      sellerIds: sellerId,
      courierToDeliveryManAt: null,
      orderCompletedAt: null,
      sellerAcceptedAt: null,
      sellerRejectedAt: null,
      sentToCourierAt: null,
    }).sort({ createdAt: -1 }); // Sort by createdAt, or adjust based on your needs

    if (sellerOrders.length === 0) {
      return res
        .status(404)
        .json({ message: "No matching orders found for this seller" });
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


// Find orders with any specified status set to true
const findOrdersByStatus = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [
        { sellerAccepted: true },
        { sentToCourier: true },
        { courierToDeliveryMan: true },
        { orderCompleted: true },
        { sellerRejected: true },
      ],
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders by status", error });
  }
};



// Create a new order
const createOrder = async (req, res) => {
  try {
    const newOrder = await Order.create(req.body);
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ error: "Error creating order", details: error.message });
  }
};

// Update an existing order
const updateOrder = async (req, res) => {
  const { orderId } = req.params;
  const updateData = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, { new: true });
    if (!updatedOrder) {
      // console.log("Working not")
      return res.status(404).json({ error: "Order not found" });
    }
    // console.log("Working")

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(400).json({ error: "Error updating order", details: error.message });
  }
};

// Delete an existing order
const deleteOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const deletedOrder = await Order.findByIdAndDelete(orderId);
    if (!deletedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json({ message: "Order deleted successfully", orderId });
  } catch (error) {
    res.status(400).json({ error: "Error deleting order", details: error.message });
  }
};

// Get an order by ID
const getOrderById = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ error: "Error retrieving order", details: error.message });
  }
};

// Get all orders (with optional filters)
const getAllOrders = async (req, res) => {
  const filters = req.query;

  try {
    const orders = await Order.find(filters);
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json({ error: "Error fetching orders", details: error.message });
  }
};



// Mark order as accepted by seller
const markOrderAsAccepted = async (req, res) => {
  try {
    const { orderId } = req.params;
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { sellerAcceptedAt: new Date() },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Failed to mark order as accepted", error });
  }
};

// Mark order as sent to courier
const markOrderAsSentToCourier = async (req, res) => {
  try {
    const { orderId } = req.params;
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { sentToCourierAt: new Date() },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Failed to mark order as sent to courier", error });
  }
};

// Mark order as handed to delivery man
const markOrderAsHandedToDeliveryMan = async (req, res) => {
  try {
    const { orderId } = req.params;
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { courierToDeliveryManAt: new Date() },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Failed to mark order as handed to delivery man", error });
  }
};

// Mark order as completed
const markOrderAsCompleted = async (req, res) => {
  try {
    const { orderId } = req.params;
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { orderCompletedAt: new Date() },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Failed to mark order as completed", error });
  }
};

// Mark order as rejected by seller
const markOrderAsRejected = async (req, res) => {
  try {
    const { orderId } = req.params;
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { sellerRejectedAt: new Date() },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Failed to mark order as rejected", error });
  }
};



// Fetch orders where 'sellerAccepted' is true and sellerId is in the sellerIds array
const getOrdersBySellerAccepted = async (req, res) => {
  const {sellerId} = req.params;
  try {
    const orders = await Order.find({
      sellerAccepted: true,
      sellerIds: { $in: [sellerId] } // Check if sellerId is in the sellerIds array
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to get orders marked as accepted by seller", error });
  }
};

// Fetch orders where 'sentToCourier' is true
const getOrdersBySentToCourier = async (req, res) => {
  const { sellerId } = req.params;
  try {
    const orders = await Order.find({
      sentToCourier: true,
      sellerIds: { $in: [sellerId] } // Check if sellerId is in the sellerIds array
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to get orders marked as sent to courier", error });
  }
};

// Fetch orders where 'courierToDeliveryMan' is true
const getOrdersByHandedToDeliveryMan = async (req, res) => {
  const { sellerId } = req.params;
  try {
    const orders = await Order.find({
      courierToDeliveryMan: true,
      sellerIds: { $in: [sellerId] } // Check if sellerId is in the sellerIds array
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to get orders marked as handed to delivery man", error });
  }
};

// Fetch orders where 'orderCompleted' is true
const getOrdersByCompleted = async (req, res) => {
  const { sellerId } = req.params;
  try {
    const orders = await Order.find({
      orderCompleted: true,
      sellerIds: { $in: [sellerId] } // Check if sellerId is in the sellerIds array
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to get orders marked as completed", error });
  }
};

// Fetch orders where 'sellerRejected' is true
const getOrdersBySellerRejected = async (req, res) => {
  const { sellerId } = req.params;
  try {
    const orders = await Order.find({
      sellerRejected: true,
      sellerIds: { $in: [sellerId] } // Check if sellerId is in the sellerIds array
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to get orders marked as rejected by seller", error });
  }
};



module.exports = {
  getOrdersByUserId,
  getOrdersBySellerId,
  getOrderByOrderId,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrderById,
  getAllOrders,
  markOrderAsAccepted,
  markOrderAsSentToCourier,
  markOrderAsHandedToDeliveryMan,
  markOrderAsCompleted,
  markOrderAsRejected,
  getOrdersBySellerRejected,
  getOrdersByCompleted,
  getOrdersByHandedToDeliveryMan,
  getOrdersBySentToCourier,
  getOrdersBySellerAccepted,
  findOrdersByStatus,
};
