const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const upload = require('../middleware/upload');

// Middleware to handle both multipart and JSON
const optionalUpload = (req, res, next) => {
  const contentType = req.get('content-type') || '';
  
  // If multipart, use multer
  if (contentType.includes('multipart/form-data')) {
    return upload.single('image')(req, res, next);
  }
  
  // Otherwise, continue without multer (for JSON with base64)
  next();
};

// GET all products
router.get('/', productController.getAllProducts);

// GET products by category
router.get('/category/:category', productController.getProductsByCategory);

// GET single product by slug
router.get('/:slug', productController.getProductBySlug);

// POST create product (admin only)
router.post('/', optionalUpload, productController.createProduct);

// PUT update product (admin only)
router.put('/:id', optionalUpload, productController.updateProduct);

// DELETE product (admin only)
router.delete('/:id', productController.deleteProduct);

module.exports = router;
