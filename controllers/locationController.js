const Location = require('../models/locationModel');
const User = require('../models/User');

const updateUserLocation = async (req, res) => {
    const { userId, sellerId, lat, lng, city, road, postalCode } = req.body;
    console.log(userId, sellerId, lat, lng, city, road, postalCode);

    try {
        let location;

        // Check whether it's a seller or user request
        if (sellerId) {
            // Find location by sellerId
            location = await Location.findOne({ sellerId });
        } else if (userId) {
            // Find location by userId
            location = await Location.findOne({ userId });
        }

        // If location exists, update it, otherwise create a new one
        if (location) {
            location.lat = lat;
            location.lng = lng;
            location.city = city;
            location.road = road;
            location.postalCode = postalCode;
        } else {
            location = new Location({
                lat,
                lng,
                city,
                road,
                postalCode,
                userId: userId || null, // Set userId if available, otherwise null
                sellerId: sellerId || null, // Set sellerId if available, otherwise null
            });
        }

        await location.save();

        // If it's a user, update the User model with the location reference
        if (userId) {
            const user = await User.findById(userId);
            user.location = location._id;
            await user.save();
        }
        // If it's a seller, update the Seller model with the location reference
        else if (sellerId) {
            const seller = await Seller.findById(sellerId);
            seller.location = location._id;
            await seller.save();
        }

        res.json({ message: 'Location updated successfully', location });
    } catch (error) {
        console.log(error.message);
        res.status(500).json(error.message);
    }
};



// Get user or seller location
const getUserLocation = async (req, res) => {
    const { userId, sellerId } = req.params; // Get userId or sellerId from params

    try {
        let location;

        // Check whether to find location by userId or sellerId
        if (sellerId) {
            location = await Location.findOne({ sellerId });
        } else if (userId) {
            location = await Location.findOne({ userId });
        }

        // If no location is found, return 404 error
        if (!location) {
            return res.status(404).json({ message: 'Location not found' });
        }

        res.json(location); // Return the location
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = { updateUserLocation, getUserLocation };
