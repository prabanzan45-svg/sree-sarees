const jwt = require('jsonwebtoken');
const storeAdapter = require('../config/storeAdapter');
const User = require('../models/User');
const { isMongoConnected } = require('../config/db');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this resource. Please log in.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sree_sarees_super_secret_jwt_key_2026_tradition_woven_elegance');
    let user;

    if (isMongoConnected()) {
      user = await User.findById(decoded.id).select('-password');
    } else {
      user = storeAdapter.findUserById(decoded.id);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.'
      });
    }

    // Attach user object to request
    req.user = {
      _id: user._id || user.id,
      id: user._id || user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    };

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Authentication session expired or invalid. Please log in again.'
    });
  }
};

const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Owner/Administrator privileges required.'
    });
  }
  next();
};

module.exports = {
  protect,
  verifyAdmin
};
