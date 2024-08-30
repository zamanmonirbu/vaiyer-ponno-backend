const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController');

// Register a new seller
router.post('/register', sellerController.registerSeller);

// Login a seller
router.post('/login', sellerController.loginSeller);

// Get all sellers
router.get('/sellers', sellerController.getSellers);
// Get all sellers
router.get('/sellers/deactivated', sellerController.deactivateSellers);

// Get a seller by ID
router.get('/sellers/:id', sellerController.getSellerById);

// Update a seller
router.put('/sellers/:id', sellerController.updateSeller);

// Delete a seller
router.delete('/sellers/:id', sellerController.deleteSeller);

module.exports = router;
