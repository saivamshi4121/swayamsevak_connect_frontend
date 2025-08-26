const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');

// Admin stats endpoint
router.get('/admin/stats', auth, roles('admin'), adminController.getStats);

// All routes require admin authentication
router.get('/', auth, roles('admin'), userController.getAllUsers);
router.get('/:id', auth, roles('admin'), userController.getUser);
router.put('/:id', auth, roles('admin'), userController.updateUser);
router.delete('/:id', auth, roles('admin'), userController.deleteUser);

module.exports = router; 