const express = require('express');
const { createCourier,getAllCouriers } = require('../controllers/CourierController');
const router = express.Router();


router.post('/courier', createCourier);
router.get('/couriers', getAllCouriers);

module.exports = router;
