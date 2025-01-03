const express = require('express');
const multer = require('multer'); // Required for handling file uploads
const router = express.Router();
const productController = require('../Controller/productController');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


// Route to count products
router.get('/count-products', productController.countProducts);

// Route to create a new product, including image upload
router.post('/', upload.fields([
    { name: "image" },

  ]),productController.createProduct);

// Route to get all products
router.get('/', productController.getAllProducts);

// Route to get a single product by ID
router.get('/:id', productController.getProduct);

// Route to update a product by ID, including image upload
router.put('/:id', upload.single('image'), productController.updateProduct);

// Route to delete a product by ID
router.delete('/:id', productController.deleteProduct);

module.exports = router;
