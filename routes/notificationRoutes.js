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

const { adminAuth, userAuth } = require('../middleware/authMiddleware');
const router = express.Router();


// Public routes
router.route('/public').get(getPublicNotifications);  // Get all public notifications

// Admin routes
router.route('/')
    .post(adminAuth, createNotification)  // Create notification
    .get(adminAuth, getAllNotifications);  // Get all notifications for admin

router.route('/:id')
    .get(adminAuth, getNotificationById)   // Get a single notification
    .put(adminAuth, updateNotification)    // Update a notification
    .delete(adminAuth, deleteNotification); // Delete a notification



router.route('/user')
    .get(userAuth, getUserNotifications);  // Get notifications for a specific user

router.route('/:id/read')
    .put(userAuth, markNotificationAsRead);  // Mark notification as read

module.exports = router;
