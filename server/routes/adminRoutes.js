const express = require('express');
const {insertEvent, insertArticle, deleteEvent, deleteArticle} = require("../controllers/adminController");
const router = express.Router();

router.get('/insertEventAdmin', insertEvent);
router.get('/insertArticleAdmin', insertArticle);
router.get('/deleteEventAdmin', deleteEvent);
router.get('/deleteArticleAdmin', deleteArticle)

module.exports = router;