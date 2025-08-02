const express = require('express');
const { body, validationResult } = require('express-validator');
const Menu = require('../models/Menu');
const { nanoid } = require('nanoid');
const router = express.Router();

// Validation middleware
const validateMenu = [
  body('businessName').trim().isLength({ min: 1, max: 100 }).withMessage('Business name is required and must be less than 100 characters'),
  body('tagline').optional().trim().isLength({ max: 200 }).withMessage('Tagline must be less than 200 characters'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters')
];

const validateMenuItem = [
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Item name is required and must be less than 100 characters'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
  body('price').isNumeric().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').trim().isLength({ min: 1, max: 50 }).withMessage('Category is required and must be less than 50 characters')
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

// GET /api/menus - Get user's menu (single menu per user)
router.get('/', async (req, res) => {
  try {
    // For now, we'll return all menus to maintain compatibility
    // In a real implementation, you'd get the user from authentication middleware
    const menus = await Menu.find({})
      .select('-versions') // Exclude versions for performance
      .sort({ createdAt: -1 });

    res.json({
      menus,
      totalPages: 1,
      currentPage: 1,
      total: menus.length
    });
  } catch (error) {
    console.error('Error fetching menus:', error);
    res.status(500).json({ message: 'Failed to fetch menus' });
  }
});

// GET /api/menus/:id - Get a specific menu
router.get('/:id', async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    res.json(menu);
  } catch (error) {
    console.error('Error fetching menu:', error);
    res.status(500).json({ message: 'Failed to fetch menu' });
  }
});

// GET /api/menus/public/:shortUrl - Get public menu by short URL
router.get('/public/:shortUrl', async (req, res) => {
  try {
    const menu = await Menu.findOne({ shortUrl: req.params.shortUrl })
      .select('-versions'); // Exclude versions for public view
    
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    // Increment view count
    await menu.incrementViews();

    res.json(menu);
  } catch (error) {
    console.error('Error fetching public menu:', error);
    res.status(500).json({ message: 'Failed to fetch menu' });
  }
});

// POST /api/menus - Create a new menu
router.post('/', validateMenu, handleValidationErrors, async (req, res) => {
  try {
    const menuData = {
      ...req.body,
      shortUrl: nanoid(8), // Generate unique short URL
      currentVersion: 1
    };

    const menu = new Menu(menuData);
    await menu.save();

    // Create initial version
    await menu.createVersion('Initial version');

    res.status(201).json(menu);
  } catch (error) {
    console.error('Error creating menu:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Short URL already exists, please try again' });
    }
    res.status(500).json({ message: 'Failed to create menu' });
  }
});

// PUT /api/menus/:id - Update a menu
router.put('/:id', validateMenu, handleValidationErrors, async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    // Create version before updating
    await menu.createVersion('Auto-save before update');

    // Update menu
    Object.assign(menu, req.body);
    await menu.save();

    res.json(menu);
  } catch (error) {
    console.error('Error updating menu:', error);
    res.status(500).json({ message: 'Failed to update menu' });
  }
});

// DELETE /api/menus/:id - Delete a menu
router.delete('/:id', async (req, res) => {
  try {
    const menu = await Menu.findByIdAndDelete(req.params.id);
    
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    res.json({ message: 'Menu deleted successfully' });
  } catch (error) {
    console.error('Error deleting menu:', error);
    res.status(500).json({ message: 'Failed to delete menu' });
  }
});

// POST /api/menus/:id/items - Add a menu item
router.post('/:id/items', validateMenuItem, handleValidationErrors, async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    // Create version before adding item
    await menu.createVersion('Added new menu item');

    // Add order number if not provided
    if (!req.body.order) {
      req.body.order = menu.items.length;
    }

    menu.items.push(req.body);
    await menu.save();

    res.status(201).json(menu);
  } catch (error) {
    console.error('Error adding menu item:', error);
    res.status(500).json({ message: 'Failed to add menu item' });
  }
});

// PUT /api/menus/:id/items/:itemId - Update a menu item
router.put('/:id/items/:itemId', validateMenuItem, handleValidationErrors, async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    const item = menu.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // Create version before updating
    await menu.createVersion('Updated menu item');

    // Update item
    Object.assign(item, req.body);
    await menu.save();

    res.json(menu);
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({ message: 'Failed to update menu item' });
  }
});

// DELETE /api/menus/:id/items/:itemId - Delete a menu item
router.delete('/:id/items/:itemId', async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    const item = menu.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // Create version before deleting
    await menu.createVersion('Deleted menu item');

    // Remove item
    menu.items.pull(req.params.itemId);
    await menu.save();

    res.json(menu);
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ message: 'Failed to delete menu item' });
  }
});

// PUT /api/menus/:id/items/reorder - Reorder menu items
router.put('/:id/items/reorder', async (req, res) => {
  try {
    const { itemIds } = req.body;
    
    if (!Array.isArray(itemIds)) {
      return res.status(400).json({ message: 'itemIds must be an array' });
    }

    const menu = await Menu.findById(req.params.id);
    
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    // Create version before reordering
    await menu.createVersion('Reordered menu items');

    // Update order for each item
    itemIds.forEach((itemId, index) => {
      const item = menu.items.id(itemId);
      if (item) {
        item.order = index;
      }
    });

    await menu.save();
    res.json(menu);
  } catch (error) {
    console.error('Error reordering menu items:', error);
    res.status(500).json({ message: 'Failed to reorder menu items' });
  }
});

// PUT /api/menus/:id/toggle-status - Toggle open/closed status
router.put('/:id/toggle-status', async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    menu.isOpen = !menu.isOpen;
    await menu.save();

    res.json({ isOpen: menu.isOpen });
  } catch (error) {
    console.error('Error toggling menu status:', error);
    res.status(500).json({ message: 'Failed to toggle menu status' });
  }
});

// GET /api/menus/:id/versions - Get menu versions
router.get('/:id/versions', async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id).select('versions currentVersion');
    
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    res.json({
      versions: menu.versions,
      currentVersion: menu.currentVersion
    });
  } catch (error) {
    console.error('Error fetching menu versions:', error);
    res.status(500).json({ message: 'Failed to fetch menu versions' });
  }
});

// POST /api/menus/:id/restore/:versionNumber - Restore from version
router.post('/:id/restore/:versionNumber', async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    const versionNumber = parseInt(req.params.versionNumber);
    await menu.restoreFromVersion(versionNumber);

    res.json(menu);
  } catch (error) {
    console.error('Error restoring menu version:', error);
    if (error.message === 'Version not found') {
      return res.status(404).json({ message: 'Version not found' });
    }
    res.status(500).json({ message: 'Failed to restore menu version' });
  }
});

module.exports = router;