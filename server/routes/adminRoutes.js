const express = require('express');
const router = express.Router();
const {
    allUsers,
    getSusObject
} = require('../controllers/adminController');

router.get('/allUsers', allUsers);
router.get('/getSusObject', getSusObject)


module.exports = router;