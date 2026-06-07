const express = require('express');
const router = express.Router();
const { getOwnerDashboard } = require('../controllers/ownerController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate, authorize('store_owner'));

router.get('/dashboard', getOwnerDashboard);

module.exports = router;
