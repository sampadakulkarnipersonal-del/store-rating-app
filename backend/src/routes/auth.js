const express = require('express');
const router = express.Router();
const { signup, login, updatePassword, getMe } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const {
  signupValidation,
  loginValidation,
  updatePasswordValidation,
} = require('../middleware/validators');

router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);
router.get('/me', authenticate, getMe);
router.put('/update-password', authenticate, updatePasswordValidation, updatePassword);

module.exports = router;
