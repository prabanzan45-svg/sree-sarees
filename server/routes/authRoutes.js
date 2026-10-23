const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const {
  registerCustomer,
  loginCustomer,
  getMe,
  logout
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Rate limiter for authentication endpoints to prevent brute-force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 requests per window
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

router.post('/register', authLimiter, registerCustomer);
router.post('/login', authLimiter, loginCustomer);
router.get('/me', protect, getMe);
router.post('/logout', logout);

module.exports = router;
