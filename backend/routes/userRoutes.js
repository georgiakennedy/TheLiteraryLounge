const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const {createUser, getUsers, loginUser, updateUser, deleteUser, changePassword, getUserProfile} = require('../controllers/userController');
const auth = require('../middleware/auth');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array().map(err => err.msg) });
  }
  next();
};

router.post(
  '/',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('A valid email is required'),
    body('password')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
      .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special symbol'),
    body('confirmPassword')
      .notEmpty().withMessage('Confirm password is required')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords do not match');
        }
        return true;
      })
  ],
  validate,
  createUser
);

router.post(
  '/login',
  [
    body('credential').notEmpty().withMessage('Credential (username or email) is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validate,
  loginUser
);

router.put(
  '/change-password',
  auth,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8 }).withMessage('New password must be at least 8 characters long')
      .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('New password must contain at least one special symbol'),
    body('confirmNewPassword')
      .notEmpty().withMessage('Confirm new password is required')
      .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
          throw new Error('New passwords do not match');
        }
        return true;
      })
  ],
  validate,
  changePassword
);

router.get('/profile/:id', getUserProfile);

router.put(
  '/:id',
  [
    body('username').optional().notEmpty().withMessage('Username cannot be empty'),
    body('email').optional().isEmail().withMessage('Please provide a valid email'),
    body('bio').optional(),
    body('profilePicture').optional()
  ],
  validate,
  updateUser
);

router.delete('/:id', deleteUser);

router.get('/', getUsers);

module.exports = router;
