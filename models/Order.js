const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    tran_id: { type: String, required: true, unique: true },
    customerName: String,
    transactionId: String,
    customerEmail: String,
    customerId: String,
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

    // Order tracking fields
    sellerAccepted: {
      type: Boolean,
      default: false, // Initially set to false
    },
      // Rejection fields
      sellerRejected: {
        type: Boolean,
        default: false, // Initially set to false
      },
      rejectionReason: {
        type: String,
        default: "", // Stores reason for rejection (if any)
      },
  
    sentToCourier: {
      type: Boolean,
      default: false, // Initially set to false
    },
    courierToDeliveryMan: {
      type: Boolean,
      default: false, // Initially set to false
    },
    orderCompleted: {
      type: Boolean,
      default: false, // Initially set to false
    },

  
    // Timestamps for tracking when these actions occurred
    sellerAcceptedAt: Date,
    sentToCourierAt: Date,
    courierToDeliveryManAt: Date,
    orderCompletedAt: Date,
    sellerRejectedAt: Date, // Timestamp of rejection
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
