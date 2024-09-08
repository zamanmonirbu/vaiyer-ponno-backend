const OfferBanner = require("../models/OfferBanner");

// @desc    Get all offer banners
// @route   GET /api/offerbanners
// @access  Public
exports.getOfferBanners = async (req, res) => {
  try {
    const offerBanners = await OfferBanner.find();
    res.status(200).json(offerBanners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single offer banner by ID
// @route   GET /api/offerbanners/:id
// @access  Public
exports.getOfferBannerById = async (req, res) => {
  try {
    const offerBanner = await OfferBanner.findById(req.params.id);
    if (!offerBanner) {
      return res.status(404).json({ message: "OfferBanner not found" });
    }
    res.status(200).json(offerBanner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new offer banner
// @route   POST /api/offerbanners
// @access  Private
exports.createOfferBanner = async (req, res) => {
  const { imageUrl, title, discount, startDate, endDate } = req.body;

  try {
    const newOfferBanner = new OfferBanner({
      imageUrl,
      title,
      discount,
      startDate,
      endDate,
    });

    const savedOfferBanner = await newOfferBanner.save();
    res.status(201).json(savedOfferBanner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an offer banner by ID
// @route   PUT /api/offerbanners/:id
// @access  Private
exports.updateOfferBanner = async (req, res) => {
  const { imageUrl, title, discount, startDate, endDate } = req.body;

  try {
    const updatedOfferBanner = await OfferBanner.findByIdAndUpdate(
      req.params.id,
      { imageUrl, title, discount, startDate, endDate },
      { new: true, runValidators: true }
    );

    if (!updatedOfferBanner) {
      return res.status(404).json({ message: "OfferBanner not found" });
    }

    res.status(200).json(updatedOfferBanner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an offer banner by ID
// @route   DELETE /api/offerbanners/:id
// @access  Private
exports.deleteOfferBanner = async (req, res) => {
  try {
    const offerBanner = await OfferBanner.findByIdAndDelete(req.params.id);

    if (!offerBanner) {
      return res.status(404).json({ message: "OfferBanner not found" });
    }

    res.status(200).json({ message: "OfferBanner deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
