const express = require('express');
const router = express.Router();
const {
    getAllDiscussions, getDiscussion, insertDiscussion, insertMessage, reportMessage, validateMessage,
    getReportedMessage
} = require('../controllers/forumController');

router.get('/forum', getAllDiscussions)
router.get('/discussion', getDiscussion)
router.get('/reportMessage', reportMessage)
router.get('/validateMessage', validateMessage)
router.post('/insertDiscussion', insertDiscussion)
router.post('/insertMessage', insertMessage)
router.get('/getReportedMessages', getReportedMessage)

module.exports = router; 