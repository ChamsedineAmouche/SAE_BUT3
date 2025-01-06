const express = require('express');
const router = express.Router();
const {verifyToken} = require('../account/accountJwtVerify');
const {
    addAnnounce, 
    insert
} = require('../controllers/insertAnnounceController');

router.get('/addAnnounce',verifyToken,addAnnounce)
router.post('/insert',insert)

module.exports = router;