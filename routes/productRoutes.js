const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { sellerAuth } = require('../middleware/authMiddleware');

router.get('/search', productController.searchProducts);
router.get('/most-rated-products', productController.getMostRatedProductsByCategory);
// Route to get all products
router.get('/', productController.getAllProducts);

router.get('/high-offer', productController.getProductsWithHighOffer);

// Route to get a single product by ID
router.get('/:id', productController.getProductById);

router.get("/category/:categoryName", productController.getProductsByCategory);

router.get("/suggested/:productId", productController.getSuggestedProducts);



// Route to create a new product
router.post('/',sellerAuth, productController.createProduct);

// Route to update a product by ID
router.put('/:id', productController.updateProduct);

// Route to delete a product by ID
router.delete('/:id', productController.deleteProduct);



module.exports = router;
