import express from 'express';
import { getMyRegistrations } from '../controllers/registrationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/my', protect, getMyRegistrations);

export default router;
