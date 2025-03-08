const express = require('express');
const { getNotifs, updateNotif } = require('../controllers/notifController');
const router = express.Router();

router.get('/getNotifs', getNotifs);

router.post('/updateNotif', updateNotif);

module.exports = router;