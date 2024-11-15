const mongoose = require("mongoose");

const sellerOrderToCourierSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true, // Order ID is mandatory
    },
    courierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Courier",
      required: true, // Courier ID is mandatory
    },
    isAccept: {
      type: Boolean,
      default: false, // Initially, the courier has not accepted
    },
    isReject: {
      type: Boolean,
      default: false, // Initially, the courier has not rejected
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

const SellerOrderToCourier = mongoose.model(
  "SellerOrderToCourier",
  sellerOrderToCourierSchema
);

module.exports = SellerOrderToCourier;
