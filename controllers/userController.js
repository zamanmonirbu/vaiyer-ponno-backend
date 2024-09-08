const User = require('../models/User');

const getUserProfile = async (req, res) => {
    const { id } = req.params;
    // console.log(id);
  
    try {
      // Find user by ID and exclude password from the result
      const user = await User.findById(id).select('-password');
  
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  

// Update user profile by ID
const updateUserProfile = async (req, res) => {
    const { id } = req.params;  // Get the user ID from the request params

    try {
        const user = await User.findById(id);  // Find the user by ID

        if (user) {
            // Update the user's profile fields if provided, otherwise keep the current values
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.address = req.body.address || user.address;
            user.image = req.body.image || user.image;

            // Save the updated user
            const updatedUser = await user.save();

            // Return the updated user profile (without password)
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                address: updatedUser.address,
                image: updatedUser.image,
                
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


module.exports = { getUserProfile, updateUserProfile };
