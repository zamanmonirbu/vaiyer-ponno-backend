const Courier = require("../models/Courier");
const jwt = require("jsonwebtoken");

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Register a new courier
exports.registerCourier = async (req, res) => {
  const { name, email, password, phone, address, vehicleType } = req.body;

  // console.log(req.body)

  try {
    const existingCourier = await Courier.findOne({ email });
    if (existingCourier) {
      return res.status(400).json({ message: "Courier already exists" });
    }

    const courier = await Courier.create({
      name,
      email,
      password,
      phone,
      address,
      vehicleType,
    });

    res.status(201).json({
      _id: courier._id,
      name: courier.name,
      email: courier.email,
      // token: generateToken(courier._id),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to register courier", error });
  }
};

// Login an existing courier
exports.loginCourier = async (req, res) => {
  const { email, password } = req.body;

  try {
    const courier = await Courier.findOne({ email });
    if (courier && (await courier.matchPassword(password))) {
      // Respond with profile and token as requested
      res.json({
        loginResponse: {
          _id: courier._id,
          name: courier.name,
          email: courier.email,
          phone: courier.phone,
          address: courier.address,
          vehicleType: courier.vehicleType,
        },
        token: generateToken(courier._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to login courier", error });
  }
};

// Get courier profile
exports.getCourierProfile = async (req, res) => {
  const { courierId } = req.params;

  try {
    const courier = await Courier.findById(req.user._id);
    if (!courier) {
      return res.status(404).json({ message: "Courier not found" });
    }
    // Respond with profile object
    res.json({
      profile: {
        _id: courier._id,
        name: courier.name,
        email: courier.email,
        phone: courier.phone,
        address: courier.address,
        vehicleType: courier.vehicleType,
        image: courier.image,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch courier profile", error });
  }
};


// Update courier profile
exports.updateCourierProfile = async (req, res) => {
  const { name, phone, address, vehicleType, image } = req.body;
  const { courierId } = req.params;

  try {
    const courier = await Courier.findById(courierId);

    if (!courier) {
      return res.status(404).json({ message: "Courier not found" });
    }

    // Update the courier's profile fields
    courier.name = name || courier.name;
    courier.phone = phone || courier.phone;
    courier.address = address || courier.address;
    courier.vehicleType = vehicleType || courier.vehicleType;
    courier.image = image || courier.image;

    const updatedCourier = await courier.save();

    // Respond with updated profile
    res.json({
      message: "Profile updated successfully",
      profile: {
        _id: updatedCourier._id,
        name: updatedCourier.name,
        email: updatedCourier.email,
        phone: updatedCourier.phone,
        address: updatedCourier.address,
        vehicleType: updatedCourier.vehicleType,
        image: updatedCourier.image,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update courier profile", error });
  }
};
