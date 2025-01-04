const express = require('express');
const router = express.Router();
const { getEventPageData } = require('../controllers/eventController');
const { inscriptionEvent } = require('../controllers/eventController')

router.get('/event', getEventPageData);
router.get('/inscriptionEvent',inscriptionEvent);

module.exports = router;