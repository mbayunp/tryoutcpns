const { ReferralCode } = require('../models');
const response = require('../utils/response');

const validateReferralCode = async (req, res, next) => {
  try {
    const { code } = req.body;
    if (!code) {
      return response.error(res, 'Referral code is required', 400);
    }
    const referral = await ReferralCode.findOne({
      where: {
        code: code.trim(),
        is_active: true
      }
    });
    if (!referral) {
      return response.error(res, 'Referral code is invalid or inactive', 404);
    }
    return response.success(res, {
      id: referral.id,
      code: referral.code,
      discount_percentage: referral.discount_percentage,
      is_active: referral.is_active
    }, 'Referral code is valid');
  } catch (err) {
    next(err);
  }
};

// Admin Endpoints:
const getAllReferrals = async (req, res, next) => {
  try {
    const referrals = await ReferralCode.findAll({
      order: [['created_at', 'DESC']]
    });
    return response.success(res, referrals, 'All referral codes retrieved successfully');
  } catch (err) {
    next(err);
  }
};

const createReferralCode = async (req, res, next) => {
  try {
    const { code, discount_percentage, is_active } = req.body;
    if (!code) {
      return response.error(res, 'Referral code is required', 400);
    }
    if (discount_percentage === undefined || discount_percentage === null) {
      return response.error(res, 'Discount percentage is required', 400);
    }

    const uppercaseCode = code.trim().toUpperCase();

    // Check uniqueness
    const existing = await ReferralCode.findOne({ where: { code: uppercaseCode } });
    if (existing) {
      return response.error(res, 'Referral code already exists', 400);
    }

    const referral = await ReferralCode.create({
      code: uppercaseCode,
      discount_percentage: parseInt(discount_percentage, 10),
      is_active: is_active !== undefined ? is_active : true,
      usage_count: 0
    });

    return response.success(res, referral, 'Referral code created successfully', 201);
  } catch (err) {
    next(err);
  }
};

const updateReferralCode = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { code, discount_percentage, is_active } = req.body;

    const referral = await ReferralCode.findByPk(id);
    if (!referral) {
      return response.error(res, 'Referral code not found', 404);
    }

    if (code !== undefined) {
      const uppercaseCode = code.trim().toUpperCase();
      // If code changed, check uniqueness
      if (uppercaseCode !== referral.code) {
        const existing = await ReferralCode.findOne({ where: { code: uppercaseCode } });
        if (existing) {
          return response.error(res, 'Referral code already exists', 400);
        }
        referral.code = uppercaseCode;
      }
    }

    if (discount_percentage !== undefined) {
      referral.discount_percentage = parseInt(discount_percentage, 10);
    }

    if (is_active !== undefined) {
      referral.is_active = is_active;
    }

    await referral.save();

    return response.success(res, referral, 'Referral code updated successfully');
  } catch (err) {
    next(err);
  }
};

const deleteReferralCode = async (req, res, next) => {
  try {
    const { id } = req.params;
    const referral = await ReferralCode.findByPk(id);
    if (!referral) {
      return response.error(res, 'Referral code not found', 404);
    }

    await referral.destroy();
    return response.success(res, null, 'Referral code deleted successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  validateReferralCode,
  getAllReferrals,
  createReferralCode,
  updateReferralCode,
  deleteReferralCode
};
