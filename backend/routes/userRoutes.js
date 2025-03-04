const express = require('express');
const router = express.Router();
const { createUser, getUsers, loginUser, deleteUser, changePassword, getUserProfile, updateUserProfile } = require('../controllers/userController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const validate = (req, res, next) => {
  const errors = require('express-validator').validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array().map(err => err.msg) });
  }
  next();
};

router.post(
  '/',
  [
    require('express-validator').body('username').notEmpty().withMessage('Username is required'),
    require('express-validator').body('email').isEmail().withMessage('A valid email is required'),
    require('express-validator').body('password')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
      .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special symbol'),
    require('express-validator').body('confirmPassword')
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
    require('express-validator').body('credential').notEmpty().withMessage('Credential (username or email) is required'),
    require('express-validator').body('password').notEmpty().withMessage('Password is required')
  ],
  validate,
  loginUser
);

router.put(
  '/change-password',
  auth,
  [
    require('express-validator').body('currentPassword').notEmpty().withMessage('Current password is required'),
    require('express-validator').body('newPassword')
      .isLength({ min: 8 }).withMessage('New password must be at least 8 characters long')
      .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('New password must contain at least one special symbol'),
    require('express-validator').body('confirmNewPassword')
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
router.put('/profile/:id', auth, upload.single('profilePicture'), updateUserProfile);

router.delete('/:id', deleteUser);
router.get('/', getUsers);

module.exports = router;
