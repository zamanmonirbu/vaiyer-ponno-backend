const mongoose = require('mongoose');

// Define the SubCategory schema
const subCategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: [] }], 
    seller: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Seller', default: [] }],
    category: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: [] }],

},
{ timestamps: true });

// Use mongoose.models to avoid overwriting the model
const SubCategory = mongoose.models.SubCategory || mongoose.model('SubCategory', subCategorySchema);

module.exports = SubCategory;
