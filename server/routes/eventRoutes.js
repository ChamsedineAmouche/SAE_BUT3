const express = require('express');
const router = express.Router();
const { getEventPageData } = require('../controllers/eventController');
const { inscriptionEvent } = require('../controllers/eventController')
const {catalogEvent} = require("../controllers/catalogEventController");
const {desinscriptionEvent} = require("../controllers/eventController");

router.get('/event', getEventPageData);
router.get('/inscriptionEvent',inscriptionEvent);
router.get('/desinscriptionEvent',desinscriptionEvent);
router.get('/catalogEvent', catalogEvent);
module.exports = router;