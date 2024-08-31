const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Seller = require('../models/Seller');
const Admin = require('../models/Admin');

// Protect routes and check for user role
const userAuth = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
                return res.status(401).json({ message: 'User not found' });
            }
            next();
        } catch (error) {
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

module.exports = { userAuth, sellerAuth, adminAuth };






// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// const Seller = require('../models/Seller');
// const Admin = require('../models/Admin');


// // Protect routes
// const userAuth = async (req, res, next) => {
//     let token;
//     if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//         try {
//             token = req.headers.authorization.split(' ')[1];
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);
//             req.user = await User.findById(decoded.id).select('-password');
//             if (!req.user) {
//                 return res.status(401).json({ message: 'User not found' });
//             }
//             next();
//         } catch (error) {
//             res.status(401).json({ message: 'Not authorized, token failed' });
//         }
//     } else {
//         res.status(401).json({ message: 'Not authorized, no token' });
//     }
// };
// // Protect routes
// const sellerAuth = async (req, res, next) => {
//     let token;
//     if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//         try {
//             token = req.headers.authorization.split(' ')[1];
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);
//             req.user = await Seller.findById(decoded.id).select('-password');
//             if (!req.user) {
//                 return res.status(401).json({ message: 'User not found' });
//             }
//             next();
//         } catch (error) {
//             res.status(401).json({ message: 'Not authorized, token failed' });
//         }
//     } else {
//         res.status(401).json({ message: 'Not authorized, no token' });
//     }
// };
// // Protect routes
// const adminAuth = async (req, res, next) => {
//     let token;
//     if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//         try {
//             token = req.headers.authorization.split(' ')[1];
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);
//             req.user = await Admin.findById(decoded.id).select('-password');
//             if (!req.user) {
//                 return res.status(401).json({ message: 'User not found' });
//             }
//             next();
//         } catch (error) {
//             res.status(401).json({ message: 'Not authorized, token failed' });
//         }
//     } else {
//         res.status(401).json({ message: 'Not authorized, no token' });
//     }
// };

// // Admin middleware
// const admin = (req, res, next) => {
//     if (req.user && req.user.isAdmin) {
//         next();
//     } else {
//         res.status(401).json({ message: 'Not authorized as an admin' });
//     }
// };

// // Seller middleware
// const isSeller = async (req, res, next) => {
//     try {
//         const seller = await User.findById(req.user.id);
//         if (seller && seller.isSeller) {
//             next();
//         } else {
//             res.status(403).json({ message: 'Seller authorization required' });
//         }
//     } catch (err) {
//         res.status(500).json({ message: 'Server error' });
//     }
// };

// module.exports = { userAuth,sellerAuth,adminAuth, admin, isSeller };
