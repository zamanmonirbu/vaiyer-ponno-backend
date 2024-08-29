const express = require('express');
const router = express.Router();
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/productController');
const { sellerAuth } = require('../middleware/authMiddleware');

// Route to create a new product
router.post('/', sellerAuth, createProduct);

// Route to get all products
router.get('/', getProducts);

// Route to get a single product by ID
router.get('/:id', getProductById);

// Route to update a product
router.put('/:id', sellerAuth, updateProduct);

// Route to delete a product
router.delete('/:id', sellerAuth, deleteProduct);

module.exports = router;
