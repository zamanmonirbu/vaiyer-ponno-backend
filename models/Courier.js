const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const courierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: null,
  },
  address: {
    type: String,
    required: true,
  },
  vehicleType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "VehicleType",
  },
  ordersSeller: [],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware for hashing passwords before saving
courierSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method for password comparison during login
courierSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Courier", courierSchema);
