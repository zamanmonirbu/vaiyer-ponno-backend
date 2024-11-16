const express = require("express");
const {
  assignOrder,
  getAllAssignments,
  getAssignmentsByCourier,
  updateDeliveryStatus,
  deleteAssignment,
  getAssignedOrders,
  getRejectedOrders,
  getDeliveredOrders,
} = require("../controllers/courierToDeliveryManController");

const router = express.Router();

// Create a new assignment
router.post("/", assignOrder);

// Get all assignments
router.get("/request/to/delivery/man/:deliveryManId", getAllAssignments);

// Get assignments by courier ID
router.get("/:courierId", getAssignmentsByCourier);

// Update delivery status
router.patch("/update/:id", updateDeliveryStatus);

// Delete an assignment
router.delete("/:id", deleteAssignment);


// Route to get assigned orders by deliveryManId
router.get("/assignments/:deliveryManId", getAssignedOrders);

// Route to get rejected orders by deliveryManId
router.get("/rejections/:deliveryManId", getRejectedOrders);

// Route to get delivered orders by deliveryManId
router.get("/deliveries/:deliveryManId", getDeliveredOrders);


module.exports = router;
