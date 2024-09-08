const mongoose = require("mongoose");

const offerBannerSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
},
{ timestamps: true });

const OfferBanner = mongoose.model("OfferBanner", offerBannerSchema);

module.exports = OfferBanner;
