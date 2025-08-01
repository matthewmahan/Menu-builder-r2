const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Menu = require('../models/Menu');
const router = express.Router();

// Validation middleware
const validateRegistration = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('businessName').trim().isLength({ min: 1, max: 100 }).withMessage('Business name is required and must be less than 100 characters'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Validation failed', 
      errors: errors.array() 
    });
  }
  next();
};

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// Middleware to authenticate JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Token authentication error:', error);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// POST /api/users/register - Register a new user
router.post('/register', validateRegistration, handleValidationErrors, async (req, res) => {
  try {
    const { email, businessName, password, ownerName, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user
    const user = new User({
      email,
      businessName,
      password,
      ownerName,
      phone
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Failed to register user' });
  }
});

// POST /api/users/login - Login user
router.post('/login', validateLogin, handleValidationErrors, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Update login info
    await user.updateLoginInfo();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Failed to login' });
  }
});

// GET /api/users/profile - Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    res.json(req.user.toJSON());
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

// PUT /api/users/profile - Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const allowedUpdates = ['businessName', 'ownerName', 'phone', 'preferences'];
    const updates = {};

    // Filter allowed updates
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    // Update user
    Object.assign(req.user, updates);
    await req.user.save();

    res.json({
      message: 'Profile updated successfully',
      user: req.user.toJSON()
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

// PUT /api/users/onboarding - Update onboarding progress
router.put('/onboarding', authenticateToken, async (req, res) => {
  try {
    const { step, completed, data } = req.body;

    if (typeof step === 'number') {
      req.user.onboardingStep = Math.max(req.user.onboardingStep, step);
    }

    if (typeof completed === 'boolean') {
      req.user.onboardingCompleted = completed;
    }

    // Update user data if provided
    if (data && typeof data === 'object') {
      Object.assign(req.user, data);
    }

    await req.user.save();

    res.json({
      message: 'Onboarding updated successfully',
      user: req.user.toJSON()
    });
  } catch (error) {
    console.error('Onboarding update error:', error);
    res.status(500).json({ message: 'Failed to update onboarding' });
  }
});

// GET /api/users/dashboard - Get user dashboard data
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    // Get user's menus
    const menus = await Menu.find({ owner: req.user._id })
      .select('businessName isPublished views lastViewedAt createdAt')
      .sort({ createdAt: -1 });

    // Calculate stats
    const totalMenus = menus.length;
    const publishedMenus = menus.filter(menu => menu.isPublished).length;
    const totalViews = menus.reduce((sum, menu) => sum + menu.views, 0);
    const recentViews = menus.filter(menu => {
      if (!menu.lastViewedAt) return false;
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return menu.lastViewedAt > dayAgo;
    }).length;

    res.json({
      user: req.user.toJSON(),
      stats: {
        totalMenus,
        publishedMenus,
        totalViews,
        recentViews
      },
      menus: menus.slice(0, 5) // Return only first 5 menus for dashboard
    });
  } catch (error) {
    console.error('Dashboard fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
});

// GET /api/users/menus - Get user's menus
router.get('/menus', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const query = { owner: req.user._id };
    
    if (search) {
      query.$text = { $search: search };
    }

    const menus = await Menu.find(query)
      .select('-versions') // Exclude versions for performance
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Menu.countDocuments(query);

    res.json({
      menus,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching user menus:', error);
    res.status(500).json({ message: 'Failed to fetch menus' });
  }
});

// POST /api/users/change-password - Change user password
router.post('/change-password', authenticateToken, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
], handleValidationErrors, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Verify current password
    const isCurrentPasswordValid = await req.user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    req.user.password = newPassword;
    await req.user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ message: 'Failed to change password' });
  }
});

// DELETE /api/users/account - Delete user account
router.delete('/account', authenticateToken, async (req, res) => {
  try {
    // Delete all user's menus
    await Menu.deleteMany({ owner: req.user._id });

    // Delete user account
    await User.findByIdAndDelete(req.user._id);

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Account deletion error:', error);
    res.status(500).json({ message: 'Failed to delete account' });
  }
});

// POST /api/users/verify-token - Verify JWT token
router.post('/verify-token', authenticateToken, (req, res) => {
  res.json({ 
    valid: true, 
    user: req.user.toJSON() 
  });
});

module.exports = router;