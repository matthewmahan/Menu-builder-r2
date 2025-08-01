const express = require('express');
const QRCode = require('qrcode');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const Menu = require('../models/Menu');
const router = express.Router();

// Helper function to ensure uploads directory exists
const ensureUploadsDir = async () => {
  const uploadsDir = path.join(__dirname, '..', 'uploads', 'qr');
  try {
    await fs.access(uploadsDir);
  } catch {
    await fs.mkdir(uploadsDir, { recursive: true });
  }
  return uploadsDir;
};

// GET /api/qr/:menuId - Generate QR code for menu
router.get('/:menuId', async (req, res) => {
  try {
    const { menuId } = req.params;
    const { format = 'png', size = 256, logo = false } = req.query;

    // Find the menu
    const menu = await Menu.findById(menuId);
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    // Generate the public URL
    const publicUrl = menu.publicUrl;

    // QR code options
    const qrOptions = {
      type: format === 'svg' ? 'svg' : 'png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: parseInt(size)
    };

    if (format === 'svg') {
      // Generate SVG QR code
      const qrSvg = await QRCode.toString(publicUrl, { ...qrOptions, type: 'svg' });
      
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Content-Disposition', `inline; filename="menu-qr-${menu.shortUrl}.svg"`);
      res.send(qrSvg);
    } else {
      // Generate PNG QR code
      const qrBuffer = await QRCode.toBuffer(publicUrl, qrOptions);

      if (logo && menu.logo) {
        // Add logo to center of QR code
        try {
          const logoPath = path.join(__dirname, '..', menu.logo);
          const logoBuffer = await fs.readFile(logoPath);
          
          const logoSize = Math.floor(parseInt(size) * 0.2); // Logo should be 20% of QR code size
          
          const processedLogo = await sharp(logoBuffer)
            .resize(logoSize, logoSize, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
            .png()
            .toBuffer();

          const finalQR = await sharp(qrBuffer)
            .composite([{
              input: processedLogo,
              gravity: 'center'
            }])
            .png()
            .toBuffer();

          res.setHeader('Content-Type', 'image/png');
          res.setHeader('Content-Disposition', `inline; filename="menu-qr-${menu.shortUrl}.png"`);
          res.send(finalQR);
        } catch (logoError) {
          console.error('Error adding logo to QR code:', logoError);
          // Fallback to QR code without logo
          res.setHeader('Content-Type', 'image/png');
          res.setHeader('Content-Disposition', `inline; filename="menu-qr-${menu.shortUrl}.png"`);
          res.send(qrBuffer);
        }
      } else {
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', `inline; filename="menu-qr-${menu.shortUrl}.png"`);
        res.send(qrBuffer);
      }
    }
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ message: 'Failed to generate QR code' });
  }
});

// POST /api/qr/:menuId/save - Save QR code to menu
router.post('/:menuId/save', async (req, res) => {
  try {
    const { menuId } = req.params;
    const { format = 'png', size = 256, logo = false } = req.body;

    // Find the menu
    const menu = await Menu.findById(menuId);
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    // Ensure uploads directory exists
    const uploadsDir = await ensureUploadsDir();

    // Generate the public URL
    const publicUrl = menu.publicUrl;

    // QR code options
    const qrOptions = {
      type: format === 'svg' ? 'svg' : 'png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: parseInt(size)
    };

    const filename = `menu-qr-${menu.shortUrl}-${Date.now()}.${format}`;
    const filepath = path.join(uploadsDir, filename);

    if (format === 'svg') {
      // Generate and save SVG QR code
      const qrSvg = await QRCode.toString(publicUrl, { ...qrOptions, type: 'svg' });
      await fs.writeFile(filepath, qrSvg);
    } else {
      // Generate PNG QR code
      let qrBuffer = await QRCode.toBuffer(publicUrl, qrOptions);

      if (logo && menu.logo) {
        // Add logo to center of QR code
        try {
          const logoPath = path.join(__dirname, '..', menu.logo);
          const logoBuffer = await fs.readFile(logoPath);
          
          const logoSize = Math.floor(parseInt(size) * 0.2);
          
          const processedLogo = await sharp(logoBuffer)
            .resize(logoSize, logoSize, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
            .png()
            .toBuffer();

          qrBuffer = await sharp(qrBuffer)
            .composite([{
              input: processedLogo,
              gravity: 'center'
            }])
            .png()
            .toBuffer();
        } catch (logoError) {
          console.error('Error adding logo to QR code:', logoError);
          // Continue with QR code without logo
        }
      }

      await fs.writeFile(filepath, qrBuffer);
    }

    // Update menu with QR code path
    const relativePath = `uploads/qr/${filename}`;
    menu.qrCode = relativePath;
    await menu.save();

    res.json({
      message: 'QR code saved successfully',
      qrCode: relativePath,
      downloadUrl: `/api/qr/${menuId}/download`
    });
  } catch (error) {
    console.error('Error saving QR code:', error);
    res.status(500).json({ message: 'Failed to save QR code' });
  }
});

// GET /api/qr/:menuId/download - Download saved QR code
router.get('/:menuId/download', async (req, res) => {
  try {
    const { menuId } = req.params;

    // Find the menu
    const menu = await Menu.findById(menuId);
    if (!menu || !menu.qrCode) {
      return res.status(404).json({ message: 'QR code not found' });
    }

    const filepath = path.join(__dirname, '..', menu.qrCode);
    
    try {
      await fs.access(filepath);
      
      const ext = path.extname(menu.qrCode).toLowerCase();
      const contentType = ext === '.svg' ? 'image/svg+xml' : 'image/png';
      
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="menu-qr-${menu.shortUrl}${ext}"`);
      
      const fileBuffer = await fs.readFile(filepath);
      res.send(fileBuffer);
    } catch (fileError) {
      res.status(404).json({ message: 'QR code file not found' });
    }
  } catch (error) {
    console.error('Error downloading QR code:', error);
    res.status(500).json({ message: 'Failed to download QR code' });
  }
});

// POST /api/qr/:menuId/regenerate - Regenerate QR code with new short URL
router.post('/:menuId/regenerate', async (req, res) => {
  try {
    const { menuId } = req.params;
    const { nanoid } = require('nanoid');

    // Find the menu
    const menu = await Menu.findById(menuId);
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    // Generate new short URL
    let newShortUrl;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      newShortUrl = nanoid(8);
      attempts++;
      
      if (attempts > maxAttempts) {
        return res.status(500).json({ message: 'Failed to generate unique short URL' });
      }
      
      const existingMenu = await Menu.findOne({ shortUrl: newShortUrl });
      if (!existingMenu) break;
    } while (attempts <= maxAttempts);

    // Update menu with new short URL
    menu.shortUrl = newShortUrl;
    
    // Clear old QR code
    if (menu.qrCode) {
      try {
        const oldQrPath = path.join(__dirname, '..', menu.qrCode);
        await fs.unlink(oldQrPath);
      } catch (unlinkError) {
        console.error('Error deleting old QR code:', unlinkError);
      }
      menu.qrCode = null;
    }

    await menu.save();

    res.json({
      message: 'Short URL regenerated successfully',
      shortUrl: newShortUrl,
      publicUrl: menu.publicUrl
    });
  } catch (error) {
    console.error('Error regenerating QR code:', error);
    res.status(500).json({ message: 'Failed to regenerate QR code' });
  }
});

// GET /api/qr/:menuId/info - Get QR code information
router.get('/:menuId/info', async (req, res) => {
  try {
    const { menuId } = req.params;

    // Find the menu
    const menu = await Menu.findById(menuId);
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    res.json({
      shortUrl: menu.shortUrl,
      publicUrl: menu.publicUrl,
      qrCode: menu.qrCode,
      hasQrCode: !!menu.qrCode,
      views: menu.views,
      lastViewedAt: menu.lastViewedAt
    });
  } catch (error) {
    console.error('Error fetching QR code info:', error);
    res.status(500).json({ message: 'Failed to fetch QR code information' });
  }
});

module.exports = router;