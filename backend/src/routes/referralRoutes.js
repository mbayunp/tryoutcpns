const express = require('express');
const router = express.Router();
const referralController = require('../controllers/referralController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Authenticated routes
router.use(authMiddleware);

// User endpoints
router.post('/validate', referralController.validateReferralCode);

// Admin endpoints
router.get('/', adminMiddleware, referralController.getAllReferrals);
router.post('/', adminMiddleware, referralController.createReferralCode);
router.put('/:id', adminMiddleware, referralController.updateReferralCode);
router.delete('/:id', adminMiddleware, referralController.deleteReferralCode);

module.exports = router;
