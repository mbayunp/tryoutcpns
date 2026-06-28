const { Transaction, User, Tryout, Announcement, ReferralCode } = require('../models');

const formatRupiah = (num) => {
  return 'Rp ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const createTransaction = async (userId, tryoutId, amount, proofImage, referralCode) => {
  // Check if tryout exists
  const tryout = await Tryout.findByPk(tryoutId);
  if (!tryout) {
    const error = new Error('Tryout package not found');
    error.statusCode = 404;
    throw error;
  }

  let finalAmount = tryout.price || 0;
  let appliedCode = null;

  if (referralCode) {
    const ref = await ReferralCode.findOne({
      where: {
        code: referralCode.trim(),
        is_active: true
      }
    });
    if (!ref) {
      const error = new Error('Referral code is invalid or inactive');
      error.statusCode = 400;
      throw error;
    }

    // Discount Stacking: Referral discount applies to tryout.price (already discounted price)
    finalAmount = Math.round(finalAmount - (finalAmount * ref.discount_percentage / 100));
    appliedCode = ref.code;

    // Increment usage count
    ref.usage_count = (ref.usage_count || 0) + 1;
    await ref.save();
  }

  // Use backend calculated amount formatted as Rupiah
  const finalAmountStr = formatRupiah(finalAmount);

  // Generate transaction ID similar to the frontend's TRX-XXXXXX format
  // We append a random digit to minimize any collisions
  const randNum = Math.floor(10 + Math.random() * 90);
  const transactionId = `TRX-${Date.now().toString().slice(-4)}${randNum}`;

  const transaction = await Transaction.create({
    id: transactionId,
    user_id: userId,
    tryout_id: tryoutId,
    amount: finalAmountStr,
    status: 'pending',
    payment_method: 'Manual Bank Transfer',
    proof_image: proofImage || null,
    referral_code: appliedCode
  });

  return transaction;
};

const getTransactions = async (userId, isAdmin = false, programType = null) => {
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
        attributes: ['title', 'program_type']
      }
    ],
    order: [['created_at', 'DESC']]
  };

  if (!isAdmin) {
    queryOptions.where = { user_id: userId };
  }

  if (programType) {
    queryOptions.include[1].where = { program_type: programType };
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

  const oldStatus = transaction.status;
  transaction.status = status;
  await transaction.save();

  // If status changed to success or failed, generate a targeted notification for the user
  if (oldStatus !== status && (status === 'success' || status === 'failed')) {
    try {
      const tryout = await Tryout.findByPk(transaction.tryout_id);
      const tryoutTitle = tryout ? tryout.title : 'Paket Ujian';
      
      let notificationText = '';
      if (status === 'success') {
        notificationText = `Pembayaran Anda untuk paket "${tryoutTitle}" telah berhasil dikonfirmasi. Paket Anda kini aktif!`;
      } else {
        notificationText = `Pembayaran Anda untuk paket "${tryoutTitle}" ditolak atau gagal dikonfirmasi. Silakan hubungi admin atau unggah kembali bukti pembayaran yang benar.`;
      }

      await Announcement.create({
        text: notificationText,
        link: '/dashboard',
        is_active: true,
        user_id: transaction.user_id
      });
    } catch (notifErr) {
      // Don't crash the transaction status update if notification fails
      console.error('Failed to create payment confirmation notification:', notifErr);
    }
  }

  return transaction;
};

const uploadProof = async (transactionId, userId, proofImage) => {
  const transaction = await Transaction.findOne({
    where: {
      id: transactionId,
      user_id: userId
    }
  });

  if (!transaction) {
    const error = new Error('Transaction not found');
    error.statusCode = 404;
    throw error;
  }

  transaction.proof_image = proofImage || null;
  await transaction.save();
  return transaction;
};

module.exports = {
  createTransaction,
  getTransactions,
  updateTransactionStatus,
  uploadProof
};
