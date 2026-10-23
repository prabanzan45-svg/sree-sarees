const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const {
  createPaymentOrder,
  verifyPayment,
  submitUpiReference,
  getUpiConfig
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    success: false,
    message: 'Too many payment requests from this IP. Please try again later.'
  }
});

router.get('/upi-config', getUpiConfig);
router.post('/create-order', protect, paymentLimiter, createPaymentOrder);
router.post('/verify', protect, paymentLimiter, verifyPayment);
router.post('/submit-upi-ref', protect, submitUpiReference);

module.exports = router;
