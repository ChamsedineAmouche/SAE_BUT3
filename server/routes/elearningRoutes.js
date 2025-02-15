const express = require('express');
const router = express.Router();
const { elearningList, addElearningFavorite, deleteElearningFavorite, elearningPage, elearningInfo,elearningInsert } = require('../controllers/elearningController');

router.get('/elearningList', elearningList);
router.get('/addElearningFavorite', addElearningFavorite);
router.get('/deleteElearningFavorite', deleteElearningFavorite);
router.get('/elearningPage', elearningPage)
router.get('/elearningInsert', elearningInsert)
router.get('/elearningInfo', elearningInfo)

module.exports = router;