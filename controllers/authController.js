const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const registerUser = async (req, res) => {
    const { name, email, password, mobile, address } = req.body;

    // Password strength validation using regular expression
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Validate the password
    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            message: 'Password must be at least 8 characters long, and include at least one uppercase letter, one lowercase letter, one number, and one special character.',
        });
    }

    // Validate mobile number format (example: 10 digits)
    const mobileRegex = /^\d{11}$/;
    if (!mobileRegex.test(mobile)) {
        return res.status(400).json({
            message: 'Mobile number must be 11 digits long.',
        });
    }

    // Validate address (optional: you can define your own validation logic)
    if (!address || address.trim().length === 0) {
        return res.status(400).json({
            message: 'Address is required.',
        });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ 
            name, 
            email, 
            password: hashedPassword, 
            mobile, 
            address 
        });
        await newUser.save();

        res.status(201).json({ 
            message: 'User registered successfully', 
            // user: { id: newUser._id, name: newUser.name, email: newUser.email, mobile: newUser.mobile, address: newUser.address } 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).populate('location');
        if (!user) {
            return res.status(400).json({ message: 'User not found password' });
        }
        // a@gmail.com
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        // console.log((password, user.password));
        if (!isPasswordMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '12h' });

        res.status(200).json({ 
            message: 'Login successful', 
            token, 
            user: { id: user._id, name: user.name, email: user.email,isAdmin:user.isAdmin,isSeller:user.isAdmin,location:user.location } 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { loginUser, registerUser };
