const express = require('express');
const router = express.Router();
const {product, pickProduct} = require('../controllers/productController');
const {reserveProduct} = require('../controllers/productController');

router.get('/product',product);
router.get('/reserveProduct', reserveProduct);
router.get('/pickProduct', pickProduct)

module.exports = router;