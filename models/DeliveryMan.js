const mongoose = require('mongoose');

const deliveryManSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  deliveryStatus: {
    type: String,
    enum: ['pending', 'delivered'],
    default: 'pending',
  },
  assignedOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  },
});

const DeliveryMan = mongoose.model('DeliveryMan', deliveryManSchema);
module.exports = DeliveryMan;
