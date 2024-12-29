const express = require('express');
const router = express.Router();
const {
    product, 
} = require('../controllers/productController');

router.get('/product',product)

module.exports = router;