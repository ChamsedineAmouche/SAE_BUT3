const express = require('express');
const router = express.Router();
const {product} = require('../controllers/productController');
const {reserveProduct} = require('../controllers/productController');

router.get('/product',product);
router.get('/reserveProduct', reserveProduct);

module.exports = router;