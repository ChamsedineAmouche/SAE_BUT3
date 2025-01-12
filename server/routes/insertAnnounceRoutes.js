const express = require('express');
const router = express.Router();
const { verifyJWT } = require('../controllers/accountController');
const { verifyToken } = require('../account/accountJwtVerify');
const {
    addAnnounce, 
    insert
} = require('../controllers/insertAnnounceController');

router.get('/addAnnounce',addAnnounce)
router.post('/insert',verifyToken, insert)

module.exports = router;