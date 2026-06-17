const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const { questionValidation } = require('../validations/questionValidation');

router.use(authMiddleware);
router.use(adminMiddleware); // All question CRUD routes are admin-only

router.get('/', questionController.getAllQuestions);
router.post('/bulk', questionController.bulkCreateQuestions);
router.post('/', questionValidation, questionController.createQuestion);
router.put('/:id', questionValidation, questionController.updateQuestion);
router.delete('/:id', questionController.deleteQuestion);

module.exports = router;
