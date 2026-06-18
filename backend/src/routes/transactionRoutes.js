const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.use(authMiddleware);

// Retrieve transactions
router.get('/', transactionController.getTransactions);

// Create a new transaction (user initiates tryout package purchase)
router.post('/', transactionController.createTransaction);

// Update status of transaction (admin verifies / rejects payment)
router.put('/:id/status', adminMiddleware, transactionController.updateTransactionStatus);

module.exports = router;
