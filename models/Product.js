const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
    gender: { type: String, required: true },
    imageURL: { type: String, required: true },
    subImages: { type: [String], required: true },
    unitPrice: { type: Number, required: true },
    description: { type: String, required: true },
    video: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    subCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory', required: false },
    rating: { type: Number, default: 0 },
    // order: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
    order: [{ type: String }],
    comment: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    offer: { type: Number, required: true },
    area: { type: Number, required: true }, // Area in square meters
    cities: { type: [String], required: true }, // Cities where the product is available
    sellerLocation: {
        lat: { type: Number, required: true },    // Latitude
        lng: { type: Number, required: true },    // Longitude
        city: { type: String, required: true },   // City name  
        road: { type: String, required: false },  // Road name
        postalCode: { type: String, required: false }, // Postal code
    },
    quantity: { type: Number, required: true }, // Available stock quantity
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

module.exports = Product;  
