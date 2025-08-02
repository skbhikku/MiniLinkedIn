const express = require('express');
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Routes
router.get('/:id', getUserProfile);
router.put('/:id', protect, updateUserProfile);

module.exports = router;