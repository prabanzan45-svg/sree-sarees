const mongoose = require('mongoose');

const blouseEnquirySchema = new mongoose.Schema({
  enquiryId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  fullName: {
    type: String,
    required: [true, 'Please provide customer full name'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Please provide contact phone / WhatsApp number'],
    trim: true
  },
  email: {
    type: String,
    trim: true,
    default: ''
  },
  preferredContactMethod: {
    type: String,
    enum: ['WhatsApp', 'Phone Call', 'Email'],
    default: 'WhatsApp'
  },

  // Material Information
  customerProvidingMaterial: {
    type: String,
    enum: ['YES_CUSTOMER_PROVIDES', 'NO_BOUTIQUE_PROVIDES', 'NEED_GUIDANCE'],
    default: 'YES_CUSTOMER_PROVIDES'
  },
  materialType: {
    type: String,
    trim: true,
    default: 'Pure Silk'
  },
  materialColour: {
    type: String,
    trim: true,
    default: ''
  },
  materialDetails: {
    type: String,
    trim: true,
    default: ''
  },

  // Measurements
  sizeCategory: {
    type: String,
    default: 'Custom'
  },
  measurements: {
    bust: { type: String, default: '' },
    underBust: { type: String, default: '' },
    shoulder: { type: String, default: '' },
    blouseLength: { type: String, default: '' },
    sleeveLength: { type: String, default: '' },
    armhole: { type: String, default: '' },
    frontNeckDepth: { type: String, default: '' },
    backNeckDepth: { type: String, default: '' },
    waist: { type: String, default: '' },
    units: { type: String, default: 'Inches' },
    needMeasurementAssistance: { type: Boolean, default: false }
  },

  // Pattern & Design Preferences
  pattern: {
    type: String,
    default: 'Princess Cut'
  },
  necklineDesign: {
    type: String,
    default: 'Classic Round Neck'
  },
  sleeveDesign: {
    type: String,
    default: 'Elbow Length'
  },
  backDesign: {
    type: String,
    default: 'Deep U-Back with Dori'
  },
  embroideryWork: {
    type: String,
    default: 'None / Plain Piping'
  },
  additionalInstructions: {
    type: String,
    default: ''
  },
  referenceImageUrl: {
    type: String,
    default: ''
  },

  // Schedule & Quotation
  requiredByDate: {
    type: String,
    default: ''
  },
  additionalNotes: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['NEW', 'CONTACTED', 'QUOTATION_SENT', 'CONFIRMED', 'COMPLETED', 'CANCELLED'],
    default: 'NEW'
  },
  ownerNotes: {
    type: String,
    default: ''
  },
  quotedPrice: {
    type: Number,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('BlouseEnquiry', blouseEnquirySchema);
