const express = require('express');
const {
    createNotification,
    getAllNotifications,
    getNotificationById,
    updateNotification,
    deleteNotification,
    getPublicNotifications,
    getUserNotifications,
    markNotificationAsRead
} = require('../controllers/notificationController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();


// Public routes
router.route('/public').get(getPublicNotifications);  // Get all public notifications

// Admin routes
router.route('/')
    .post(protect, admin, createNotification)  // Create notification
    .get(protect, admin, getAllNotifications);  // Get all notifications for admin

router.route('/:id')
    .get(protect, admin, getNotificationById)   // Get a single notification
    .put(protect, admin, updateNotification)    // Update a notification
    .delete(protect, admin, deleteNotification); // Delete a notification



router.route('/user')
    .get(protect, getUserNotifications);  // Get notifications for a specific user

router.route('/:id/read')
    .put(protect, markNotificationAsRead);  // Mark notification as read

module.exports = router;
