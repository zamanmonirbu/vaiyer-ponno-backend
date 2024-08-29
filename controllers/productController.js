const Product = require('../models/Product');

// Controller for creating a new product
exports.createProduct = async (req, res) => {
    const { name, imageURL, subImages, unitPrice, description, video, category, subCategory } = req.body;

    try {
        const newProduct = new Product({
            name,
            seller: req.seller._id, // Seller ID from authenticated user
            imageURL,
            subImages,
            unitPrice,
            description,
            video,
            category,
            subCategory,
            ratings: 0, // Default ratings to 0
            
        });
console.log(newProduct)
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Controller for getting all products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('category').populate('subCategory');
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Controller for getting a single product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category').populate('subCategory');
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Controller for updating a product
exports.updateProduct = async (req, res) => {
    const { name, imageURL, subImages, unitPrice, description, video, category, subCategory } = req.body;

    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Ensure only the seller can update the product
        if (product.seller.toString() !== req.seller._id) {
            return res.status(403).json({ message: 'Unauthorized action' });
        }

        product.name = name;
        product.imageURL = imageURL;
        product.subImages = subImages;
        product.unitPrice = unitPrice;
        product.description = description;
        product.video = video;
        product.category = category;
        product.subCategory = subCategory;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Controller for deleting a product
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Ensure only the seller can delete the product
        if (product.seller.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized action' });
        }

        await product.remove();
        res.json({ message: 'Product removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
