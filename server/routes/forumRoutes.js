const express = require('express');
const router = express.Router();
const { verifyJWT } = require('../controllers/accountController');
const { verifyToken } = require('../account/accountJwtVerify');
const {
    getAllDiscussions, getDiscussion, insertDiscussion, insertMessage
} = require('../controllers/forumController');

router.get('/forum', getAllDiscussions)
router.get('/discussion', getDiscussion)
router.post('/insertDiscussion', verifyToken, insertDiscussion)
router.post('/insertMessage', verifyToken, insertMessage)

module.exports = router;