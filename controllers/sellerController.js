const Seller = require('../models/Seller');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Product = require('../models/Product');


// Get all sellers
exports.getSellers = async (req, res) => {
  try {
    const sellers = await Seller.find({isSeller:true});
    // console.log(sellers)
    res.status(200).json(sellers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.deactivateSellers = async (req, res) => {
  try {
    const sellers = await Seller.find({isSeller:false});
    // console.log(sellers)
    res.status(200).json(sellers);
  } catch (error) {
    // console.log(error.message)
    res.status(500).json({ error: error.message });
  }
};

// Get a single seller by ID
exports.getSellerById = async (req, res) => {

  try {
    const seller = await Seller.findById(req.params.id)
    .populate('products') // Populate products
    .populate('category') // Populate categories
    .populate('subCategory') // Populate subcategories
    .populate('order') // Populate orders
    .populate('location'); // Populate location
    
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    res.status(200).json(seller);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Controller to fetch products by category for a specific seller
exports.fetchProductsByCategoryOfSeller = async (req, res) => {
  const { sellerId, category } = req.params;

  // console.log(sellerId, category)


  try {
    const products = await Product.find({ seller: sellerId, category });
    if (!products || products.length === 0) {
      return res.status(404).json({ error: 'No products found for this category and seller.' });
    }

    res.status(200).json(products);
  } catch (error) {
    // console.log(error.message);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
};


// Update a seller
exports.updateSeller = async (req, res) => {
  const { id } = req.params;
  try {
    const seller = await Seller.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    res.status(200).json(seller);
  } catch (error) {
    // console.log(error.message)
    res.status(400).json({ error: error.message });
  }
};

// Delete a seller
exports.deleteSeller = async (req, res) => {
  try {
    const seller = await Seller.findByIdAndDelete(req.params.id);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    res.status(200).json({ message: 'Seller deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Register a new seller
exports.registerSeller = async (req, res) => {
  try {
    const { name, email, password, address, mobile } = req.body;

    // Check if the seller already exists
    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      return res.status(400).json({ message: 'Seller already exists' });
    }

    // Password validation using regular expression
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
      });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const seller = new Seller({
      name,
      email,
      password: hashedPassword,
      address,
      mobile,
    });

    await seller.save();
    res.status(201).json({ message: 'Seller registered successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Login a seller
exports.loginSeller = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the seller by email
    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if the account is active
    if (!seller.isSeller) {
      return res.status(403).json({ error: "Your account is restricted" });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: seller._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      token,
      seller: {
        id: seller._id,
        name: seller.name,
        email: seller.email,
        isSeller: seller.isSeller,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
