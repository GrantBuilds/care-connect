const upload = require('../config/multer'); 

const express = require('express');
const router = express.Router();
const prisma = require('../db/prisma');
const authenticateToken = require('../middleware/auth');
const { validationResult } = require('express-validator');
const { createWorkerValidator, updateWorkerValidator } = require('../utils/validators');

// Get all workers (public)
router.get('/', async (req, res) => {
  try {
    const workers = await prisma.workers.findMany({
      include: {
        shops: true,
        ratings: true
      }
    });
    res.json(workers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get worker by ID (public)
router.get('/:workerId', async (req, res) => {
  try {
    const worker = await prisma.workers.findUnique({
      where: { worker_id: parseInt(req.params.workerId) },
      include: {
        shops: true,
        ratings: true
      }
    });

    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    res.json(worker);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get workers by shop (public)
router.get('/shop/:shopId', async (req, res) => {
  try {
    const workers = await prisma.workers.findMany({
      where: { shop_id: parseInt(req.params.shopId) },
      include: { ratings: true }
    });
    res.json(workers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a worker (protected + validated)
router.post('/', authenticateToken, createWorkerValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { shop_id, name, role, photo_url } = req.body;
  
  try {
    // Verify the shop belongs to the authenticated manager
    const shop = await prisma.shops.findUnique({
      where: { shop_id }
    });

    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    if (shop.manager_id !== req.manager.manager_id) {
      return res.status(403).json({ error: 'You can only add workers to your own shops' });
    }

    const worker = await prisma.workers.create({
      data: { shop_id, name, role, photo_url }
    });
    res.status(201).json(worker);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a worker (protected + validated)
router.put('/:workerId', authenticateToken, updateWorkerValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const workerId = parseInt(req.params.workerId);
  const { name, role, photo_url } = req.body;

  try {
    // Check if worker exists
    const worker = await prisma.workers.findUnique({
      where: { worker_id: workerId },
      include: { shops: true }
    });

    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    // Verify shop belongs to manager
    if (worker.shops.manager_id !== req.manager.manager_id) {
      return res.status(403).json({ error: 'You can only update workers in your own shops' });
    }

    // Update worker
    const updatedWorker = await prisma.workers.update({
      where: { worker_id: workerId },
      data: {
        ...(name && { name }),
        ...(role !== undefined && { role }),
        ...(photo_url !== undefined && { photo_url })
      }
    });

    res.json(updatedWorker);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a worker (protected)
router.delete('/:workerId', authenticateToken, async (req, res) => {
  const workerId = parseInt(req.params.workerId);

  try {
    // Check if worker exists
    const worker = await prisma.workers.findUnique({
      where: { worker_id: workerId },
      include: { shops: true }
    });

    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    // Verify shop belongs to manager
    if (worker.shops.manager_id !== req.manager.manager_id) {
      return res.status(403).json({ error: 'You can only delete workers from your own shops' });
    }

    // Delete worker (cascade will delete related ratings)
    await prisma.workers.delete({
      where: { worker_id: workerId }
    });

    res.json({ message: 'Worker deleted successfully', worker_id: workerId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;