const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema(
  {
    tran_id: { type: String, required: true, unique: true }, // Ensure it's unique
    customerName: String,
    transactionId: String,
    customerEmail: String,
    customerAddress: String,
    customerMobile: String,
    totalAmount: Number,
    products: Array,
    status: Boolean,
    sellerIds: Array,
    productIds: Array,
    currency: String,
    shipping_method: String,
    cus_country: String,
    ship_name: String,
    ship_add1: String,
    ship_add2: String,
    ship_city: String,
    ship_state: String,
    ship_postcode: String,
    ship_country: String,
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
