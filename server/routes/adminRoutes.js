const express = require('express');
const router = express.Router();
const {
    allUsers,
    getSusObject,
    deleteDepot,
    deleteELearning,
    allElearning,
    insertEvent, 
    insertArticle, 
    deleteEvent, 
    deleteArticle,
    allEvents,
    allArticles
} = require('../controllers/adminController');

router.get('/allUsers', allUsers);
router.get('/getSusObject', getSusObject)
router.get('/deleteDepot', deleteDepot)
router.get('/deleteELearning', deleteELearning)
router.get('/allElearning', allElearning)

router.get('/insertEventAdmin', insertEvent);
router.get('/insertArticleAdmin', insertArticle);
router.get('/deleteEventAdmin', deleteEvent);
router.get('/deleteArticleAdmin', deleteArticle)
router.get('/allEvents', allEvents)
router.get('/allArticles', allArticles)


module.exports = router;