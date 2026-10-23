const mongoose = require('mongoose');

const stockMovementSchema = new mongoose.Schema({
  movementId: {
    type: String,
    required: true,
    unique: true
  },
  productId: {
    type: String,
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  quantityChange: {
    type: Number,
    required: true
  },
  previousStock: {
    type: Number,
    required: true
  },
  newStock: {
    type: Number,
    required: true
  },
  reason: {
    type: String,
    required: true,
    enum: [
      'INITIAL_SEED',
      'ORDER_PURCHASE',
      'ORDER_CANCELLED',
      'RESTOCK',
      'MANUAL_ADJUSTMENT',
      'DAMAGE'
    ]
  },
  relatedOrderNumber: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.StockMovement || mongoose.model('StockMovement', stockMovementSchema);
