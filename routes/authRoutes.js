const express = require('express');
const { loginUser, registerUser, refreshToken } = require('../controllers/authController');
const { validateRefreshToken } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);
router.post('/refresh-token',validateRefreshToken, refreshToken);

module.exports = router;
