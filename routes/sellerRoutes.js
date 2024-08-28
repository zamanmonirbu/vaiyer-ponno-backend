const express = require('express');
const router = express.Router();
const { loginSeller, registerSeller } = require('../controllers/sellerController');

// Route to login seller
router.post('/login', loginSeller);

// Route to register seller
router.post('/register', registerSeller);

module.exports = router;
