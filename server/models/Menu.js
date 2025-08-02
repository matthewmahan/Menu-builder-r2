const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  image: {
    type: String,
    default: null
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  allergens: [{
    type: String,
    enum: ['gluten', 'dairy', 'nuts', 'soy', 'eggs', 'shellfish', 'fish', 'sesame']
  }],
  spiceLevel: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  isVegan: {
    type: Boolean,
    default: false
  },
  isVegetarian: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const scheduleSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  },
  isOpen: {
    type: Boolean,
    default: true
  },
  openTime: {
    type: String,
    default: '09:00'
  },
  closeTime: {
    type: String,
    default: '17:00'
  }
});

const themeSchema = new mongoose.Schema({
  primaryColor: {
    type: String,
    default: '#2563eb'
  },
  secondaryColor: {
    type: String,
    default: '#64748b'
  },
  backgroundColor: {
    type: String,
    default: '#ffffff'
  },
  textColor: {
    type: String,
    default: '#1f2937'
  },
  fontFamily: {
    type: String,
    default: 'Inter, sans-serif'
  }
});

const menuSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  businessName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  tagline: {
    type: String,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  logo: {
    type: String,
    default: null
  },
  items: [menuItemSchema],
  categories: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    order: {
      type: Number,
      default: 0
    }
  }],
  isOpen: {
    type: Boolean,
    default: true
  },
  schedule: [scheduleSchema],
  theme: themeSchema,
  shortUrl: {
    type: String,
    unique: true,
    sparse: true
  },
  qrCode: {
    type: String,
    default: null
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  lastViewedAt: {
    type: Date,
    default: null
  },
  versions: [{
    versionNumber: Number,
    data: mongoose.Schema.Types.Mixed,
    createdAt: {
      type: Date,
      default: Date.now
    },
    description: String
  }],
  currentVersion: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

// Indexes for better performance
menuSchema.index({ shortUrl: 1 });
menuSchema.index({ businessName: 'text', tagline: 'text' });
menuSchema.index({ createdAt: -1 });

// Virtual for public URL
menuSchema.virtual('publicUrl').get(function() {
  return `${process.env.QR_CODE_BASE_URL}/menu/${this.shortUrl || this._id}`;
});

// Method to increment views
menuSchema.methods.incrementViews = function() {
  this.views += 1;
  this.lastViewedAt = new Date();
  return this.save();
};

// Method to create a new version
menuSchema.methods.createVersion = function(description = 'Auto-save') {
  const versionData = {
    businessName: this.businessName,
    tagline: this.tagline,
    description: this.description,
    logo: this.logo,
    items: this.items,
    categories: this.categories,
    theme: this.theme,
    schedule: this.schedule
  };

  this.versions.push({
    versionNumber: this.currentVersion,
    data: versionData,
    description
  });

  this.currentVersion += 1;

  // Keep only last 10 versions
  if (this.versions.length > 10) {
    this.versions = this.versions.slice(-10);
  }

  return this.save();
};

// Method to restore from version
menuSchema.methods.restoreFromVersion = function(versionNumber) {
  const version = this.versions.find(v => v.versionNumber === versionNumber);
  if (!version) {
    throw new Error('Version not found');
  }

  const data = version.data;
  this.businessName = data.businessName;
  this.tagline = data.tagline;
  this.description = data.description;
  this.logo = data.logo;
  this.items = data.items;
  this.categories = data.categories;
  this.theme = data.theme;
  this.schedule = data.schedule;

  return this.save();
};

module.exports = mongoose.model('Menu', menuSchema);