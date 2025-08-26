const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');
const healthController = require('../controllers/healthController');

router.get('/', auth, roles('admin'), healthController.getSystemHealth);

module.exports = router;


