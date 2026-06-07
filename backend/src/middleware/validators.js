const { body } = require('express-validator');

const passwordRules = (field = 'password') =>
  body(field)
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be 8-16 characters.')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter.')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must contain at least one special character.');

const signupValidation = [
  body('name')
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage('Name must be 20-60 characters.'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Enter a valid email address.'),
  body('address')
    .optional()
    .isLength({ max: 400 })
    .withMessage('Address cannot exceed 400 characters.'),
  passwordRules('password'),
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Enter a valid email address.'),
  body('password').notEmpty().withMessage('Password is required.'),
];

const updatePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required.'),
  passwordRules('newPassword'),
];

const createUserValidation = [
  body('name')
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage('Name must be 20-60 characters.'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Enter a valid email address.'),
  body('address')
    .optional()
    .isLength({ max: 400 })
    .withMessage('Address cannot exceed 400 characters.'),
  body('role')
    .optional()
    .isIn(['admin', 'user', 'store_owner'])
    .withMessage('Role must be admin, user, or store_owner.'),
  passwordRules('password'),
];

const createStoreValidation = [
  body('name')
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage('Store name must be 20-60 characters.'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Enter a valid email address.'),
  body('address')
    .optional()
    .isLength({ max: 400 })
    .withMessage('Address cannot exceed 400 characters.'),
];

module.exports = {
  signupValidation,
  loginValidation,
  updatePasswordValidation,
  createUserValidation,
  createStoreValidation,
};
