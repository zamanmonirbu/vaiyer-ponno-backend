const mongoose = require('mongoose');

const courierSchema = new mongoose.Schema({
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
  assignedOrders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  }],
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
});

const Courier = mongoose.model('Courier', courierSchema);
module.exports = Courier;
