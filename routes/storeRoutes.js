const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { sellerAuth } = require('../middleware/authMiddleware');

// Create a new store
router.post('/', sellerAuth, storeController.createStore);

// Get all stores of a seller
router.get('/lists', sellerAuth, storeController.getStoresBySeller);

// Get a single store by ID
router.get('/:id', sellerAuth, storeController.getStoreById);

// Update a store by ID
router.put('/:id', sellerAuth, storeController.updateStore);

// Delete a store by ID
router.delete('/:id', sellerAuth, storeController.deleteStore);

module.exports = router;
