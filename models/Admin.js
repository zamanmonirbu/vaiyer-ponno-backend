const mongoose = require("mongoose");

// Define the schema for Admin
const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    img: { 
      type: String, 
      default: "https://cdn-icons-png.flaticon.com/512/560/560199.png"  
    },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);
