const express = require('express');
const router = express.Router();
const BannerController = require('../controllers/BannerController');

// Route to add a new banner
router.post('/banners', BannerController.addBanner);

// Route to get all banners
router.get('/banners', BannerController.getBanners);

// Route to delete a banner by ID
router.delete('/banners/:id', BannerController.deleteBanner);

module.exports = router;
