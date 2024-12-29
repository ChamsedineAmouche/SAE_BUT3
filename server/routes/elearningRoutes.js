const express = require('express');
const router = express.Router();
const { elearningList } = require('../controllers/elearningController');

router.get('/elearningList', elearningList);

module.exports = router;