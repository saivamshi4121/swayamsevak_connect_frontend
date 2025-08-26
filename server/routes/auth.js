const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Register new user
router.post('/register', authController.register);

// Login (admin or user)
router.post('/login', authController.login);

// Get current user profile
router.get('/me', auth, authController.getProfile);

module.exports = router; 