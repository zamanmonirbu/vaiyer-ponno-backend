const mongoose = require('mongoose');

// Define the SubCategory schema
const subCategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: [] }], // Add this line to store product IDs
});

// Use mongoose.models to avoid overwriting the model
const SubCategory = mongoose.models.SubCategory || mongoose.model('SubCategory', subCategorySchema);

module.exports = SubCategory;
