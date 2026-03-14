const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');

router.route('/')
    .get(recommendationController.getRecommendations);

router.route('/view')
    .post(recommendationController.recordView);

module.exports = router;
