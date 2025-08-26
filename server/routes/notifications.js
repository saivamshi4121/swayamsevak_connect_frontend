const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');

// Admin-only endpoints
router.post('/', auth, roles('admin'), notificationController.sendNotification);
router.get('/', auth, roles('admin'), notificationController.getAllNotifications);
router.delete('/:id', auth, roles('admin'), notificationController.deleteNotification);

// User endpoint: get my notifications
router.get('/my', auth, notificationController.getUserNotifications);

module.exports = router; 