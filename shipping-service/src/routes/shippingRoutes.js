const express = require('express');
const router = express.Router();
const shippingController = require('../controllers/shippingController');

router.route('/')
    .get(shippingController.getShipments)
    .post(shippingController.initiateShipment);

router.route('/order/:orderId')
    .get(shippingController.getShipmentByOrder);

router.route('/track/:trackingNumber')
    .get(shippingController.trackShipment);

router.route('/:id/status')
    .put(shippingController.updateStatus);

module.exports = router;
