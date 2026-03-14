const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.route('/')
    .get(orderController.getOrders)
    .post(orderController.createOrder);

router.route('/:id')
    .get(orderController.getOrder);

router.route('/:id/status')
    .put(orderController.updateOrderStatus);

module.exports = router;
