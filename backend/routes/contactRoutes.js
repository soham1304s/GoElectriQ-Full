import express from 'express';
import { submitContactMessage, getAllContactMessages } from '../controllers/contactController.js';
import { protect } from '../middleware/auth.js';
import { isAdmin } from '../middleware/roleCheck.js';

const router = express.Router();

/**
 * @route   POST /api/contact
 * @desc    Submit a contact message
 * @access  Public
 */
router.post('/', submitContactMessage);

/**
 * @route   GET /api/contact
 * @desc    Get all contact messages
 * @access  Private (Admin)
 */
router.get('/', protect, isAdmin, getAllContactMessages);

export default router;
