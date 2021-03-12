const express = require('express');
const router = express.Router();
const controller = require('../controllers/patient.controller');

router.get('/', controller.index);

router.get('/search', controller.search);

router.get('/create', controller.create);

router.post('/create', controller.post);

router.get('/:id', controller.get);

module.exports = router;