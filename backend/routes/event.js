const express = require('express');
const router = express.Router();

const {
  getAllEvents,
  createEvent,
  getMyEvents,
  deleteEvent
} = require('../controllers/eventController');

// =======================
// EVENTS ROUTES
// =======================

// Get all events (Home feed)
router.get('/', getAllEvents);

// Create new event
router.post('/', createEvent);

// Get events created by a specific user
// Example: /api/events/my?creator=Dhishaj
router.get('/my', getMyEvents);

// Delete event by ID
// Example: /api/events/64f8a...
router.delete('/:id', deleteEvent);

module.exports = router;
