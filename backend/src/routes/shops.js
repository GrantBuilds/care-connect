// src/routes/shops.js
const express = require('express');
const router = express.Router();
const prisma = require('../db/prisma');
const authenticateToken = require('../middleware/auth');
const { validationResult } = require('express-validator');
const { createShopValidator, updateShopValidator } = require('../utils/validators');

// Get all shops (public)
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

// Get shop by ID (public)
router.get('/:shopId', async (req, res) => {
  try {
    const shop = await prisma.shops.findUnique({
      where: { shop_id: parseInt(req.params.shopId) },
      include: {
        managers: true,
        workers: {
          include: {
            ratings: true
          }
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

// Create a shop (protected + validated)
router.post('/', authenticateToken, createShopValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, location, qr_code_link } = req.body;
  
  try {
    const shop = await prisma.shops.create({
      data: { 
        name, 
        location, 
        qr_code_link, 
        manager_id: req.manager.manager_id
      }
    });
    console.log('Shop created:', shop);
    res.status(201).json(shop);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a shop (protected + validated)
router.put('/:shopId', authenticateToken, updateShopValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const shopId = parseInt(req.params.shopId);
  const { name, location, qr_code_link } = req.body;

  try {
    // Check if shop exists and belongs to manager
    const shop = await prisma.shops.findUnique({
      where: { shop_id: shopId }
    });

    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    if (shop.manager_id !== req.manager.manager_id) {
      return res.status(403).json({ error: 'You can only update your own shops' });
    }

    // Update shop
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

// Delete a shop (protected)
router.delete('/:shopId', authenticateToken, async (req, res) => {
  const shopId = parseInt(req.params.shopId);

  try {
    // Check if shop exists and belongs to manager
    const shop = await prisma.shops.findUnique({
      where: { shop_id: shopId }
    });

    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    if (shop.manager_id !== req.manager.manager_id) {
      return res.status(403).json({ error: 'You can only delete your own shops' });
    }

    // Delete shop (cascade will delete related workers and ratings)
    await prisma.shops.delete({
      where: { shop_id: shopId }
    });

    res.json({ message: 'Shop deleted successfully', shop_id: shopId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get shops by authenticated manager
router.get('/my-shops', authenticateToken, async (req, res) => {
  try {
    const shops = await prisma.shops.findMany({
      where: { manager_id: req.manager.manager_id },
      include: {
        workers: true
      }
    });
    res.json(shops);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;