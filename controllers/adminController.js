const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Get Admin by ID
exports.getAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findById(id).select('-password'); 

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    res.json(admin);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get all Admins
exports.getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({ isAdmin: true });
    res.json(admins);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get requested (non-approved) Admins
exports.requestAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({ isAdmin: false }).select('-password');
    res.json(admins);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Register Admin
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: 'Admin already exists' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newAdmin = new Admin({ name, email, password: hashedPassword });
    await newAdmin.save();

    res.status(201).json({ success: true, message: 'Admin registered, wait for super admin approval' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Login Admin
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch || !admin.isAdmin) {
      return res.status(400).json({ success: false, message: 'Invalid credentials or not an approved admin' });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        isAdmin: admin.isAdmin,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Update Admin
exports.updateAdmin = async (req, res) => {
  const { name, email, password, isAdmin, img } = req.body;

  try {
    const admin = await Admin.findById(req.params.id);

    if (admin) {
      admin.name = name || admin.name;
      admin.email = email || admin.email;
      admin.isAdmin = isAdmin ?? admin.isAdmin; // Use nullish coalescing to preserve boolean value
      admin.img = img || admin.img;

      if (password) {
        admin.password = await bcrypt.hash(password, 10); // Only hash if password is being updated
      }

      const updatedAdmin = await admin.save();
      res.json(updatedAdmin);
    } else {
      res.status(404).json({ success: false, message: 'Admin not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Delete Admin
exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const adminDel = await Admin.deleteOne({ _id: id });

    if (adminDel.deletedCount > 0) {
      res.json({ success: true, message: 'Admin removed' });
    } else {
      res.status(404).json({ success: false, message: 'Admin not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
