const express = require('express');
const router = express.Router();
const { elearningList, addElearningFavorite, deleteElearningFavorite, elearningPage } = require('../controllers/elearningController');

router.get('/elearningList', elearningList);
router.get('/addElearningFavorite', addElearningFavorite);
router.get('/deleteElearningFavorite', deleteElearningFavorite);
router.get('/elearningPage', elearningPage)
module.exports = router;