const express = require('express');
const router = express.Router();
const tryoutController = require('../controllers/tryoutController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const { tryoutValidation, startValidation, submitValidation } = require('../validations/tryoutValidation');

router.use(authMiddleware);

// Candidate / User Tryout Flow
router.get('/', tryoutController.getTryouts);
router.get('/:id', tryoutController.getTryoutById);
router.post('/start', startValidation, tryoutController.startTryout);
router.post('/submit', submitValidation, tryoutController.submitTryout);

// Administrative CRUD endpoints
router.post('/', adminMiddleware, tryoutValidation, tryoutController.createTryout);
router.put('/:id', adminMiddleware, tryoutValidation, tryoutController.updateTryout);
router.delete('/:id', adminMiddleware, tryoutController.deleteTryout);

// Package Questions Mapping
router.post('/:id/questions', adminMiddleware, tryoutController.assignQuestionsToPackage);
router.get('/:id/questions', tryoutController.getQuestionsForPackage);

module.exports = router;
