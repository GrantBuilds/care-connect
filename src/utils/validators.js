// src/utils/validators.js
const { body, param } = require('express-validator');

// Auth Validators
const registerManagerValidator = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .trim(),
  
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Valid email required')
    .isLength({ max: 150 })
    .withMessage('Email must not exceed 150 characters')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
];

const loginValidator = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Valid email required')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Shop Validators
const createShopValidator = [
  body('name')
    .notEmpty()
    .withMessage('Shop name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Shop name must be between 2 and 100 characters')
    .trim(),
  
  body('location')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Location must not exceed 200 characters')
    .trim(),
  
  body('qr_code_link')
    .optional()
    .isURL()
    .withMessage('QR code link must be a valid URL')
];

const updateShopValidator = [
  param('shopId')
    .isInt({ min: 1 })
    .withMessage('Invalid shop ID'),
  
  body('name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Shop name must be between 2 and 100 characters')
    .trim(),
  
  body('location')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Location must not exceed 200 characters')
    .trim(),
  
  body('qr_code_link')
    .optional()
    .isURL()
    .withMessage('QR code link must be a valid URL')
];

// Worker Validators
const createWorkerValidator = [
  body('shop_id')
    .notEmpty()
    .withMessage('Shop ID is required')
    .isInt({ min: 1 })
    .withMessage('Shop ID must be a valid positive integer'),
  
  body('name')
    .notEmpty()
    .withMessage('Worker name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Worker name must be between 2 and 100 characters')
    .trim(),
  
  body('role')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Role must not exceed 100 characters')
    .trim(),
  
  body('photo_url')
    .optional()
    .isURL()
    .withMessage('Photo URL must be a valid URL')
];

const updateWorkerValidator = [
  param('workerId')
    .isInt({ min: 1 })
    .withMessage('Invalid worker ID'),
  
  body('name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Worker name must be between 2 and 100 characters')
    .trim(),
  
  body('role')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Role must not exceed 100 characters')
    .trim(),
  
  body('photo_url')
    .optional()
    .isURL()
    .withMessage('Photo URL must be a valid URL')
];

// Rating Validators
const createRatingValidator = [
  body('worker_id')
    .notEmpty()
    .withMessage('Worker ID is required')
    .isInt({ min: 1 })
    .withMessage('Worker ID must be a valid positive integer'),
  
  body('rating')
    .notEmpty()
    .withMessage('Rating is required')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  body('comment')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Comment must not exceed 500 characters')
    .trim()
];

module.exports = {
  registerManagerValidator,
  loginValidator,
  createShopValidator,
  updateShopValidator,
  createWorkerValidator,
  updateWorkerValidator,
  createRatingValidator
};