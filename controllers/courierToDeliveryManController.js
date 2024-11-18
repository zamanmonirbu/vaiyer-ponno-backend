const CourierToDeliveryMan = require("../models/CourierToDeliveryMan");
const Order = require("../models/Order");
const SellerOrderToCourier = require("../models/sellerOrderToCourierSchema");

// Assign an order to a delivery man
const assignOrder = async (req, res) => {
  try {
    const { courierId, deliveryManId, orderId, note, mainOrderId } = req.body;

    // Check if the assignment already exists
    const existingAssignment = await CourierToDeliveryMan.findOne({ orderId });
    if (existingAssignment) {
      return res
        .status(400)
        .json({ message: "This order is already assigned to a delivery man." });
    }

    // Create a new assignment
    const newAssignment = new CourierToDeliveryMan({
      courierId,
      deliveryManId,
      ctdId: orderId,
      notes: note,
      orderId: mainOrderId,
    });

    const savedAssignment = await newAssignment.save();

    // Update the SellerOrderToCourier table
    const updatedSellerOrder = await SellerOrderToCourier.findOneAndUpdate(
      { _id: orderId, courierId }, // Match the order and courier
      { isSubmittedToDeliveryMan: true }, // Set isSubmittedToDeliveryMan to true
      { new: true } // Return the updated document
    );

    console.log(updatedSellerOrder);
    if (!updatedSellerOrder) {
      return res.status(404).json({
        message: "Failed to update SellerOrderToCourier. Entry not found.",
      });
    }

    res.status(201).json({
      message: "Order successfully assigned to the delivery man.",
      data: {
        assignment: savedAssignment,
        sellerOrderUpdate: updatedSellerOrder,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to assign order.",
      error: error.message,
    });
  }
};

const getAllAssignments = async (req, res) => {
  const { deliveryManId } = req.params;

  try {
    const assignments = await CourierToDeliveryMan.find({
      deliveryManId, // Match documents with the provided deliveryManId
      isAssigned: false, // Only include unassigned orders
      isDelivered: false, // Only include undelivered orders
    })
      .populate("courierId")
      .populate("deliveryManId")
      .populate("orderId")
      .populate("ctdId")
      .sort({ createdAt: -1 }); // Sort by `createdAt` field in descending order

    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch assignments.",
      error: error.message,
    });
  }
};

const getAssignmentsByCourier = async (req, res) => {
  const { courierId } = req.params;

  try {
    const assignments = await CourierToDeliveryMan.find({ courierId })
      .populate("deliveryManId", "firstName lastName phone")
      .populate("orderId", "tran_id customerName")
      .sort({ createdAt: -1 }); // Sort by `createdAt` field in descending order

    if (assignments.length === 0) {
      return res
        .status(404)
        .json({ message: "No assignments found for this courier." });
    }

    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch assignments.",
      error: error.message,
    });
  }
};


// Update delivery status (Accept or Reject)
const updateDeliveryStatus = async (req, res) => {
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
    const updatedAssignment = await CourierToDeliveryMan.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true } // Return the updated document
    );

    if (!updatedAssignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // If the assignment was accepted, update the SellerOrderToCourier document
    if (actionType === "accept") {
      await CourierToDeliveryMan.findOneAndUpdate(
        {
          orderId: updatedAssignment.orderId,
          courierId: updatedAssignment.courierId,
        },
        { isAccept: true, isReject: false },
        { new: true }
      );
    } else if (actionType === "reject") {
      await CourierToDeliveryMan.findOneAndUpdate(
        {
          orderId: updatedAssignment.orderId,
          courierId: updatedAssignment.courierId,
        },
        { isReject: true },
        { new: true }
      );
    }

    // Update the Order model's sentToCourier field if the assignment was accepted
    if (updatedAssignment && actionType === "accept") {
      await Order.findByIdAndUpdate(
        updatedAssignment.orderId,
        { courierToDeliveryMan: true, courierToDeliveryManAt: new Date() },
        { new: true }
      );
    }

    if (updatedAssignment) {
      await SellerOrderToCourier.findByIdAndUpdate(
        updatedAssignment.orderId,
        {
          isReceivedByDeliveryMan: true,
        },
        { new: true }
      );
    }

    res.status(200).json({
      message: "Delivery status updated successfully.",
      data: updatedAssignment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update delivery status.",
      error: error.message,
    });
  }
};

// Update delivery status (Accept or Reject)
const updateCompleteStatus = async (req, res) => {
  try {
    const { actionType } = req.body;

    // Validate actionType and determine which field to update
    let updateFields = {};
    if (actionType === "accept") {
      updateFields = { isDelivered: true };
    } else if (actionType === "reject") {
      updateFields = { isDelivered: false };
    } else {
      return res.status(400).json({ message: "Invalid actionType" });
    }

    // Find and update the CourierToDeliveryMan entry
    const updatedAssignment = await CourierToDeliveryMan.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true } // Return the updated document
    );

    if (!updatedAssignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // If the assignment was accepted, update the SellerOrderToCourier document
    if (actionType === "accept") {
      await CourierToDeliveryMan.findOneAndUpdate(
        {
          orderId: updatedAssignment.orderId,
          courierId: updatedAssignment.courierId,
        },
        { isAccept: true, isReject: false },
        { new: true }
      );
    } else if (actionType === "reject") {
      await CourierToDeliveryMan.findOneAndUpdate(
        {
          orderId: updatedAssignment.orderId,
          courierId: updatedAssignment.courierId,
        },
        { isReject: true },
        { new: true }
      );
    }

    // Update the Order model's sentToCourier field if the assignment was accepted
    if (updatedAssignment && actionType === "accept") {
      await Order.findByIdAndUpdate(
        updatedAssignment.orderId,
        { orderCompleted: true, orderCompletedAt: new Date() },
        { new: true }
      );
    }
    res.status(200).json({
      message: "Delivery status updated successfully.",
      data: updatedAssignment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update delivery status.",
      error: error.message,
    });
  }
};

// Delete an assignment
const deleteAssignment = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAssignment = await CourierToDeliveryMan.findByIdAndDelete(id);

    if (!deletedAssignment) {
      return res.status(404).json({ message: "Assignment not found." });
    }

    res.status(200).json({
      message: "Assignment deleted successfully.",
      data: deletedAssignment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete assignment.",
      error: error.message,
    });
  }
};

// Get assigned orders by deliveryManId
const getAssignedOrders = async (req, res) => {
  const { deliveryManId } = req.params;
  try {
    const assignedOrders = await CourierToDeliveryMan.find({
      deliveryManId,
      isAssigned: true,
      isDelivered: false,
      isReject: false,
    }).populate("orderId courierId deliveryManId");

    res.status(200).json(assignedOrders);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch assigned orders.",
      error: error.message,
    });
  }
};

// Get rejected orders by deliveryManId
const getRejectedOrders = async (req, res) => {
  const { deliveryManId } = req.params;
  try {
    const rejectedOrders = await CourierToDeliveryMan.find({
      deliveryManId,
      isReject: true, // Filter for rejected orders
    }).populate("orderId courierId deliveryManId");

    res.status(200).json(rejectedOrders);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch rejected orders.",
      error: error.message,
    });
  }
};

// Get delivered orders by deliveryManId
const getDeliveredOrders = async (req, res) => {
  const { deliveryManId } = req.params;
  try {
    const deliveredOrders = await CourierToDeliveryMan.find({
      deliveryManId,
      isDelivered: true, // Filter for delivered orders
    }).populate("orderId courierId deliveryManId");

    res.status(200).json(deliveredOrders);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch delivered orders.",
      error: error.message,
    });
  }
};

module.exports = {
  assignOrder,
  getAllAssignments,
  getAssignmentsByCourier,
  updateDeliveryStatus,
  deleteAssignment,
  getAssignedOrders,
  getRejectedOrders,
  getDeliveredOrders,
};
