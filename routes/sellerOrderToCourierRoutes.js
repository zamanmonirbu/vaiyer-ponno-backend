const express = require("express");
const {
  createSellerOrderToCourier,
  getAllSellerOrdersToCourier,
  getSellerOrderToCourierById,
  updateSellerOrderToCourier,
  deleteSellerOrderToCourier,
  acceptOrder,
  cancelOrder,
} = require("../controllers/sellerOrderToCourierController");

const router = express.Router();


// Route to accept an order
router.get("/accept/by/courier/:id", acceptOrder);

// Route to cancel an order
router.get("/reject/by/courier", cancelOrder);

// Create a new entry
router.post("/", createSellerOrderToCourier);

// Get all entries
router.get("/request/:id", getAllSellerOrdersToCourier);

// Get a single entry by ID
router.get("/:id", getSellerOrderToCourierById);

// Update an entry
router.put("/:id", updateSellerOrderToCourier);

// Delete an entry
router.delete("/:id", deleteSellerOrderToCourier);

module.exports = router;
