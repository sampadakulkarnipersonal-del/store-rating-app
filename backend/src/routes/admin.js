const express = require('express');
const router = express.Router();
const {
  getDashboard,
  getUsers,
  getUserById,
  createUser,
  getStores,
  createStore,
} = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');
const { createUserValidation, createStoreValidation } = require('../middleware/validators');

router.use(authenticate, authorize('admin'));

router.get('/dashboard', getDashboard);
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUserValidation, createUser);
router.get('/stores', getStores);
router.post('/stores', createStoreValidation, createStore);

module.exports = router;
