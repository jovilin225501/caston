import express from 'express';
import {
  submitContactMessage,
  getContactMessages,
  updateContactMessageStatus,
} from '../controllers/contactController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(submitContactMessage)
  .get(protect, adminOnly, getContactMessages);

router.route('/:id')
  .put(protect, adminOnly, updateContactMessageStatus);

export default router;
