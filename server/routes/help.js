const express = require('express');
const router = express.Router();
const helpController = require('../controllers/helpController');
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');

// User submits help request
router.post('/', auth, helpController.createHelp);
// Admin views all help requests
router.get('/', auth, roles('admin'), helpController.getAllHelp);
// Admin responds to help request
router.patch('/:id', auth, roles('admin'), helpController.respondHelp);
// Admin deletes a help request
router.delete('/:id', auth, roles('admin'), helpController.deleteHelp);

module.exports = router; 