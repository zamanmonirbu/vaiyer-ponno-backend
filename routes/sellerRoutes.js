const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController');
const productController = require('../controllers/productController');
const { sellerAuth } = require('../middleware/authMiddleware');


// Get all sellers
router.get('/sellers', sellerController.getSellers);
//Product by seller
router.get('/products',sellerAuth, productController.getSellerProducts);
// /api/seller/sellers/deactivated
router.get('/sellers/deactivated', sellerController.deactivateSellers);
// Get a seller by ID
router.get('/sellers/:id', sellerController.getSellerById);
// Route to fetch products by category for a specific seller
router.get('/:sellerId/products/category/:category', sellerController.fetchProductsByCategoryOfSeller);
// Register a new seller
router.post('/register', sellerController.registerSeller);
// Login a seller
router.post('/login', sellerController.loginSeller);
// Update a seller
router.put('/sellers/:id', sellerController.updateSeller);
// Delete a seller
router.delete('/sellers/:id', sellerController.deleteSeller);

module.exports = router;
