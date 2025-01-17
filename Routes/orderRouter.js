const express = require('express');
const router = express.Router();
const orderController = require('../Controller/orderController');

router.post('/', orderController.createOrder);
router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrder);
router.get('/user/:userId', orderController.getOrdersByUserId);
router.put('/:id', orderController.updateOrder);
router.delete('/:id', orderController.deleteOrder);

module.exports = router;
