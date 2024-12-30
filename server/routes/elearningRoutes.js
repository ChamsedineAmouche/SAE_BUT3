const express = require('express');
const router = express.Router();
const { elearningList, addElearningFavorite, deleteElearningFavorite } = require('../controllers/elearningController');

router.get('/elearningList', elearningList);
router.get('/addElearningFavorite', addElearningFavorite);
router.get('/deleteElearningFavorite', deleteElearningFavorite);

module.exports = router;