const express = require('express');
const { createDeliveryMan, getAllDeliveryMen } = require('../controllers/deliveryManController');
const router = express.Router();

router.post('/', createDeliveryMan);    // POST /api/deliverymen
router.get('/', getAllDeliveryMen);     // GET /api/deliverymen

module.exports = router;
