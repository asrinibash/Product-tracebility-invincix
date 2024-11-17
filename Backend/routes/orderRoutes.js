const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Create a new order
router.post('/create', orderController.createOrder);

// Update order status
router.put('/:orderNumber/status', orderController.updateOrderStatus);

// Get all orders by userId (from_Id or to_Id)
router.get('/user/:userId', orderController.getAllOrdersByUserId);

module.exports = router;
