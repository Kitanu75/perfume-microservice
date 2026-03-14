const express = require('express');
const router = express.Router();
const currencyController = require('../controllers/currencyController');

router.route('/')
    .get(currencyController.getCurrencies);

router.route('/rates')
    .get(currencyController.getRates)
    .post(currencyController.upsertRate);

router.route('/convert')
    .post(currencyController.convertCurrency);

module.exports = router;
