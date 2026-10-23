const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { handleAIChat } = require('../controllers/aiController');

// Rate limiting for AI queries
const aiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 queries per minute per IP
  message: {
    success: false,
    message: 'Sree AI is receiving many questions right now. Please wait a moment.'
  }
});

router.post('/chat', aiLimiter, handleAIChat);

module.exports = router;
