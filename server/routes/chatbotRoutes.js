const express = require('express');
const router = express.Router();
const { chatBot } = require('../controllers/chatBotController');

router.get('/chatbot', chatBot);

module.exports = router;