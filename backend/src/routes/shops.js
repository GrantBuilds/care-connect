// src/routes/shops.js
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const QRCode = require('qrcode');
const jwt = require('jsonwebtoken');
const prisma = require('../db/prisma');
const authenticateToken = require('../middleware/auth');
const requireShopOwnership = require('../middleware/requireShopOwnership');
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

  // Sign a token tied to this specific shop
  const shopToken = jwt.sign(
    { shop_id: shopId },
    process.env.JWT_SECRET,
    { expiresIn: '1y' }
  );

  // Embed the signed token in the QR code URL
  const shopUrl = `${req.protocol}://${req.get('host')}/rate/${shopId}?token=${shopToken}`;

  await QRCode.toFile(filePath, shopUrl, {
    type: 'png',
    width: 300,
    margin: 2,
    color: { dark: '#000000', light: '#ffffff' }
  });

  // Return the publicly accessible URL of the QR image itself
  return `${req.protocol}://${req.get('host')}/uploads/qrcodes/${filename}`;
}

// -----------------------------------------------
// GET /shops — Get all shops (managers only)
// -----------------------------------------------
router.get('/', authenticateToken, async (req, res) => {
  try {
    const shops = await prisma.shops.findMany({
      include: {
        managers: true,
        workers: true
      }
    });
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
// GET /shops/:shopId/qr — Get QR code for a shop (manager only, must own shop)
// -----------------------------------------------
router.get('/:shopId/qr', authenticateToken, requireShopOwnership, async (req, res) => {
  const shopId = req.shop.shop_id;

  try {
    const filename = `shop_${shopId}_qr.png`;
    const filePath = path.join(QR_DIR, filename);

    // If QR file doesn't exist yet, generate it on-demand
    if (!fs.existsSync(filePath)) {
      const shopToken = jwt.sign(
        { shop_id: shopId },
        process.env.JWT_SECRET,
        { expiresIn: '1y' }
      );

      const shopUrl = `${req.protocol}://${req.get('host')}/rate/${shopId}?token=${shopToken}`;

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
// GET /shops/:shopId — Get shop by ID with average ratings (manager only)
// -----------------------------------------------
router.get('/:shopId', authenticateToken, requireShopOwnership, async (req, res) => {
  try {
    const shop = await prisma.shops.findUnique({
      where: { shop_id: req.shop.shop_id },
      include: {
        managers: true,
        workers: {
          include: { ratings: true }
        }
      }
    });

    // Collect all ratings across all workers in this shop
    const allRatings = shop.workers.flatMap(worker => worker.ratings);

    // Calculate shop average rating
    const shopAverage = allRatings.length > 0
      ? allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length
      : null;

    // Calculate per-worker average rating
    const workersWithAverage = shop.workers.map(worker => {
      const workerAvg = worker.ratings.length > 0
        ? worker.ratings.reduce((sum, r) => sum + r.rating, 0) / worker.ratings.length
        : null;

      return {
        ...worker,
        average_rating: workerAvg ? parseFloat(workerAvg.toFixed(1)) : null,
        total_ratings: worker.ratings.length
      };
    });

    res.json({
      ...shop,
      workers: workersWithAverage,
      shop_average_rating: shopAverage ? parseFloat(shopAverage.toFixed(1)) : null,
      total_ratings: allRatings.length
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// -----------------------------------------------
// POST /shops — Create shop + auto-generate QR code (manager only)
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

    // Step 2: Generate QR code with signed token using the new shop's ID
    const qrUrl = await generateShopQRCode(shop.shop_id, req);

    // Step 3: Save the QR code image URL back to the database
    const updatedShop = await prisma.shops.update({
      where: { shop_id: shop.shop_id },
      data: { qr_code_link: qrUrl }
    });

    res.status(201).json(updatedShop);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// -----------------------------------------------
// PUT /shops/:shopId — Update a shop (manager only, must own shop)
// -----------------------------------------------
router.put('/:shopId', authenticateToken, requireShopOwnership, updateShopValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, location } = req.body;

  try {
    const updatedShop = await prisma.shops.update({
      where: { shop_id: req.shop.shop_id },
      data: {
        ...(name && { name }),
        ...(location !== undefined && { location })
      }
    });

    res.json(updatedShop);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// -----------------------------------------------
// DELETE /shops/:shopId — Delete a shop (manager only, must own shop)
// -----------------------------------------------
router.delete('/:shopId', authenticateToken, requireShopOwnership, async (req, res) => {
  const shopId = req.shop.shop_id;

  try {
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