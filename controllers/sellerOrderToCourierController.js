const Order = require("../models/Order");
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
  const { id } = req.params;
  console.log(id);
  try {
    // Proper query to match both `isAccept` and `isReject` as false
    const entries = await SellerOrderToCourier.find({
      courierId: id,
      isAccept: false,
      isReject: false,
      isReceivedByDeliveryMan: false,
      isSubmittedToDeliveryMan: false,
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

// Update delivery status (Accept or Reject)
const updateSellerOrderToCourier = async (req, res) => {
  console.log(req.body, req.params.id);

  try {
    const { actionType } = req.body;

    // Validate actionType and determine which field to update
    let updateFields = {};
    if (actionType === "accept") {
      updateFields = { isAssigned: true };
    } else if (actionType === "reject") {
      updateFields = { isAssigned: false };
    } else {
      return res.status(400).json({ message: "Invalid actionType" });
    }

    // Find and update the CourierToDeliveryMan entry
    const updatedAssignment = await SellerOrderToCourier.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true } // Return the updated document
    );

    if (!updatedAssignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // If the assignment was accepted, update the SellerOrderToCourier document
    if (actionType === "accept") {
      await SellerOrderToCourier.findOneAndUpdate(
        {
          orderId: updatedAssignment.orderId,
          courierId: updatedAssignment.courierId,
        },
        { isAccept: true, isReject: false },
        { new: true }
      );
    } else if (actionType === "reject") {
      await SellerOrderToCourier.findOneAndUpdate(
        {
          orderId: updatedAssignment.orderId,
          courierId: updatedAssignment.courierId,
        },
        { isReject: true },
        { new: true }
      );
    }
    console.log(updatedAssignment);
    // Update the Order model's sentToCourier field if the assignment was accepted
    if (updatedAssignment && actionType === "accept") {
      await Order.findByIdAndUpdate(
        updatedAssignment.orderId,
        { sentToCourier: true, sentToCourierAt: new Date() },
        { new: true }
      );
    }

    res.status(200).json({
      message: "Delivery status updated successfully.",
      data: updatedAssignment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to update delivery status.",
      error: error.message,
    });
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
  const { id } = req.params;
  try {
    const order = await SellerOrderToCourier.find({
      courierId: id,
      isAccept: true,
      isSubmittedToDeliveryMan: false,
      isReject: false,
      isReceivedByDeliveryMan: false,
    }).populate("orderId courierId");

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
    const order = await SellerOrderToCourier.find({ isReject: true }).populate(
      "orderId courierId"
    );

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
