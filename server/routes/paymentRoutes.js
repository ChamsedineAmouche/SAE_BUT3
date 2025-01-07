const express = require('express');
const router = express.Router();
const {insertCard , getCard, deleteCard, updateCard} = require('../controllers/paymentController');

router.get('/getCard', getCard);

router.get('/insertCard', insertCard);

router.get('/deleteCard', deleteCard);

router.get('/updateCard', updateCard);

module.exports = router;