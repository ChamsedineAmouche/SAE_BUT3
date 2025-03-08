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
    allArticles,
    elearningCategories,
    insertElearning, validateDepot, deleteMessage
} = require('../controllers/adminController');

router.get('/allUsers', allUsers);
router.get('/getSusObject', getSusObject)
router.get('/deleteDepot', deleteDepot)
router.get('/deleteELearning', deleteELearning)
router.get('/allElearning', allElearning)

router.post('/insertEvent', insertEvent);
router.post('/insertArticle', insertArticle);
router.get('/deleteEventAdmin', deleteEvent);
router.get('/deleteArticleAdmin', deleteArticle)
router.get('/allEvents', allEvents)
router.get('/allArticles', allArticles)
router.get('/elearningCategories', elearningCategories)
router.post('/insertElearning', insertElearning)
router.get('/validateDepot', validateDepot)
router.get('/deleteMessage', deleteMessage)

module.exports = router;