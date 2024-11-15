const VehicleType = require("../models/VehicleType");

// Create a new VehicleType
const createVehicleType = async (req, res) => {
  const { name, description } = req.body;

  try {
    // Check if the vehicle type already exists
    const existingVehicleType = await VehicleType.findOne({ name });
    if (existingVehicleType) {
      return res.status(400).json({ message: 'VehicleType already exists' });
    }

    // Create a new vehicle type
    const newVehicleType = new VehicleType({ name, description });

    // Save to database
    await newVehicleType.save();

    res.status(201).json({ message: 'VehicleType created successfully', vehicleType: newVehicleType });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all VehicleTypes
const getVehicleTypes = async (req, res) => {
  try {
    const vehicleTypes = await VehicleType.find();
    res.status(200).json(vehicleTypes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a single VehicleType by ID
const getVehicleTypeById = async (req, res) => {
  try {
    const vehicleType = await VehicleType.findById(req.params.id);
    if (!vehicleType) {
      return res.status(404).json({ message: 'VehicleType not found' });
    }

    res.status(200).json(vehicleType);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update VehicleType by ID
const updateVehicleType = async (req, res) => {
  const { name, description } = req.body;

  try {
    const vehicleType = await VehicleType.findById(req.params.id);
    if (!vehicleType) {
      return res.status(404).json({ message: 'VehicleType not found' });
    }

    // Update the vehicleType fields
    vehicleType.name = name || vehicleType.name;
    vehicleType.description = description || vehicleType.description;

    await vehicleType.save();

    res.status(200).json({ message: 'VehicleType updated successfully', vehicleType });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete VehicleType by ID
const deleteVehicleType = async (req, res) => {
  try {
    const vehicleType = await VehicleType.findById(req.params.id);
    if (!vehicleType) {
      return res.status(404).json({ message: 'VehicleType not found' });
    }

    await vehicleType.remove();

    res.status(200).json({ message: 'VehicleType deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createVehicleType,
  getVehicleTypes,
  getVehicleTypeById,
  updateVehicleType,
  deleteVehicleType,
};
