const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const router = express.Router();

// Helper function to ensure uploads directory exists
const ensureUploadsDir = async (subDir = '') => {
  const uploadsDir = path.join(__dirname, '..', 'uploads', subDir);
  try {
    await fs.access(uploadsDir);
  } catch {
    await fs.mkdir(uploadsDir, { recursive: true });
  }
  return uploadsDir;
};

// Configure multer for file uploads
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Check file type
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB default
  }
});

// POST /api/upload/logo - Upload business logo
router.post('/logo', upload.single('logo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Ensure uploads directory exists
    const uploadsDir = await ensureUploadsDir('logos');

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `logo-${timestamp}.webp`;
    const filepath = path.join(uploadsDir, filename);

    // Process image with Sharp
    await sharp(req.file.buffer)
      .resize(200, 200, { 
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .webp({ quality: 90 })
      .toFile(filepath);

    const relativePath = `uploads/logos/${filename}`;

    res.json({
      message: 'Logo uploaded successfully',
      filename,
      path: relativePath,
      url: `${req.protocol}://${req.get('host')}/${relativePath}`
    });
  } catch (error) {
    console.error('Logo upload error:', error);
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
    }
    res.status(500).json({ message: 'Failed to upload logo' });
  }
});

// POST /api/upload/menu-item - Upload menu item image
router.post('/menu-item', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Ensure uploads directory exists
    const uploadsDir = await ensureUploadsDir('menu-items');

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `menu-item-${timestamp}.webp`;
    const filepath = path.join(uploadsDir, filename);

    // Process image with Sharp
    await sharp(req.file.buffer)
      .resize(400, 300, { 
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: 85 })
      .toFile(filepath);

    const relativePath = `uploads/menu-items/${filename}`;

    res.json({
      message: 'Menu item image uploaded successfully',
      filename,
      path: relativePath,
      url: `${req.protocol}://${req.get('host')}/${relativePath}`
    });
  } catch (error) {
    console.error('Menu item image upload error:', error);
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
    }
    res.status(500).json({ message: 'Failed to upload menu item image' });
  }
});

// POST /api/upload/multiple - Upload multiple images
router.post('/multiple', upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    // Ensure uploads directory exists
    const uploadsDir = await ensureUploadsDir('menu-items');

    const uploadedFiles = [];

    // Process each file
    for (const file of req.files) {
      try {
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substring(2, 8);
        const filename = `menu-item-${timestamp}-${randomSuffix}.webp`;
        const filepath = path.join(uploadsDir, filename);

        // Process image with Sharp
        await sharp(file.buffer)
          .resize(400, 300, { 
            fit: 'cover',
            position: 'center'
          })
          .webp({ quality: 85 })
          .toFile(filepath);

        const relativePath = `uploads/menu-items/${filename}`;

        uploadedFiles.push({
          originalName: file.originalname,
          filename,
          path: relativePath,
          url: `${req.protocol}://${req.get('host')}/${relativePath}`
        });
      } catch (fileError) {
        console.error(`Error processing file ${file.originalname}:`, fileError);
        // Continue with other files
      }
    }

    res.json({
      message: `${uploadedFiles.length} files uploaded successfully`,
      files: uploadedFiles
    });
  } catch (error) {
    console.error('Multiple upload error:', error);
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'One or more files are too large. Maximum size is 5MB per file.' });
    }
    res.status(500).json({ message: 'Failed to upload files' });
  }
});

// DELETE /api/upload/:type/:filename - Delete uploaded file
router.delete('/:type/:filename', async (req, res) => {
  try {
    const { type, filename } = req.params;
    
    // Validate type
    const allowedTypes = ['logos', 'menu-items', 'qr'];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ message: 'Invalid file type' });
    }

    // Validate filename to prevent directory traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({ message: 'Invalid filename' });
    }

    const filepath = path.join(__dirname, '..', 'uploads', type, filename);

    try {
      await fs.access(filepath);
      await fs.unlink(filepath);
      
      res.json({ message: 'File deleted successfully' });
    } catch (fileError) {
      if (fileError.code === 'ENOENT') {
        return res.status(404).json({ message: 'File not found' });
      }
      throw fileError;
    }
  } catch (error) {
    console.error('File deletion error:', error);
    res.status(500).json({ message: 'Failed to delete file' });
  }
});

// GET /api/upload/info/:type/:filename - Get file information
router.get('/info/:type/:filename', async (req, res) => {
  try {
    const { type, filename } = req.params;
    
    // Validate type
    const allowedTypes = ['logos', 'menu-items', 'qr'];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ message: 'Invalid file type' });
    }

    // Validate filename
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({ message: 'Invalid filename' });
    }

    const filepath = path.join(__dirname, '..', 'uploads', type, filename);

    try {
      const stats = await fs.stat(filepath);
      const relativePath = `uploads/${type}/${filename}`;
      
      res.json({
        filename,
        path: relativePath,
        url: `${req.protocol}://${req.get('host')}/${relativePath}`,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime
      });
    } catch (fileError) {
      if (fileError.code === 'ENOENT') {
        return res.status(404).json({ message: 'File not found' });
      }
      throw fileError;
    }
  } catch (error) {
    console.error('File info error:', error);
    res.status(500).json({ message: 'Failed to get file information' });
  }
});

// POST /api/upload/optimize - Optimize existing image
router.post('/optimize', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { width = 400, height = 300, quality = 85, format = 'webp' } = req.body;

    // Ensure uploads directory exists
    const uploadsDir = await ensureUploadsDir('optimized');

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `optimized-${timestamp}.${format}`;
    const filepath = path.join(uploadsDir, filename);

    // Process image with Sharp
    let sharpInstance = sharp(req.file.buffer)
      .resize(parseInt(width), parseInt(height), { 
        fit: 'cover',
        position: 'center'
      });

    // Apply format-specific optimization
    switch (format) {
      case 'webp':
        sharpInstance = sharpInstance.webp({ quality: parseInt(quality) });
        break;
      case 'jpeg':
      case 'jpg':
        sharpInstance = sharpInstance.jpeg({ quality: parseInt(quality) });
        break;
      case 'png':
        sharpInstance = sharpInstance.png({ quality: parseInt(quality) });
        break;
      default:
        sharpInstance = sharpInstance.webp({ quality: parseInt(quality) });
    }

    await sharpInstance.toFile(filepath);

    const relativePath = `uploads/optimized/${filename}`;

    res.json({
      message: 'Image optimized successfully',
      filename,
      path: relativePath,
      url: `${req.protocol}://${req.get('host')}/${relativePath}`,
      settings: {
        width: parseInt(width),
        height: parseInt(height),
        quality: parseInt(quality),
        format
      }
    });
  } catch (error) {
    console.error('Image optimization error:', error);
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
    }
    res.status(500).json({ message: 'Failed to optimize image' });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ message: 'Too many files. Maximum is 10 files.' });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ message: 'Unexpected file field.' });
    }
  }
  
  if (error.message === 'Only image files are allowed') {
    return res.status(400).json({ message: 'Only image files are allowed' });
  }

  next(error);
});

module.exports = router;