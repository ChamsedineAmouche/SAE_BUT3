const express = require('express');
const router = express.Router();
const {insertCard , getCards, deleteCard, updateCard, getDefaultCard} = require('../controllers/paymentController');

router.get('/getCards', getCards);
router.get('/getDefaultCard', getDefaultCard);

router.get('/insertCard', insertCard);

router.get('/deleteCard', deleteCard);

router.get('/updateCard', updateCard);

module.exports = router;