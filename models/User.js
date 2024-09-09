const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    lat: {
        type: Number,
        required: false // You can adjust this based on your requirements
    },
    lng: {
        type: Number,
        required: false // You can adjust this based on your requirements
    }
});

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        image: {
            type: String,
        },
        address: {
            type: String,
            default: null,
        },
        order: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: [] }],
        location: locationSchema // Embed the location schema here
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
