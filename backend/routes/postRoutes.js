const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { createPost, getPosts, updatePost, deletePost, likePost, unlikePost } = require('../controllers/postController');
const auth = require('../middleware/auth');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array().map(err => err.msg) });
  }
  next();
};

const allowedCategories = ['tips & tricks', 'discussions', 'get inspired', 'resources', 'Self promo'];

router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('category')
      .notEmpty().withMessage('Category is required')
      .isIn(allowedCategories)
      .withMessage('Please select category from provided options')
  ],
  validate,
  createPost
);

router.put(
  '/:id',
  [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('category')
      .optional()
      .notEmpty().withMessage('Category is required if provided')
      .isIn(allowedCategories)
      .withMessage('Please select category from provided options')
  ],
  validate,
  updatePost
);

router.get('/', getPosts);
router.delete('/:id', deletePost);
router.post('/:id/like', auth, likePost);
router.post('/:id/unlike', auth, unlikePost);

module.exports = router;
