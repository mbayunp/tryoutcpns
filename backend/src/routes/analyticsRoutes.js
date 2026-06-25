const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Secure all endpoints in this router to admin access
router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/', analyticsController.getAnalytics);

module.exports = router;
