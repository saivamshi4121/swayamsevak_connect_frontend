const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const auth = require('../middleware/auth');

// Public route for events (no auth required for viewing)
router.get('/public', eventController.getAllEvents);

// All other routes require authentication
router.post('/', auth, eventController.createEvent);
router.get('/', auth, eventController.getAllEvents);
router.get('/:id', auth, eventController.getEvent);
router.put('/:id', auth, eventController.updateEvent);
router.delete('/:id', auth, eventController.deleteEvent);

// Interest endpoints
router.post('/:id/interest', auth, eventController.addInterest);
router.delete('/:id/interest', auth, eventController.removeInterest);

module.exports = router; 