import express from 'express';
import { submitContactForm, getContactSubmissions, updateContactStatus } from './contact.controller.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

// Public route to submit contact form
router.post('/submit', submitContactForm);

// Protected routes for Admin
router.route('/')
  .get(protect, getContactSubmissions);

router.route('/:id/status')
  .put(protect, updateContactStatus);

export default router;
