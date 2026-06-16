const express = require('express');
const router = express.Router();
const resultController = require('../controllers/resultController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/', resultController.getHistory);
router.get('/:id', resultController.getResult);

module.exports = router;
