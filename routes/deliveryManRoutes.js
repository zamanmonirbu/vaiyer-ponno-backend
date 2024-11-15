const express = require('express');
const router = express.Router();
const { registerDeliveryMan, loginDeliveryMan, getDeliveryManProfile, updateDeliveryManProfile } = require('../controllers/deliveryManController');
const { DeliveryManAuth } = require('../middleware/authMiddleware');

DeliveryManAuth
// Register a DeliveryMan
router.post('/register', registerDeliveryMan);

// Login a DeliveryMan
router.post('/login', loginDeliveryMan);

// Fetch DeliveryMan Profile by ID (protected route)
router.get('/profile/:id', DeliveryManAuth, getDeliveryManProfile);

// Update DeliveryMan Profile (protected route)
router.put('/profile/:id', DeliveryManAuth, updateDeliveryManProfile);

module.exports = router;
