const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');

router.route('/')
    .get(checkoutController.getCheckouts)
    .post(checkoutController.initiateCheckout);

router.route('/:id')
    .get(checkoutController.getCheckout);

router.route('/:id/complete')
    .post(checkoutController.markCompleted);

module.exports = router;
