const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');

router.route('/')
    .get(emailController.getEmails)
    .post(emailController.sendEmail);

router.route('/:id')
    .get(emailController.getEmail);

module.exports = router;
