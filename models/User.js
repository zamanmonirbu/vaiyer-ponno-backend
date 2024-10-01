const mongoose = require('mongoose');

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
