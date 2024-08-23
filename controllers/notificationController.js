const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification');

// @desc    Create a new notification
// @route   POST /api/notifications
// @access  Private/Admin
const createNotification = asyncHandler(async (req, res) => {
    const { title, message, recipient } = req.body;

    const notification = new Notification({
        title,
        message,
        recipient,
    });

    const createdNotification = await notification.save();
    res.status(201).json(createdNotification);
});

// @desc    Get all notifications for a user
// @route   GET /api/notifications
// @access  Private
const getUserNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ recipient: req.user._id });
    res.json(notifications);
});

// @desc    Get all notifications (Admin only)
// @route   GET /api/notifications/all
// @access  Private/Admin
const getAllNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({});
    res.json(notifications);
});

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markNotificationAsRead = asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);

    if (notification) {
        notification.isRead = true;
        const updatedNotification = await notification.save();
        res.json(updatedNotification);
    } else {
        res.status(404);
        throw new Error('Notification not found');
    }
});

module.exports = {
    createNotification,
    getUserNotifications,
    getAllNotifications, // Export the new function
    markNotificationAsRead,
};
