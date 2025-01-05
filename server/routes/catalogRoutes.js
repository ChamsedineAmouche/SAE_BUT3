const express = require('express');
const router = express.Router();
const { catalog } = require('../controllers/catalogController');

router.get('/catalog', catalog);

module.exports = router;