const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  productId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  image: {
    type: String
  },
  fabric: {
    type: String
  },
  colour: {
    type: String
  },
  subtotal: {
    type: Number,
    required: true
  }
});

const deliveryAddressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  addressLine: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  customerEmail: {
    type: String,
    required: true
  },
  customerPhone: {
    type: String,
    required: true
  },
  items: [orderItemSchema],
  deliveryAddress: deliveryAddressSchema,
  subtotal: {
    type: Number,
    required: true
  },
  deliveryCharge: {
    type: Number,
    default: 0
  },
  finalTotal: {
    type: Number,
    required: true
  },
  orderStatus: {
    type: String,
    enum: ['Placed', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Placed'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
    default: 'Pending'
  },
  paymentMethod: {
    type: String,
    enum: ['UPI_GATEWAY', 'DIRECT_UPI_QR', 'CASH_ON_DELIVERY'],
    default: 'CASH_ON_DELIVERY'
  },
  paymentReference: {
    type: String,
    default: ''
  },
  whatsappNotifications: {
    ownerSent: { type: Boolean, default: false },
    ownerStatus: { type: String, default: 'Not Attempted' },
    recipient: { type: String, default: '919087637123' },
    messageId: { type: String, default: '' },
    messagePreview: { type: String, default: '' },
    error: { type: String, default: '' },
    updatedAt: { type: Date }
  },
  notes: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);
