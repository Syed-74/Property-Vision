const express = require('express');
const router = express.Router();

const {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
} = require('../controllers/property.controller');

// (Optional) Auth & role middlewares
// const authMiddleware = require('../middlewares/auth.middleware');
// const roleMiddleware = require('../middlewares/role.middleware');

/* =========================
   PROPERTY ROUTES
========================= */

/**
 * @route   POST /api/properties
 * @desc    Create a new property
 * @access  Admin / Staff
 */
router.post(
  '/',
  // authMiddleware,
  // roleMiddleware(['Admin', 'Staff']),
  createProperty
);

/**
 * @route   GET /api/properties
 * @desc    Get all properties (with filters)
 * @access  Public / Protected
 */
router.get(
  '/',
  // authMiddleware,
  getAllProperties
);

/**
 * @route   GET /api/properties/:id
 * @desc    Get property by ID
 * @access  Public / Protected
 */
router.get(
  '/:id',
  // authMiddleware,
  getPropertyById
);

/**
 * @route   PUT /api/properties/:id
 * @desc    Update property
 * @access  Admin / Staff
 */
router.put(
  '/:id',
  // authMiddleware,
  // roleMiddleware(['Admin', 'Staff']),
  updateProperty
);

/**
 * @route   DELETE /api/properties/:id
 * @desc    Soft delete property
 * @access  Admin only
 */
router.delete(
  '/:id',
  // authMiddleware,
  // roleMiddleware(['Admin']),
  deleteProperty
);

module.exports = router;
