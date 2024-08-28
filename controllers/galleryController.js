const Gallery = require('../models/galleryModel');

// Get all gallery items
exports.getAllGalleryItems = async (req, res) => {
    try {
        const galleryItems = await Gallery.find();
        res.json(galleryItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single gallery item by ID
exports.getGalleryItemById = async (req, res) => {
    try {
        const galleryItem = await Gallery.findById(req.params.id);
        if (!galleryItem) return res.status(404).json({ message: 'Gallery item not found' });
        res.json(galleryItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new gallery item
exports.createGalleryItem = async (req, res) => {
    const galleryItem = new Gallery({
        image: req.body.image,
        text: req.body.text,
        subText: req.body.subText,
        color: req.body.bgColor,
        isMedium: req.body.isMedium,
        isLarge: req.body.isLarge,
        category: req.body.category,
        
    });

    try {
        const newGalleryItem = await galleryItem.save();
        res.status(201).json(newGalleryItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update an existing gallery item
exports.updateGalleryItem = async (req, res) => {
    try {
        const updatedGalleryItem = await Gallery.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedGalleryItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a gallery item
exports.deleteGalleryItem = async (req, res) => {
    try {
        await Gallery.findByIdAndDelete(req.params.id);
        res.json({ message: 'Gallery item deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
