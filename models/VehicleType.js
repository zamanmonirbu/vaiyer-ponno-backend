const mongoose = require("mongoose");

const vehicleTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Ensure that vehicle types are unique (Bike, Car, etc.)
  },
  description: {
    type: String,
    default: null, // Optional description for the vehicle type
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("VehicleType", vehicleTypeSchema);
