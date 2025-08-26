const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const auth = require('../middleware/auth');

// All routes require authentication
router.post('/', auth, resourceController.createResource);
router.get('/', auth, resourceController.getAllResources);
router.get('/:id', auth, resourceController.getResource);
router.put('/:id', auth, resourceController.updateResource);
router.delete('/:id', auth, resourceController.deleteResource);

module.exports = router; 