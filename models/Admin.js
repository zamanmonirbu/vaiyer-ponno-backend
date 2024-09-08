const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define the schema for Admin
const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    img: { type: String },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);
