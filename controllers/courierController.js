const Courier = require('../models/Courier');

const createCourier = async (req, res) => {
  try {
    const newCourier = new Courier(req.body);
    await newCourier.save();
    res.status(201).json({ message: 'Courier created successfully', newCourier });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllCouriers = async (req, res) => {
  try {
    const couriers = await Courier.find();
    res.status(200).json(couriers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createCourier, getAllCouriers };
