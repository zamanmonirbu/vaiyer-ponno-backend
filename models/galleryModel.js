const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    image: String,
    text: String,
    subText: String,
    color: String,
    isMedium: Boolean,
    isLarge: Boolean,
    category:String,
},
{ timestamps: true });

const Gallery = mongoose.model('Gallery', gallerySchema);

module.exports = Gallery;
