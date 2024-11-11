const DeliveryMan = require('../models/DeliveryMan');

const createDeliveryMan = async (req, res) => {
  try {
    const newDeliveryMan = new DeliveryMan(req.body);
    await newDeliveryMan.save();
    res.status(201).json({ message: 'Delivery Man created successfully', newDeliveryMan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllDeliveryMen = async (req, res) => {
  try {
    const deliveryMen = await DeliveryMan.find();
    res.status(200).json(deliveryMen);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createDeliveryMan, getAllDeliveryMen };
