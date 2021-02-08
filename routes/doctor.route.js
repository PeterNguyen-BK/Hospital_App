const express = require('express');
const router = express.Router();
const DB = require('../config/config');
const controller = require('../controllers/doctor.controller');

router.get('/', controller.index);

router.get('/search', controller.search);

module.exports = router;