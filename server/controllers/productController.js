const storeAdapter = require('../config/storeAdapter');
const Product = require('../models/Product');
const { isMongoConnected } = require('../config/db');

// @desc    Get all active products with search, filter, and sort
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const { search, category, fabric, colour, minPrice, maxPrice, sort } = req.query;

    if (isMongoConnected()) {
      const filter = { isActive: true };

      if (category && category !== 'All') filter.category = category;
      if (fabric && fabric !== 'All') filter.fabric = new RegExp(fabric, 'i');
      if (colour && colour !== 'All') filter.colour = new RegExp(colour, 'i');

      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
      }

      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { fabric: { $regex: search, $options: 'i' } },
          { colour: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } }
        ];
      }

      let sortOption = { createdAt: -1 };
      if (sort === 'price_asc') sortOption = { price: 1 };
      if (sort === 'price_desc') sortOption = { price: -1 };
      if (sort === 'name_asc') sortOption = { name: 1 };

      const products = await Product.find(filter).sort(sortOption);
      return res.json({
        success: true,
        count: products.length,
        products
      });
    }

    // Fallback store
    const products = storeAdapter.getProducts({
      search,
      category,
      fabric,
      colour,
      minPrice,
      maxPrice,
      sort,
      isActive: true
    });

    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single product by ID or productId
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let product;

    if (isMongoConnected()) {
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        product = await Product.findById(id);
      } else {
        product = await Product.findOne({ productId: id });
      }
    } else {
      product = storeAdapter.findProductById(id);
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Saree not found in catalogue.'
      });
    }

    res.json({
      success: true,
      product
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get dynamic filters metadata (categories, fabrics, colours, price ranges)
// @route   GET /api/products/filters/meta
// @access  Public
const getProductFilterMeta = async (req, res, next) => {
  try {
    const allProducts = isMongoConnected() ? await Product.find({ isActive: true }) : storeAdapter.getProducts({ isActive: true });

    const categories = ['All', 'Silk Sarees', 'Cotton Sarees', 'Bridal Sarees', 'Designer Sarees', 'Party Wear', 'Traditional Sarees'];
    const fabrics = ['All', ...new Set(allProducts.map(p => p.fabric))].filter(Boolean);
    const colours = ['All', ...new Set(allProducts.map(p => p.colour))].filter(Boolean);

    const prices = allProducts.map(p => p.discountPrice || p.price);
    const minPrice = prices.length ? Math.min(...prices) : 0;
    const maxPrice = prices.length ? Math.max(...prices) : 30000;

    res.json({
      success: true,
      categories,
      fabrics,
      colours,
      priceRange: { min: minPrice, max: maxPrice }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Validate cart items against live stock and prices
// @route   POST /api/products/validate-cart
// @access  Public
const validateCart = async (req, res, next) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No items in cart to validate.'
      });
    }

    const validatedItems = [];
    let subtotal = 0;
    const issues = [];

    for (const item of items) {
      const prodId = item.productId || item._id;
      let prod;

      if (isMongoConnected()) {
        prod = (prodId.match(/^[0-9a-fA-F]{24}$/)) ? await Product.findById(prodId) : await Product.findOne({ productId: prodId });
      } else {
        prod = storeAdapter.findProductById(prodId);
      }

      if (!prod || !prod.isActive) {
        issues.push({
          productId: prodId,
          error: 'This saree is no longer available in the boutique.'
        });
        continue;
      }

      const availableStock = prod.stockQuantity;
      const requestedQty = Math.max(1, Number(item.quantity || 1));

      if (availableStock <= 0) {
        issues.push({
          productId: prod.productId,
          name: prod.name,
          error: `"${prod.name}" is currently out of stock.`
        });
        continue;
      }

      const finalQty = Math.min(requestedQty, availableStock);
      if (finalQty < requestedQty) {
        issues.push({
          productId: prod.productId,
          name: prod.name,
          error: `Only ${availableStock} unit(s) available for "${prod.name}". Quantity adjusted.`
        });
      }

      // Use verified current price from database/store (never trust frontend prices)
      const currentPrice = prod.discountPrice || prod.price;
      const itemSubtotal = currentPrice * finalQty;
      subtotal += itemSubtotal;

      validatedItems.push({
        product: prod._id,
        productId: prod.productId,
        name: prod.name,
        price: currentPrice,
        originalPrice: prod.price,
        quantity: finalQty,
        availableStock,
        image: prod.images && prod.images[0] ? prod.images[0] : '',
        fabric: prod.fabric,
        colour: prod.colour,
        subtotal: itemSubtotal
      });
    }

    const deliveryCharge = subtotal >= 5000 ? 0 : (subtotal > 0 ? 150 : 0);
    const finalTotal = subtotal + deliveryCharge;

    res.json({
      success: true,
      items: validatedItems,
      subtotal,
      deliveryCharge,
      finalTotal,
      issues
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProducts,
  getProductById,
  getProductFilterMeta,
  validateCart
};
