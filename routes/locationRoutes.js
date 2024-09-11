const express = require('express');
const { updateUserLocation, getUserLocation } = require('../controllers/locationController');
const router = express.Router();

// Route to get user location
router.get('/:userId', getUserLocation);

// Route to update user location
router.post('/update', updateUserLocation);

module.exports = router;
