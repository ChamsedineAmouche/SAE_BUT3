const express = require('express');
const router = express.Router();
const { catalog } = require('../controllers/catalogController');
const { catalogEvent } = require('../controllers/catalogEventController');

router.get('/catalog', catalog);
router.get('/catalogEvent', catalogEvent);

module.exports = router;