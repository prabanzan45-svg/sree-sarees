const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Please provide saree name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide product description']
  },
  price: {
    type: Number,
    required: [true, 'Please provide selling price in INR'],
    min: [0, 'Price must be positive']
  },
  discountPrice: {
    type: Number,
    default: null
  },
  isOffer: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    required: [true, 'Please provide main collection'],
    enum: [
      'Cotton Sarees',
      'Silk Sarees',
      'Kalamkari Sarees',
      'Fancy Sarees'
    ]
  },
  fabric: {
    type: String,
    required: [true, 'Please provide fabric type']
  },
  colour: {
    type: String,
    required: [true, 'Please provide colour']
  },
  pattern: {
    type: String,
    default: 'Traditional Handloom Weave'
  },
  sareeLength: {
    type: String,
    default: '5.5 meters'
  },
  blouseDetails: {
    type: String,
    default: '0.8 meter unstitched blouse piece included'
  },
  occasion: {
    type: String,
    default: 'Festive & Traditional'
  },
  images: {
    type: [String],
    required: [true, 'Please provide at least one product image']
  },
  stockQuantity: {
    type: Number,
    required: true,
    default: 10,
    min: [0, 'Stock cannot be negative']
  },
  lowStockThreshold: {
    type: Number,
    default: 3
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.discountPrice && this.discountPrice < this.price) {
    return Math.round(((this.price - this.discountPrice) / this.price) * 100);
  }
  return 0;
});

// Virtual for stock status
productSchema.virtual('stockStatus').get(function() {
  if (this.stockQuantity <= 0) return 'OUT_OF_STOCK';
  if (this.stockQuantity <= this.lowStockThreshold) return 'LOW_STOCK';
  return 'IN_STOCK';
});

module.exports = mongoose.model('Product', productSchema);
