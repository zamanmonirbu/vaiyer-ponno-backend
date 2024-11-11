const express = require('express');
const { getAllDeliveryMen,createDeliveryMan } = require('../controllers/deliveryManController');
const router = express.Router();


router.post('/deliveryman', createDeliveryMan);
router.get('/deliverymen', getAllDeliveryMen);

module.exports = router;
