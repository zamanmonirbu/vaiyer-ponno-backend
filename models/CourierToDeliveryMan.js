const mongoose = require("mongoose");

const courierToDeliveryManSchema = new mongoose.Schema(
  {
    courierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Courier", // Reference to the Courier model
      required: true,
    },
    deliveryManId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryMan", // Reference to the DeliveryMan model
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order", // Reference to the Order model
      required: true,
    },
    isAssigned: {
      type: Boolean,
      default: false, // Indicates if the order has been assigned to the delivery man
    },
    isReject: {
      type: Boolean,
      default: false, // Indicates if the order has been assigned to the delivery man
    },
    isDelivered: {
      type: Boolean,
      default: false, // Indicates if the order has been delivered
    },
    notes: {
      type: String,
      default: "", // Optional notes or instructions for the delivery
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const CourierToDeliveryMan = mongoose.model(
  "CourierToDeliveryMan",
  courierToDeliveryManSchema
);

module.exports = CourierToDeliveryMan;
