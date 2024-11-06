const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        firstName: { // Changed to firstName
            type: String,
            required: true,
        },
        lastName: { // Added lastName
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
        img: {
            type: String,
            default:'https://cdn-icons-png.flaticon.com/128/3237/3237472.png',
           
        },
        address: {
            type: String,
            default: null,
        },
        mobile: {
            type: String,
            default: null,
        },
        order: [{ 
            type: String, 
            default: [] // Set a default value for order
        }],
        location: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Location', 
            default: null 
        }
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
