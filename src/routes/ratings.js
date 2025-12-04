// src/routes/ratings.js
const express = require('express');
const router = express.Router();
const prisma = require('../db/prisma');
const { validationResult } = require('express-validator');
const { createRatingValidator } = require('../utils/validators');

// Get all ratings (public)
router.get('/', async (req, res) => {
  try {
    const ratings = await prisma.ratings.findMany({
      include: { workers: true }
    });
    res.json(ratings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get rating by ID (public)
router.get('/:ratingId', async (req, res) => {
  try {
    const rating = await prisma.ratings.findUnique({
      where: { rating_id: parseInt(req.params.ratingId) },
      include: { workers: true }
    });

    if (!rating) {
      return res.status(404).json({ error: 'Rating not found' });
    }

    res.json(rating);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get ratings by worker (public)
router.get('/worker/:workerId', async (req, res) => {
  try {
    const ratings = await prisma.ratings.findMany({
      where: { worker_id: parseInt(req.params.workerId) }
    });
    res.json(ratings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get average rating for a worker (public)
router.get('/worker/:workerId/average', async (req, res) => {
  try {
    const workerId = parseInt(req.params.workerId);

    // Verify worker exists
    const worker = await prisma.workers.findUnique({
      where: { worker_id: workerId }
    });

    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    // Calculate average
    const result = await prisma.ratings.aggregate({
      where: { worker_id: workerId },
      _avg: { rating: true },
      _count: { rating: true }
    });

    res.json({
      worker_id: workerId,
      average_rating: result._avg.rating || 0,
      total_ratings: result._count.rating
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a rating (public + validated)
router.post('/', createRatingValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { worker_id, rating, comment } = req.body;
  
  try {
    // Verify worker exists
    const worker = await prisma.workers.findUnique({
      where: { worker_id }
    });

    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    const newRating = await prisma.ratings.create({
      data: { worker_id, rating, comment }
    });
    res.status(201).json(newRating);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a rating (public - anyone can delete, or you can protect this)
router.delete('/:ratingId', async (req, res) => {
  const ratingId = parseInt(req.params.ratingId);

  try {
    const rating = await prisma.ratings.findUnique({
      where: { rating_id: ratingId }
    });

    if (!rating) {
      return res.status(404).json({ error: 'Rating not found' });
    }

    await prisma.ratings.delete({
      where: { rating_id: ratingId }
    });

    res.json({ message: 'Rating deleted successfully', rating_id: ratingId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;