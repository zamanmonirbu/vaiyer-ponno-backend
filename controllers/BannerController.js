const Banner = require('../models/BannerModel');

// Add a new banner image URL
exports.addBanner = async (req, res) => {
    try {
        const { imageUrl } = req.body;
        const banner = new Banner({ imageUrl });
        await banner.save();
        res.status(201).json({ message: 'Banner image added successfully', banner });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Get all banner images
exports.getBanners = async (req, res) => {
    try {
        const banners = await Banner.find();
        res.status(200).json(banners);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Delete a banner image
exports.deleteBanner = async (req, res) => {
    try {
        const { id } = req.params;
        await Banner.findByIdAndDelete(id);
        res.status(200).json({ message: 'Banner image deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};
