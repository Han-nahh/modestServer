const express = require('express');
const router = express.Router();
const categoryController = require('../Controller/categoryController');

// Main Categories Routes
router.post('/main', categoryController.createMainCategory);  
router.get('/main', categoryController.getAllMainCategories); 
router.put('/main/:id', categoryController.updateMainCategory); 
router.delete('/main/:id', categoryController.deleteMainCategory); 

// Subcategories Routes
router.post('/subcategory', categoryController.createSubcategory); 
router.get('/subcategory', categoryController.getAllSubcategories); 
router.get('/subcategory/:id', categoryController.getSubcategoryById);
router.put('/subcategory/:id', categoryController.updateSubcategory); 
router.delete('/subcategory/:id', categoryController.deleteSubcategory); 

module.exports = router;
