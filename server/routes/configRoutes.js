const express = require('express');
const router = express.Router();
const { getBusinessConfig } = require('../controllers/enquiryController');

router.get('/business', getBusinessConfig);

module.exports = router;
