const express = require('express');
const router = express.Router();
const {product, pickProduct} = require('../controllers/productController');
const {reserveProduct, deleteDepotUser} = require('../controllers/productController');

router.get('/product',product);
router.get('/reserveProduct', reserveProduct);
router.get('/pickProduct', pickProduct)
router.get('/deleteDepotUser', deleteDepotUser)

module.exports = router;