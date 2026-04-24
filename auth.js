const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Session = require('../models/Session');

// Middleware to authenticate JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Authentication error' });
  }
};

// Middleware to verify refresh token
const verifyRefreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const session = await Session.findOne({
      refreshToken,
      user: decoded.userId,
      isActive: true,
    });

    if (!session) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    req.session = session;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Refresh token expired' });
    }
    res.status(401).json({ error: 'Invalid refresh token' });
  }
};

// Middleware to check if user is verified
const requireEmailVerification = (req, res, next) => {
  if (!req.user.isEmailVerified) {
    return res.status(403).json({ error: 'Email verification required' });
  }
  next();
};

// Middleware for 2FA verification
const requireTwoFactor = (req, res, next) => {
  if (req.user.twoFactorEnabled && !req.user.twoFactorVerified) {
    return res.status(403).json({ error: '2FA verification required' });
  }
  next();
};

// Middleware to check account lock
const checkAccountLock = (req, res, next) => {
  if (req.user.isLocked) {
    return res.status(423).json({ error: 'Account is locked due to too many failed login attempts' });
  }
  next();
};

module.exports = {
  authenticateToken,
  verifyRefreshToken,
  requireEmailVerification,
  requireTwoFactor,
  checkAccountLock,
};