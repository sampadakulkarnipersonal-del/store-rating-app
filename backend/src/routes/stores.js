const express = require('express');
const router = express.Router();
const { getAllStores, submitRating, updateRating } = require('../controllers/storeController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate, authorize('user'));

router.get('/', getAllStores);
router.post('/:storeId/ratings', submitRating);
router.put('/:storeId/ratings', updateRating);

module.exports = router;
