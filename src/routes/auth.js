// src/routes/auth.js
const express = require('express');
const router = express.Router();
const prisma = require('../db/prisma'); // Prisma Client
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const { validationResult } = require('express-validator');
const { registerManagerValidator, loginValidator } = require('../utils/validators');

// --------------------
// Register Manager
// --------------------
router.post('/register', registerManagerValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password } = req.body;

  try {
    // Check if email exists
    const existing = await prisma.managers.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email already in use' });

    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
    const hash = await bcrypt.hash(password, saltRounds);

    // Create manager
    const manager = await prisma.managers.create({
      data: { name, email, password: hash }
    });

    res.status(201).json({
      manager: {
        manager_id: manager.manager_id,
        name: manager.name,
        email: manager.email
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// --------------------
// Manager Login
// --------------------
router.post('/login', loginValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;

  try {
    const manager = await prisma.managers.findUnique({ where: { email } });
    if (!manager) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, manager.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const payload = { manager_id: manager.manager_id, email: manager.email, name: manager.name };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '8h' });

    res.json({ token, manager: payload });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
