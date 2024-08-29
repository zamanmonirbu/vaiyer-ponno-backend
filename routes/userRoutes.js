const express = require('express');
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const { userAuth } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/profile')
.get(userAuth, getUserProfile)
.put(userAuth, updateUserProfile);

module.exports = router;
