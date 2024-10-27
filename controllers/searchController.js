const Seller = require('../models/Seller');

// Search Sellers by name
exports.searchAll = async (req, res) => {
    const { name } = req.query;  // Get 'name' from query params

    try {
        // Search for sellers by name (case-insensitive, partial match)
        const result = await Seller.find({ name: new RegExp(name, 'i') });
        
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching data', error: error.message });
    }
};
