// src/routes/shops.js
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const QRCode = require('qrcode');
const prisma = require('../db/prisma');
const authenticateToken = require('../middleware/auth');
const { validationResult } = require('express-validator');
const { createShopValidator, updateShopValidator } = require('../utils/validators');

// Ensure the QR codes directory exists
const QR_DIR = path.join(__dirname, '../../uploads/qrcodes');
if (!fs.existsSync(QR_DIR)) {
  fs.mkdirSync(QR_DIR, { recursive: true });
}

// Helper: generate QR code PNG file for a shop and return its public URL
async function generateShopQRCode(shopId, req) {
  const filename = `shop_${shopId}_qr.png`;
  const filePath = path.join(QR_DIR, filename);

  // The QR code encodes the public-facing rating/profile URL for this shop
  const shopUrl = `${req.protocol}://${req.get('host')}/shops/${shopId}`;

  await QRCode.toFile(filePath, shopUrl, {
    type: 'png',
    width: 300,
    margin: 2,
    color: { dark: '#000000', light: '#ffffff' }
  });

  // Return the publicly accessible URL
  return `${req.protocol}://${req.get('host')}/uploads/qrcodes/${filename}`;
}

// ------------------------------------
// GET /shops — Get all shops (public)
// ------------------------------------
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all shops...');
    const shops = await prisma.shops.findMany({
      include: {
        managers: true,
        workers: true
      }
    });
    console.log('Shops found:', shops.length);
    res.json(shops);
  } catch (err) {
    console.error('Error fetching shops:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// -----------------------------------------------
// GET /shops/my-shops — Get authenticated manager's shops
// -----------------------------------------------
router.get('/my-shops', authenticateToken, async (req, res) => {
  try {
    const shops = await prisma.shops.findMany({
      where: { manager_id: req.manager.manager_id },
      include: { workers: true }
    });
res.json(shops);
  } catch (err) {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
}
});

// -----------------------------------------------
// GET /shops/:shopId/qr — Get QR code for a shop
// -----------------------------------------------
router.get('/:shopId/qr', async (req, res) => {
  const shopId = parseInt(req.params.shopId);

  try {
    const shop = await prisma.shops.findUnique({
      where: { shop_id: shopId }
    });

    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    const filename = `shop_${shopId}_qr.png`;
    const filePath = path.join(QR_DIR, filename);

    // If file doesn't exist yet, generate it on-demand
    if (!fs.existsSync(filePath)) {
      const shopUrl = `${req.protocol}://${req.get('host')}/shops/${shopId}`;
      await QRCode.toFile(filePath, shopUrl, {
        type: 'png',
        width: 300,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' }
      });

      // Update the qr_code_link in the database
      const qrUrl = `${req.protocol}://${req.get('host')}/uploads/qrcodes/${filename}`;
      await prisma.shops.update({
        where: { shop_id: shopId },
        data: { qr_code_link: qrUrl }
      });
    }

    // Stream the PNG file directly as the response
    res.setHeader('Content-Type', 'image/png');
    res.sendFile(filePath);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// -----------------------------------------------
// GET /shops/:shopId — Get shop by ID (public)
// -----------------------------------------------
router.get('/:shopId', async (req, res) => {
  try {
    const shop = await prisma.shops.findUnique({
      where: { shop_id: parseInt(req.params.shopId) },
      include: {
        managers: true,
        workers: {
          include: { ratings: true }
        }
      }
    });

    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    res.json(shop);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// -----------------------------------------------
// POST /shops — Create shop + auto-generate QR code (protected)
// -----------------------------------------------
router.post('/', authenticateToken, createShopValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, location } = req.body;

  try {
    // Step 1: Create the shop (without qr_code_link yet)
    const shop = await prisma.shops.create({
      data: {
        name,
        location,
        manager_id: req.manager.manager_id
      }
    });

    // Step 2: Generate QR code using the new shop's ID
    const qrUrl = await generateShopQRCode(shop.shop_id, req);

    // Step 3: Save the QR code URL back to the database
    const updatedShop = await prisma.shops.update({
      where: { shop_id: shop.shop_id },
      data: { qr_code_link: qrUrl }
    });

    console.log('Shop created with QR code:', updatedShop);
    res.status(201).json(updatedShop);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// -----------------------------------------------
// PUT /shops/:shopId — Update a shop (protected)
// -----------------------------------------------
router.put('/:shopId', authenticateToken, updateShopValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const shopId = parseInt(req.params.shopId);
  const { name, location, qr_code_link } = req.body;

  try {
    const shop = await prisma.shops.findUnique({ where: { shop_id: shopId } });

    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    if (shop.manager_id !== req.manager.manager_id) {
      return res.status(403).json({ error: 'You can only update your own shops' });
    }

    const updatedShop = await prisma.shops.update({
      where: { shop_id: shopId },
      data: {
        ...(name && { name }),
        ...(location !== undefined && { location }),
        ...(qr_code_link !== undefined && { qr_code_link })
      }
    });

    res.json(updatedShop);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// -----------------------------------------------
// DELETE /shops/:shopId — Delete a shop (protected)
// -----------------------------------------------
router.delete('/:shopId', authenticateToken, async (req, res) => {
  const shopId = parseInt(req.params.shopId);

  try {
    const shop = await prisma.shops.findUnique({ where: { shop_id: shopId } });

    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    if (shop.manager_id !== req.manager.manager_id) {
      return res.status(403).json({ error: 'You can only delete your own shops' });
    }

    // Delete the QR code file if it exists
    const qrFile = path.join(QR_DIR, `shop_${shopId}_qr.png`);
    if (fs.existsSync(qrFile)) {
      fs.unlinkSync(qrFile);
    }

    await prisma.shops.delete({ where: { shop_id: shopId } });

    res.json({ message: 'Shop deleted successfully', shop_id: shopId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;