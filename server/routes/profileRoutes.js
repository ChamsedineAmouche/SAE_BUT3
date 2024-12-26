const express = require('express');
const router = express.Router();
const {
    profile, 
} = require('../controllers/profileController');

router.get('/profile',profile)

module.exports = router;