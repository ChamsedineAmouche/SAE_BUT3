const express = require('express');
const router = express.Router();
const { verifyJWT } = require('../controllers/accountController');
const { verifyToken } = require('../account/accountJwtVerify');
const {getAllDiscussionsOfCompany, getSpecificDiscussions, getChat, insertCompanyDiscussion, insertChat} = require("../controllers/companyChatController");

router.get('/discussionsCompany', getAllDiscussionsOfCompany)
router.get('/specificDiscussion', getSpecificDiscussions)
router.get('/chat', getChat)
router.get('/insertCompanyDiscussion', insertCompanyDiscussion)
router.post('/insertChat', insertChat)

module.exports = router;