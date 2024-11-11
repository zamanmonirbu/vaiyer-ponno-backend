const DeliveryMan = require('../models/DeliveryMan');

// Create a new delivery man
const createDeliveryMan = async (req, res) => {
  try {
    const newDeliveryMan = new DeliveryMan(req.body);
    await newDeliveryMan.save();
    res.status(201).json({ message: 'Delivery Man created successfully', newDeliveryMan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all delivery men
const getAllDeliveryMen = async (req, res) => {
  try {
    const deliveryMen = await DeliveryMan.find();
    res.status(200).json(deliveryMen);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports={createDeliveryMan,getAllDeliveryMen}