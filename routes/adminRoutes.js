const express = require('express');
const router = express.Router();
const { loginAdmin, registerAdmin } = require('../controllers/adminController');

// Route to login admin
router.post('/login', loginAdmin);

// Route to register admin
router.post('/register', registerAdmin);

module.exports = router;
