const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Routes for categories
router.post('/categories', categoryController.createCategory);
router.get('/categories', categoryController.getCategories);
router.get('/categories-with-products', categoryController.getCategoriesWithLimitedProducts);
router.get('/categories/:id', categoryController.getCategoryById);
router.put('/categories/:id', categoryController.updateCategory);
router.delete('/categories/:id', categoryController.deleteCategory);


module.exports = router;
