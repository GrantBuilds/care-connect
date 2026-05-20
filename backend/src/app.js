// src/app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path'); // Add this line
dotenv.config();

const authRoutes = require('./routes/auth');
const billingRoutes = require('./routes/billing');
const shopRoutes = require('./routes/shops');
const workerRoutes = require('./routes/workers');
const ratingRoutes = require('./routes/ratings');
const uploadRoutes = require('./routes/upload'); // Add this line

const app = express();

app.use(cors());
app.use('/billing/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

// Serve uploaded files statically - Add this line
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/auth', authRoutes);
app.use('/billing', billingRoutes);
app.use('/shops', shopRoutes);
app.use('/workers', workerRoutes);
app.use('/ratings', ratingRoutes);
app.use('/upload', uploadRoutes); // Add this line

// Health check
app.get('/', (req, res) => res.json({ ok: true }));

// Export the app
module.exports = app;
