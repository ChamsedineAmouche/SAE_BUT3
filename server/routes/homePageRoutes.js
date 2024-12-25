const express = require('express');
const router = express.Router();
const { getHomepageData } = require('../controllers/homepageController');

router.get('/homepage', getHomepageData);

module.exports = router;