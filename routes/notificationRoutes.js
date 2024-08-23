const express = require('express');
const {
    createNotification,
    getUserNotifications,
    markNotificationAsRead,
    getAllNotifications, // Add this import
} = require('../controllers/notificationController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .post(protect, admin, createNotification)
    .get(protect, getUserNotifications); // User notifications

router.route('/all')
    .get(protect, admin, getAllNotifications); // Admin view all notifications

router.put('/:id/read', protect, markNotificationAsRead);

module.exports = router;
