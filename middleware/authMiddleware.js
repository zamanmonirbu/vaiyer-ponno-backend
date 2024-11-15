const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Seller = require('../models/Seller');
const Admin = require('../models/Admin');
const Courier = require("../models/Courier");
const DeliveryMan = require('../models/DeliveryMan');



// Protect routes and check for user role
const userAuth = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            console.log(token)
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decoded)
            req.user = await User.findById(decoded.userId).select('-password');
            if (!req.user) {
                console.log("not found")
                return res.status(401).json({ message: 'User not found' });
            }
            next();
        } catch (error) {
            console.log("not auth")
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Protect routes and check for seller role
const sellerAuth = async (req, res, next) => {
    let token;
    // console.log("Token",req.headers.authorization,req.headers)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // console.log("TRue or false",decoded)
            req.seller = await Seller.findById(decoded.id).select('-password');
            // console.log("req.body",req.seller )
            if (!req.seller) {
                return res.status(401).json({ message: 'User not found' });
            }
            // Check if the user is a seller
            // console.log(req.seller);
            if (req.seller && req.seller.isSeller) {
                next();
            } else {
                res.status(403).json({ message: 'Seller authorization required' });
            }
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed in' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Protect routes and check for admin role
const adminAuth = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.admin = await Admin.findById(decoded.id).select('-password');
            if (!req.admin) {
                return res.status(401).json({ message: 'User not found' });
            }
            // Check if the user is an admin
            if (req.admin && req.admin.isAdmin) {
                next();
            } else {
                res.status(403).json({ message: 'Admin authorization required' });
            }
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};


const courierAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await Courier.findById(decoded.id).select("-password");
    //   console.log(req.user)
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};





// Protect routes middleware
const DeliveryManAuth = async (req, res, next) => {
  let token;

  // Check for token in Authorization header (Bearer token)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach deliveryMan to request object
      req.deliveryMan = await DeliveryMan.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'No token, not authorized' });
  }
};



const validateRefreshToken = (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ message: 'No refresh token found' });
    }
    req.refreshToken = refreshToken;
    next();
};

module.exports = { userAuth, sellerAuth, adminAuth,courierAuth, validateRefreshToken,DeliveryManAuth };
