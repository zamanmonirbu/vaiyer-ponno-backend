const Seller = require('../models/Seller');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Login Seller
exports.loginSeller = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find seller by email
    const seller = await Seller.findOne({ email });

    if (!seller) {
      return res.status(404).json({ error: 'Seller not found' });
    }

    // Compare passwords
    const isMatch = await seller.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Create a token (You can add more claims as needed)
    const token = jwt.sign(
      { id: seller._id, email: seller.email },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    res.json({
      message: 'Login successful',
      token,
      seller: {
        id: seller._id,
        name: seller.name,
        email: seller.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Register Seller
exports.registerSeller = async (req, res) => {
  try {
    const { name, email, password, address, mobile, img, about, video, accountNumbers } = req.body;

    // Check if seller already exists
    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      return res.status(400).json({ error: 'Seller already exists' });
    }

    // Create a new seller
    const newSeller = new Seller({
      name,
      email,
      password,
      address,
      mobile,
      img,
      about,
      video,
      accountNumbers
    });

    // Save seller to the database
    await newSeller.save();

    res.status(201).json({ message: 'Seller registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
