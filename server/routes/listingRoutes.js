const express = require('express');
const router = express.Router();
const { addListingFavorite, deleteListingFavorite } = require('../controllers/listingController');

router.get('/addListingFavorite', addListingFavorite);
router.get('/deleteListingFavorite', deleteListingFavorite);

module.exports = router;