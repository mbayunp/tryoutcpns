const express = require('express');
const router = express.Router();
const tryoutController = require('../controllers/tryoutController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

// POST /api/attempts (Submit final score & detailed answers map)
router.post('/', tryoutController.saveAttemptResult);

module.exports = router;
