const transactionService = require('../services/transactionService');
const response = require('../utils/response');

const getTransactions = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const transactions = await transactionService.getTransactions(req.user.id, isAdmin);
    return response.success(res, transactions, 'Transactions retrieved successfully');
  } catch (err) {
    next(err);
  }
};

const createTransaction = async (req, res, next) => {
  try {
    const { tryout_id, amount } = req.body;
    if (!tryout_id) {
      return response.error(res, 'tryout_id is required', 400);
    }
    const transaction = await transactionService.createTransaction(req.user.id, tryout_id, amount);
    return response.success(res, transaction, 'Transaction created successfully', 201);
  } catch (err) {
    next(err);
  }
};

const updateTransactionStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return response.error(res, 'status is required', 400);
    }
    const transaction = await transactionService.updateTransactionStatus(id, status);
    return response.success(res, transaction, 'Transaction status updated successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTransactions,
  createTransaction,
  updateTransactionStatus
};
