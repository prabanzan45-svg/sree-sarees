const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const storeAdapter = require('../config/storeAdapter');
const User = require('../models/User');
const { isMongoConnected } = require('../config/db');

const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'sree_sarees_super_secret_jwt_key_2026_tradition_woven_elegance',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// @desc    Register a new customer
// @route   POST /api/auth/register
// @access  Public
const registerCustomer = async (req, res, next) => {
  try {
    const { name, email, phone, password, confirmPassword, deliveryAddress = {}, whatsappConsent = true } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, phone, and password.'
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    const emailNormalized = email.toLowerCase().trim();

    // Check existing
    let existingUser;
    if (isMongoConnected()) {
      existingUser = await User.findOne({ email: emailNormalized });
    } else {
      existingUser = storeAdapter.findUserByEmail(emailNormalized);
    }

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please log in.'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userPayload = {
      name: name.trim(),
      email: emailNormalized,
      phone: phone.trim(),
      password: hashedPassword,
      role: 'CUSTOMER', // Strictly locked to CUSTOMER
      deliveryAddress: {
        addressLine: (deliveryAddress.addressLine || '').trim(),
        city: (deliveryAddress.city || '').trim(),
        state: (deliveryAddress.state || 'Tamil Nadu').trim(),
        pincode: (deliveryAddress.pincode || '').trim()
      },
      whatsappConsent: Boolean(whatsappConsent)
    };

    let newUser;
    if (isMongoConnected()) {
      newUser = await User.create(userPayload);
    } else {
      newUser = storeAdapter.createUser(userPayload);
    }

    const token = generateToken(newUser._id || newUser.id, 'CUSTOMER');

    res.status(201).json({
      success: true,
      message: 'Account registered successfully. Welcome to Sree Sarees!',
      token,
      user: {
        id: newUser._id || newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: 'CUSTOMER',
        deliveryAddress: newUser.deliveryAddress,
        whatsappConsent: newUser.whatsappConsent
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Customer Login
// @route   POST /api/auth/login
// @access  Public
const loginCustomer = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.'
      });
    }

    const emailNormalized = email.toLowerCase().trim();
    let user;

    if (isMongoConnected()) {
      user = await User.findOne({ email: emailNormalized }).select('+password');
    } else {
      user = storeAdapter.findUserByEmail(emailNormalized);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Role check: If admin accidentally tries logging in via customer portal, allow or guide
    const token = generateToken(user._id || user.id, user.role || 'CUSTOMER');

    res.json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role || 'CUSTOMER',
        deliveryAddress: user.deliveryAddress || {},
        whatsappConsent: user.whatsappConsent !== false
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get Current User Profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
};

// @desc    Logout User
// @route   POST /api/auth/logout
// @access  Public / Private
const logout = async (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully.'
  });
};

module.exports = {
  registerCustomer,
  loginCustomer,
  getMe,
  logout
};
