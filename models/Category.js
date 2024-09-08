const mongoose = require('mongoose');
const SubCategory = require('./SubCategory'); // Import the SubCategory model

// Define the Category schema
const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    subCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' }],
    seller: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Seller' }],
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: [] }], 
    insSubCategory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory', default: [] }], 
    categoryImage: {
        type: String,
        default: 'https://cdn-icons-png.flaticon.com/128/10951/10951869.png', 
    },
} ,
{ timestamps: true });

// Use mongoose.models to avoid overwriting the model
const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

module.exports = Category;
