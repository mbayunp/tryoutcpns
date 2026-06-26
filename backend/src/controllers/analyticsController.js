const { Transaction, User, Tryout } = require('../models');
const response = require('../utils/response');

const cleanAmount = (amountStr) => {
  if (!amountStr) return 0;
  // Remove all non-numeric characters (like "Rp", ".", ",")
  const cleaned = amountStr.replace(/\D/g, '');
  return parseInt(cleaned, 10) || 0;
};

const getAnalytics = async (req, res, next) => {
  try {
    const { program_type } = req.query;

    // 1. User metrics
    const totalUsers = await User.count({ where: { role: 'user' } });
    const activeUsers = await User.count({ where: { role: 'user', is_active: true } });

    // 2. Transaction status counts
    const tryoutInclude = {
      model: Tryout,
      as: 'tryout',
      attributes: ['category', 'title', 'program_type']
    };

    if (program_type) {
      tryoutInclude.where = { program_type };
    }

    const transactions = await Transaction.findAll({
      include: [tryoutInclude]
    });

    let totalTransactions = transactions.length;
    let successTransactions = 0;
    let pendingTransactions = 0;
    let failedTransactions = 0;
    let totalRevenue = 0;

    // Grouping variables
    const dailyRevenueMap = {};
    const categoryDistributionMap = {
      'Tryout': 0,
      'Kelas Online': 0,
      'E-Book': 0,
      'Bundling': 0
    };

    transactions.forEach(t => {
      if (t.status === 'success') {
        successTransactions++;
        const numericAmount = cleanAmount(t.amount);
        totalRevenue += numericAmount;

        // Group by Date for Chart Data
        const dateStr = new Date(t.createdAt || t.created_at).toISOString().split('T')[0];
        if (!dailyRevenueMap[dateStr]) {
          dailyRevenueMap[dateStr] = { date: dateStr, revenue: 0, count: 0 };
        }
        dailyRevenueMap[dateStr].revenue += numericAmount;
        dailyRevenueMap[dateStr].count += 1;

        // Group by Category
        const category = (t.tryout && t.tryout.category) ? t.tryout.category : 'Tryout';
        if (categoryDistributionMap[category] !== undefined) {
          categoryDistributionMap[category]++;
        } else {
          categoryDistributionMap[category] = 1;
        }
      } else if (t.status === 'pending') {
        pendingTransactions++;
      } else if (t.status === 'failed') {
        failedTransactions++;
      }
    });

    // Format daily revenue array, sort by date ascending
    const revenueByDate = Object.values(dailyRevenueMap).sort((a, b) => new Date(a.date) - new Date(b.date));

    // Format category distribution array
    const categoryDistribution = Object.keys(categoryDistributionMap).map(category => ({
      category,
      count: categoryDistributionMap[category]
    }));

    return response.success(res, {
      summary: {
        totalRevenue,
        totalTransactions,
        successTransactions,
        pendingTransactions,
        failedTransactions,
        totalUsers,
        activeUsers
      },
      revenueByDate,
      categoryDistribution
    }, 'Analytics data retrieved successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAnalytics
};
