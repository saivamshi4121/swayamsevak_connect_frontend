const express = require('express');
const router = express.Router();
const sevaController = require('../controllers/sevaController');
const auth = require('../middleware/auth');

// All routes require authentication
router.post('/', auth, sevaController.createSeva);
router.get('/', auth, sevaController.getAllSevas);
router.get('/:id', auth, sevaController.getSeva);
router.put('/:id', auth, sevaController.updateSeva);
router.delete('/:id', auth, sevaController.deleteSeva);

module.exports = router; 