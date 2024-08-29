const express = require('express');
const { addOrderItems, getOrderById, updateOrderToPaid, getMyOrders } = require('../controllers/orderController');
const { userAuth } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').post(userAuth, addOrderItems);
router.route('/myorders').get(userAuth, getMyOrders);
router.route('/:id').get(userAuth, getOrderById);
router.route('/:id/pay').put(userAuth, updateOrderToPaid);

module.exports = router;
