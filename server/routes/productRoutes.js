const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  getProductFilterMeta,
  validateCart
} = require('../controllers/productController');

router.get('/', getProducts);
router.get('/filters/meta', getProductFilterMeta);
router.post('/validate-cart', validateCart);
router.get('/:id', getProductById);

module.exports = router;
