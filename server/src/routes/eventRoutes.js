import express from 'express';
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../controllers/eventController.js';
import {
  registerForEvent,
  cancelRegistration,
  getEventRegistrations,
} from '../controllers/registrationController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getEvents)
  .post(protect, adminOnly, createEvent);

router.route('/:id')
  .get(getEventById)
  .put(protect, adminOnly, updateEvent)
  .delete(protect, adminOnly, deleteEvent);

router.route('/:id/register')
  .post(protect, registerForEvent)
  .delete(protect, cancelRegistration);

router.route('/:id/registrations')
  .get(protect, adminOnly, getEventRegistrations);

export default router;
