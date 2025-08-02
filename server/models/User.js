const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  businessName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  ownerName: {
    type: String,
    trim: true,
    maxlength: 100
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String,
    default: null
  },
  passwordResetToken: {
    type: String,
    default: null
  },
  passwordResetExpires: {
    type: Date,
    default: null
  },
  onboardingCompleted: {
    type: Boolean,
    default: false
  },
  onboardingStep: {
    type: Number,
    default: 0
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'pro', 'enterprise'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'cancelled', 'past_due'],
      default: 'active'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date,
      default: null
    }
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      marketing: {
        type: Boolean,
        default: false
      }
    },
    timezone: {
      type: String,
      default: 'America/New_York'
    }
  },
  menu: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu',
    default: null
  },
  lastLoginAt: {
    type: Date,
    default: null
  },
  loginCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ businessName: 'text' });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Update login info
userSchema.methods.updateLoginInfo = function() {
  this.lastLoginAt = new Date();
  this.loginCount += 1;
  return this.save();
};

// Check if user can create a menu (only one menu per user)
userSchema.methods.canCreateMenu = async function() {
  return !this.menu; // User can only create a menu if they don't have one
};

// Get user's menu
userSchema.methods.getMenu = async function() {
  if (!this.menu) return null;
  const Menu = mongoose.model('Menu');
  return await Menu.findById(this.menu);
};

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return this.ownerName || this.businessName;
});

// Transform output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.emailVerificationToken;
  delete user.passwordResetToken;
  delete user.passwordResetExpires;
  return user;
};

module.exports = mongoose.model('User', userSchema);