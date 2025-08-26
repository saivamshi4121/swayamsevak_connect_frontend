const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');
const analyticsController = require('../controllers/analyticsController');

router.get('/overview', auth, roles('admin'), analyticsController.getAnalyticsOverview);

module.exports = router;


