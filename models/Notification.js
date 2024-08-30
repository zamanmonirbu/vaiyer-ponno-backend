const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
   
    message: {
        type: String,
        required: true
    },
    type:{
        type: String,
        required: true
    }
    
}, {
    timestamps: true
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;



