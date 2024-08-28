const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// Login Admin
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find admin by email
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    // Compare passwords
    const isMatch = await admin.comparePassword(password);

    if (!isMatch || !admin.isAdmin) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Create a token
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Register Admin
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password, img } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin already exists' });
    }

    // Create a new admin
    const newAdmin = new Admin({
      name,
      email,
      password,
      img
    });

    // Save admin to the database
    await newAdmin.save();

    res.status(201).json({ message: 'Admin registered wait for supper admin approval' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
