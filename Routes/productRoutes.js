const express = require('express');
const router = express.Router();
const productController = require('../Controller/productController');

router.get('/count-products', productController.countProducts);
router.post('/', productController.createProduct);
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
