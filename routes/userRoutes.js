const express = require('express');
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const { userAuth } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/profile/:id')
.get( getUserProfile)
.put(updateUserProfile);

module.exports = router;
