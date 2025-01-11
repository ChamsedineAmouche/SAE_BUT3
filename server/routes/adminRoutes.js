const express = require('express');
const router = express.Router();
const {
    allUsers,
    getSusObject,
    deleteDepot,
    deleteELearning,
    allElearning
} = require('../controllers/adminController');

router.get('/allUsers', allUsers);
router.get('/getSusObject', getSusObject)
router.get('/deleteDepot', deleteDepot)
router.get('/deleteELearning', deleteELearning)
router.get('/allElearning', allElearning)

module.exports = router;