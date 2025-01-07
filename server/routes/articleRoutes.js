const express = require('express');
const {getArticleList} = require("../controllers/articleListController");
const {getArticlePage} = require("../controllers/articlePageController");
const router = express.Router();

router.get('/articleList', getArticleList)
router.get('/article', getArticlePage)

module.exports = router;