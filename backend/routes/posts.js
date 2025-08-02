const express = require('express');
const { body } = require('express-validator');
const {
  getPosts,
  createPost,
  getUserPosts,
  deletePost,
  likePost,
  unlikePost,
} = require('../controllers/postController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Validation rules 
const postValidation = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 1500 })
    .withMessage('Post content must be between 1 and 280 characters')
];

// Routes
router.route('/')
  .get(getPosts)
  .post(protect, postValidation, createPost);

router.get('/user/:userId', getUserPosts);

// Like and Unlike routes
router.post('/:id/like', protect, likePost);
router.post('/:id/unlike', protect, unlikePost);
router.delete('/:id', protect, deletePost);

module.exports = router;
