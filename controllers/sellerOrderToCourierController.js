const SellerOrderToCourier = require("../models/sellerOrderToCourierSchema");

// Create a new SellerOrderToCourier entry
const createSellerOrderToCourier = async (req, res) => {
  try {
    const { orderId, courierId, isAccept, isReject } = req.body;

    const newEntry = new SellerOrderToCourier({
      orderId,
      courierId,
      isAccept,
      isReject,
    });

    const savedEntry = await newEntry.save();
    res
      .status(201)
      .json({ message: "Entry created successfully", data: savedEntry });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create entry", error: error.message });
  }
};

// Get all SellerOrderToCourier entries
const getAllSellerOrdersToCourier = async (req, res) => {
  try {
    // Proper query to match both `isAccept` and `isReject` as false
    const entries = await SellerOrderToCourier.find({
      isAccept: false,
      isReject: false,
    }).populate("orderId courierId");

    res.status(200).json({ data: entries });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch entries", error: error.message });
  }
};

// Get a single SellerOrderToCourier entry by ID
const getSellerOrderToCourierById = async (req, res) => {
  try {
    const entry = await SellerOrderToCourier.findById(req.params.id).populate(
      "orderId courierId"
    );

    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    res.status(200).json({ data: entry });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch entry", error: error.message });
  }
};

// Update a SellerOrderToCourier entry
const updateSellerOrderToCourier = async (req, res) => {
  try {
    const { actionType } = req.body;

    // Determine which field to update based on actionType
    let updateFields = {};
    if (actionType === "accept") {
      updateFields = { isAccept: true, isReject: false };
    } else if (actionType === "reject") {
      updateFields = { isAccept: false, isReject: true };
    } else {
      return res.status(400).json({ message: "Invalid actionType" });
    }

    // Update the document in the database
    const updatedEntry = await SellerOrderToCourier.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true } // Return the updated document
    );

    if (!updatedEntry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    res
      .status(200)
      .json({ message: "Entry updated successfully", data: updatedEntry });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update entry", error: error.message });
  }
};

// Delete a SellerOrderToCourier entry
const deleteSellerOrderToCourier = async (req, res) => {
  try {
    const deletedEntry = await SellerOrderToCourier.findByIdAndDelete(
      req.params.id
    );

    if (!deletedEntry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    res.status(200).json({ message: "Entry deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete entry", error: error.message });
  }
};

// Accept an order
const acceptOrder = async (req, res) => {
  try {
    const order = await SellerOrderToCourier.find({ isAccept: true }).populate("orderId courierId");
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to accept order",
      error: error.message,
    });
  }
};

// Cancel an order
const cancelOrder = async (req, res) => {
  try {
    const order = await SellerOrderToCourier.find({ isReject: true }).populate("orderId courierId");

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to cancel order",
      error: error.message,
    });
  }
};

module.exports = {
  createSellerOrderToCourier,
  getAllSellerOrdersToCourier,
  getSellerOrderToCourierById,
  updateSellerOrderToCourier,
  deleteSellerOrderToCourier,
  acceptOrder,
  cancelOrder,
};
