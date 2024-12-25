const express = require('express');
const router = express.Router();
const {
    image
} = require('../controllers/imageController');

router.get('/image',image)

module.exports = router;