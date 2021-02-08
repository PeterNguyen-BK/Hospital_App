const express = require('express');
const router = express.Router();
const controller = require('../controllers/payment.controller');

router.get('/', controller.index);

router.get('/search', controller.search);

module.exports = router;