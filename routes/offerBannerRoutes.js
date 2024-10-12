const express = require("express");
const router = express.Router();
const {
  getOfferBanners,
  getOfferBannerById,
  createOfferBanner,
  updateOfferBanner,
  deleteOfferBanner,
} = require("../controllers/offerBannerController");

// Define routes and map them to controller functions
router.route("/offer/banners/").get(getOfferBanners).post(createOfferBanner);
router
  .route("/offer/banners/:id")
  .get(getOfferBannerById)
  .put(updateOfferBanner)
  .delete(deleteOfferBanner);

module.exports = router;
