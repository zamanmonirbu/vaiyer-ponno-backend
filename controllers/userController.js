const User = require('../models/User');

const getUserProfile = async (req, res) => {
    const { id } = req.params;

    try {
        // Find user by ID and exclude password from the result
        const user = await User.findById(id).select('-password').populate('location');

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

const updateUserProfile = async (req, res) => {
    const { id } = req.params; // Get the user ID from the request params

    try {
        const user = await User.findById(id); // Find the user by ID

        if (user) {
            // Update the user's profile fields if provided, otherwise keep the current values
            user.firstName = req.body.firstName || user.firstName; // Updated to firstName
            user.lastName = req.body.lastName || user.lastName;   // Updated to lastName
            user.email = req.body.email || user.email;
            user.address = req.body.address || user.address;
            user.img = req.body.img || user.img;
            user.mobile = req.body.mobile || user.mobile;

            // Update location if provided
            if (req.body.location) {
                user.location.lat = req.body.location.lat || user.location.lat;
                user.location.lng = req.body.location.lng || user.location.lng;
            }

            // Save the updated user
            const updatedUser = await user.save();

            // Return the updated user profile (without password)
            res.json({
                success: true,
                _id: updatedUser._id,
                firstName: updatedUser.firstName, // Updated to firstName
                lastName: updatedUser.lastName,     // Updated to lastName
                email: updatedUser.email,
                address: updatedUser.address,
                img: updatedUser.img,
                location: updatedUser.location, // Include location in the response
                mobile: updatedUser.mobile,     // Include mobile in the response
            });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

module.exports = { getUserProfile, updateUserProfile };
