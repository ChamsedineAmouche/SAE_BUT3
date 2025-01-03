const express = require('express');
const router = express.Router();
const { getEventPageData } = require('../controllers/eventController');

router.get('/event', getEventPageData);

module.exports = router;