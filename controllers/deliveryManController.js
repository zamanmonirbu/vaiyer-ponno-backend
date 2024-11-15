const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const DeliveryMan = require('../models/DeliveryMan');

// Register DeliveryMan Controller
const registerDeliveryMan = async (req, res) => {
  const { name, phone, email, password, address, vehicleType, firstname, lastname, nid } = req.body;

  try {
    // Check if the deliveryMan already exists
    const deliveryManExists = await DeliveryMan.findOne({ email });
    if (deliveryManExists) {
      return res.status(400).json({ message: 'DeliveryMan already exists' });
    }

    // Create a new DeliveryMan
    const newDeliveryMan = new DeliveryMan({
      name,
      phone,
      email,
      password,
      address,
      vehicleType,
      firstname,
      lastname,
      nid,
    });

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    newDeliveryMan.password = await bcrypt.hash(password, salt);

    // Save to database
    await newDeliveryMan.save();

    res.status(201).json({ message: 'DeliveryMan registered successfully', deliveryMan: newDeliveryMan });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login DeliveryMan Controller
const loginDeliveryMan = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if deliveryMan exists
    const deliveryMan = await DeliveryMan.findOne({ email });
    if (!deliveryMan) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, deliveryMan.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: deliveryMan._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ message: 'Login successful', token, deliveryMan });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Fetch DeliveryMan Profile Controller
const getDeliveryManProfile = async (req, res) => {
  try {
    const deliveryMan = await DeliveryMan.findById(req.params.id);
    if (!deliveryMan) {
      return res.status(404).json({ message: 'DeliveryMan not found' });
    }

    res.status(200).json(deliveryMan);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update DeliveryMan Profile Controller
const updateDeliveryManProfile = async (req, res) => {
  const { name, phone, address, vehicleType, firstname, lastname, nid } = req.body;

  try {
    const deliveryMan = await DeliveryMan.findById(req.params.id);
    if (!deliveryMan) {
      return res.status(404).json({ message: 'DeliveryMan not found' });
    }

    // Update profile
    deliveryMan.name = name || deliveryMan.name;
    deliveryMan.phone = phone || deliveryMan.phone;
    deliveryMan.address = address || deliveryMan.address;
    deliveryMan.vehicleType = vehicleType || deliveryMan.vehicleType;
    deliveryMan.firstname = firstname || deliveryMan.firstname;
    deliveryMan.lastname = lastname || deliveryMan.lastname;
    deliveryMan.nid = nid || deliveryMan.nid;

    await deliveryMan.save();

    res.status(200).json(deliveryMan);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  registerDeliveryMan,
  loginDeliveryMan,
  getDeliveryManProfile,
  updateDeliveryManProfile,
};
