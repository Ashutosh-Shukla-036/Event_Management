import express from "express";
import { validateCreateEvent, validateRegistration } from "../middleware/validation.js"
import {
  createEvent,
  getEventById,
  registerForEvent,
  cancelRegistration,
  getUpcomingEvents,
  getEventStats
} from "../controllers/eventController.js";

const router = express.Router();

router.post('/', validateCreateEvent, createEvent);
router.get('/upcoming', getUpcomingEvents);
router.get('/:id', getEventById);
router.post('/:id/register', validateRegistration, registerForEvent);
router.delete('/:id/cancel', validateRegistration, cancelRegistration);
router.get('/:id/stats', getEventStats);

export default router;
