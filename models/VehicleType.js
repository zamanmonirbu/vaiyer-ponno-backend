const mongoose = require("mongoose");

const vehicleTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: null, // Optional description for the vehicle type
  },
  courierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Courier", // Refers to the Courier collection
    required: true, // Make this mandatory if every vehicle type must be linked to a courier
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("VehicleType", vehicleTypeSchema);
