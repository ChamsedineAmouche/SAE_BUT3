const express = require('express');
const router = express.Router();
const {
    addAnnounce, 
    insert
} = require('../controllers/insertAnnounceController');

router.get('/addAnnounce',addAnnounce)
router.post('/insert',insert)

module.exports = router;