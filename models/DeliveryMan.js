const mongoose = require("mongoose");

const deliveryManSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  nid: {
    type: String,
    required: true,
    unique: true, // Ensure NID is unique
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
   
  },
  courierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Courier", // Link to the Courier model
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  vehicleType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "VehicleType", // Link to the VehicleType model
    required: true,
  },
  deliveryStatus: {
    type: String,
    enum: ["pending", "delivered"],
    default: "pending",
  },
  assignedOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("DeliveryMan", deliveryManSchema);
