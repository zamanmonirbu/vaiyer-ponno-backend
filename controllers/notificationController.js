const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification');

// @desc    Create a new notification
// @route   POST /api/notifications
// @access  Private/Admin
const createNotification = asyncHandler(async (req, res) => {
    const { title, message, recipient, isPublic } = req.body;

    const notification = new Notification({
        title,
        message,
        recipient,
        isPublic
    });

    const createdNotification = await notification.save();
    res.status(201).json(createdNotification);
});

// @desc    Get all notifications (Admin)
// @route   GET /api/notifications
// @access  Private/Admin
const getAllNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({});
    res.json(notifications);
});

// @desc    Get a single notification by ID
// @route   GET /api/notifications/:id
// @access  Private/Admin
const getNotificationById = asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);

    if (notification) {
        res.json(notification);
    } else {
        res.status(404);
        throw new Error('Notification not found');
    }
});

// @desc    Update a notification
// @route   PUT /api/notifications/:id
// @access  Private/Admin
const updateNotification = asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);

    if (notification) {
        notification.title = req.body.title || notification.title;
        notification.message = req.body.message || notification.message;
        notification.recipient = req.body.recipient || notification.recipient;
        notification.isPublic = req.body.isPublic || notification.isPublic;

        const updatedNotification = await notification.save();
        res.json(updatedNotification);
    } else {
        res.status(404);
        throw new Error('Notification not found');
    }
});

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private/Admin
const deleteNotification = asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);

    if (notification) {
        await notification.remove();
        res.json({ message: 'Notification removed' });
    } else {
        res.status(404);
        throw new Error('Notification not found');
    }
});

// @desc    Get all public notifications
// @route   GET /api/notifications/public
// @access  Public
const getPublicNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ isPublic: true });
    res.json(notifications);
});

// @desc    Get all notifications for a specific user
// @route   GET /api/notifications/user
// @access  Private
const getUserNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ recipient: req.user._id });
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
    getAllNotifications,
    getNotificationById,
    updateNotification,
    deleteNotification,
    getPublicNotifications,
    getUserNotifications,
    markNotificationAsRead
};
