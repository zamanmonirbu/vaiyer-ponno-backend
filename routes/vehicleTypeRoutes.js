const express = require('express');
const router = express.Router();
const {
  createVehicleType,
  getVehicleTypes,
  getVehicleTypeById,
  updateVehicleType,
  deleteVehicleType
} = require('../controllers/vehicleTypeController');

// Create a new VehicleType
router.post('/', createVehicleType);

// Get all VehicleTypes
router.get('/', getVehicleTypes);

// Get a single VehicleType by ID
router.get('/:id', getVehicleTypeById);

// Update VehicleType by ID
router.put('/:id', updateVehicleType);

// Delete VehicleType by ID
router.delete('/:id', deleteVehicleType);

module.exports = router;
