const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.route('/')
    .get(paymentController.getPayments)
    .post(paymentController.createPayment);

router.route('/order/:orderId')
    .get(paymentController.getPaymentByOrder);

router.route('/:id/refund')
    .post(paymentController.refundPayment);

module.exports = router;
