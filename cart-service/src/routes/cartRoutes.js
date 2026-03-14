const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// All routes are prefixed with /api/v1/cart/:userId

router.route('/:userId')
    .get(cartController.getCart)
    .delete(cartController.emptyCart);

router.route('/:userId/add')
    .post(cartController.addItem);

router.route('/:userId/items/:productId')
    .put(cartController.updateItem);

module.exports = router;
