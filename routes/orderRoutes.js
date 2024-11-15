const express = require("express");
const {
  getOrdersByUserId,
  getOrdersBySellerId,
  getOrderByOrderId,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrderById,
  getAllOrders,
  markOrderAsAccepted,
  markOrderAsSentToCourier,
  markOrderAsHandedToDeliveryMan,
  markOrderAsCompleted,
  markOrderAsRejected,
  findOrdersByStatus,
  getOrdersBySellerRejected,
  getOrdersByCompleted,
  getOrdersByHandedToDeliveryMan,
  getOrdersBySentToCourier,
  getOrdersBySellerAccepted,
} = require("../controllers/orderController");
const router = express.Router();

// Route to get orders by user ID
router.get("/user/:userId", getOrdersByUserId);

// Route to get orders by seller ID
router.get("/seller/:sellerId", getOrdersBySellerId);

// Route to get order by  order ID
router.get("/success/:orderId", getOrderByOrderId);

router.get('/orders/status/active', findOrdersByStatus);

router.get('/:sellerId/accept', getOrdersBySellerAccepted);
router.get('/:sellerId/sendToCourier',getOrdersBySentToCourier );
router.get('/:sellerId/handToDeliveryMan', getOrdersByHandedToDeliveryMan);
router.get('/:sellerId/complete', getOrdersByCompleted);
router.get('/:sellerId/reject', getOrdersBySellerRejected);


// Route for creating a new order
router.post("/", createOrder);

// Route for updating an existing order
router.put("/:orderId", updateOrder);

// Route for deleting an existing order
router.delete("/:orderId", deleteOrder);

// Route for getting an order by ID
router.get("/:orderId", getOrderById);

// Route for getting all orders
router.get("/", getAllOrders);



// Define each route for updating the order status timestamps
router.put('/:orderId/accept', markOrderAsAccepted);
router.put('/:orderId/sendToCourier', markOrderAsSentToCourier);
router.put('/:orderId/handToDeliveryMan', markOrderAsHandedToDeliveryMan);
router.put('/:orderId/complete', markOrderAsCompleted);
router.put('/:orderId/reject', markOrderAsRejected);


module.exports = router;
