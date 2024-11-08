
// controllers/storeController.js

const Store = require('../models/Store');

// Create a new store
exports.createStore = async (req, res) => {
  try {
    const { name, description, address, phone } = req.body;
// console.log(req.seller)
    const sellerId = req.seller._id; 

    // console.log(name, description, address, phone)

    const store = new Store({
      name,
      description,
      sellerId,
      address,
      phone,
    });

    const savedStore = await store.save();
        res.status(201).json(savedStore);
  } catch (error) {
    console.log(error )
    res.status(500).json({ message: 'Error creating store', error });
  }
};

// Get all stores of a seller
exports.getStoresBySeller = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const stores = await Store.find({ sellerId });
    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stores', error });
  }
};

// Get a single store by ID
exports.getStoreById = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id).populate('products');
    if (!store) return res.status(404).json({ message: 'Store not found' });

    res.json(store);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching store', error });
  }
};

// Update a store by ID
exports.updateStore = async (req, res) => {
  try {
    const { name, description, address, phone } = req.body;
    const store = await Store.findByIdAndUpdate(
      req.params.id,
      { name, description, address, phone, updatedAt: Date.now() },
      { new: true }
    );
    if (!store) return res.status(404).json({ message: 'Store not found' });

    res.json(store);
  } catch (error) {
    res.status(500).json({ message: 'Error updating store', error });
  }
};

// Delete a store by ID
exports.deleteStore = async (req, res) => {
  try {
    const store = await Store.findByIdAndDelete(req.params.id);
    if (!store) return res.status(404).json({ message: 'Store not found' });

    res.json({ message: 'Store deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting store', error });
  }
};
