const express = require('express');
const router = express.Router();
const {
  submitBlouseEnquiry,
  getBlouseEnquiries,
  submitAariEnquiry,
  getAariEnquiries
} = require('../controllers/enquiryController');

// Blouse stitching
router.post('/blouse', submitBlouseEnquiry);
router.get('/blouse', getBlouseEnquiries);

// Aari work classes
router.post('/aari', submitAariEnquiry);
router.get('/aari', getAariEnquiries);

module.exports = router;
