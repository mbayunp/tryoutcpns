const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const { categoryValidation } = require('../validations/categoryValidation');

router.use(authMiddleware);

router.get('/', categoryController.getAllCategories);
router.post('/', adminMiddleware, categoryValidation, categoryController.createCategory);
router.put('/:id', adminMiddleware, categoryValidation, categoryController.updateCategory);
router.delete('/:id', adminMiddleware, categoryController.deleteCategory);

module.exports = router;
