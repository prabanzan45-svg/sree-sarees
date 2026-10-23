const mongoose = require('mongoose');

const aariEnquirySchema = new mongoose.Schema({
  enquiryId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  fullName: {
    type: String,
    required: [true, 'Please provide student / applicant full name'],
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
  preferredFormat: {
    type: String,
    required: [true, 'Please select preferred format (ONLINE_LIVE or OFFLINE_MADURAI)'],
    enum: ['ONLINE_LIVE', 'OFFLINE_MADURAI']
  },
  preferredBatch: {
    type: String,
    default: 'Flexible / To be discussed with owner'
  },
  experienceLevel: {
    type: String,
    enum: [
      'Beginner (No prior experience)',
      'Intermediate (Know basic stitching)',
      'Advanced (Looking to master bridal tracing & zardozi)'
    ],
    default: 'Beginner (No prior experience)'
  },
  questionsOrNotes: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['NEW', 'CONTACTED', 'ADMITTED', 'CANCELLED'],
    default: 'NEW'
  },
  ownerNotes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AariEnquiry', aariEnquirySchema);
