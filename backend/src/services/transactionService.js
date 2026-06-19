const { Transaction, User, Tryout } = require('../models');

const createTransaction = async (userId, tryoutId, amount, proofImage) => {
  // Check if tryout exists
  const tryout = await Tryout.findByPk(tryoutId);
  if (!tryout) {
    const error = new Error('Tryout package not found');
    error.statusCode = 404;
    throw error;
  }

  // Generate transaction ID similar to the frontend's TRX-XXXXXX format
  // We append a random digit to minimize any collisions
  const randNum = Math.floor(10 + Math.random() * 90);
  const transactionId = `TRX-${Date.now().toString().slice(-4)}${randNum}`;

  const transaction = await Transaction.create({
    id: transactionId,
    user_id: userId,
    tryout_id: tryoutId,
    amount: amount || 'Rp 199.000',
    status: 'pending',
    payment_method: 'Manual Bank Transfer',
    proof_image: proofImage || null
  });

  return transaction;
};

const getTransactions = async (userId, isAdmin = false) => {
  const queryOptions = {
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['name', 'email']
      },
      {
        model: Tryout,
        as: 'tryout',
        attributes: ['title']
      }
    ],
    order: [['created_at', 'DESC']]
  };

  if (!isAdmin) {
    queryOptions.where = { user_id: userId };
  }

  const transactions = await Transaction.findAll(queryOptions);

  // Map to match the frontend expected transaction structure
  return transactions.map(trx => {
    return {
      id: trx.id,
      userName: trx.user ? trx.user.name : 'Unknown User',
      email: trx.user ? trx.user.email : 'unknown@user.com',
      package: trx.tryout ? trx.tryout.title : 'Unknown Package',
      amount: trx.amount,
      date: new Date(trx.created_at).toLocaleString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(/\./g, ':'),
      status: trx.status,
      proofImage: trx.proof_image
    };
  });
};

const updateTransactionStatus = async (transactionId, status) => {
  if (!['pending', 'success', 'failed'].includes(status)) {
    const error = new Error('Invalid transaction status');
    error.statusCode = 400;
    throw error;
  }

  const transaction = await Transaction.findByPk(transactionId);
  if (!transaction) {
    const error = new Error('Transaction not found');
    error.statusCode = 404;
    throw error;
  }

  transaction.status = status;
  await transaction.save();

  return transaction;
};

module.exports = {
  createTransaction,
  getTransactions,
  updateTransactionStatus
};
