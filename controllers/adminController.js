const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');



// Get Admin by ID
exports.getAdminById = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await Admin.findById(id).select('-password'); // Exclude password
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    res.json(admin);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};


//All admins
exports.getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({ isAdmin: true });
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//Requested admins
exports.requestAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({ isAdmin: false }).select('-password');
    console.log(admins);
    res.json(admins);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

// Register Admin
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin already exists' });
    }

    // Hash the password before saving it to the database
    const saltRounds = 10; // You can adjust the number of salt rounds as needed
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // Create a new admin with the hashed password
    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
     
    });

    // Save the admin to the database
    await newAdmin.save();

    res.status(201).json({ message: 'Admin registered, wait for super admin approval' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

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
    // const isMatch = await admin.comparePassword(password);
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch || !admin.isAdmin) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Create a token
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        isAdmin:admin.isAdmin
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};



exports.updateAdmin = async (req, res) => {
  const { name, email, password,isAdmin } = req.body;

  try {
    const admin = await Admin.findById(req.params.id);

    if (admin) {
      admin.name = name || admin.name;
      admin.email = email || admin.email;
      admin.isAdmin = isAdmin || admin.isAdmin;

      if (password) {
        admin.password = password;
      }

      const updatedAdmin = await admin.save();
      res.json(updatedAdmin);
    } else {
      res.status(404).json({ message: 'Admin not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const adminDel = await Admin.deleteOne({ _id: id });

    if (adminDel.deletedCount > 0) { 
      res.json({ message: 'Admin removed' });
    } else {
      res.status(404).json({ message: 'Admin not found' });
    }
  } catch (error) {
    // console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};


