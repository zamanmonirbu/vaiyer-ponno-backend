const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const dotenv = require('dotenv');

dotenv.config();

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'Gmail', // You can use other services like SendGrid, Mailgun, etc.
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Request password recovery
const requestPasswordRecovery = asyncHandler(async (req, res) => {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Generate a password reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();

    // Create the reset URL
    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // Send the email
    await transporter.sendMail({
        to: email,
        from: process.env.EMAIL_FROM,
        subject: 'Password Recovery',
        html: `<p>You requested a password reset. Click <a href="${resetURL}">here</a> to reset your password. This link will expire in 1 hour.</p>`,
    });

    res.status(200).json({ message: 'Recovery email sent' });
});

// Reset password
const resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
        passwordResetToken: token,
        passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
        return res.status(400).json({ message: 'Token is invalid or has expired' });
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password has been reset' });
});

module.exports = {
    requestPasswordRecovery,
    resetPassword,
};
