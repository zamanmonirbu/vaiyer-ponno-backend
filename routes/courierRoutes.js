const express = require('express');
const { createCourier, getAllCouriers } = require('../controllers/CourierController');
const router = express.Router();

router.post('/', createCourier);    // POST /api/couriers
router.get('/', getAllCouriers);    // GET /api/couriers

module.exports = router;
