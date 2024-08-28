const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the schema for Seller
const sellerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String },
  mobile: { type: String },
  img: { type: String },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  star: { type: Number, default: 0 },
  about: { type: String },
  video: { type: String },
  accountNumbers: [{ type: String }],
  isSeller: { type: Boolean, default: true },
});

// Hash password before saving
sellerSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to compare passwords
sellerSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Seller', sellerSchema);
