const mongoose = require('mongoose');
// const Category = require('./Category'); 
// const SubCategory = require('./SubCategory'); 
// const Review = require('./Review'); 
// const Order = require('./Order');
// const Rating = require('./Rating');
// const Seller = require('./Seller');



const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
    imageURL: { type: String, required: true },
    subImages: { type: [String], required: true },
    unitPrice: { type: Number, required: true },
    description: { type: String, required: true },
    video: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    subCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory', required: false },
    order: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: [] }],
    rating: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rating' }],
    comment: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }] // Reference to Review model
});

// Use mongoose.models to avoid overwriting the model
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

module.exports = Product;
